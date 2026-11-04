import {randomUUID} from 'node:crypto';
import WebSocket from 'ws';
import {z} from 'zod';

const LiveEvent = z.object({
  type: z.string(),
  delta: z.string().optional(),
  client_event_id: z.string().optional(),
});

export function auditionLive(apiKey: string, model: string, voice: string, script: string, delivery: string, seconds: number) {
  return new Promise<{pcm: Buffer; transcript: string}>((resolve, reject) => {
    const socket = new WebSocket('wss://api.openai.com/v1/live/sessions', {
      headers: {Authorization: `Bearer ${apiKey}`}, maxPayload: 2 * 1024 * 1024,
    });
    const pcm: Buffer[] = [];
    let transcript = '';
    let receivedBytes = 0;
    let silenceTimer: ReturnType<typeof setInterval> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const closeId = randomUUID();
    const silence = Buffer.alloc(960).toString('base64');
    const prompt = `Begin immediately. Read this passage aloud in English with no preamble, then stay silent.\n${script}`;

    function cleanup() {
      clearInterval(silenceTimer);
      clearTimeout(closeTimer);
      clearTimeout(deadline);
    }

    function fail(message: string) {
      cleanup();
      socket.terminate();
      reject(new Error(message));
    }

    function send(event: object) {
      socket.send(JSON.stringify(event), (error) => {
        if (error) fail('Could not send a GPT-Live event.');
      });
    }

    const deadline = setTimeout(() => fail('GPT-Live did not acknowledge session closure before the deadline.'), (seconds + 30) * 1000);

    socket.once('open', () => send({
      type: 'session.start',
      session: {
        model,
        instructions: delivery,
        input: [{type: 'message', role: 'developer', content: [{type: 'input_text', text: prompt}]}],
        audio: {format: {type: 'audio/pcm', rate: 24000}, output: {voice: voice.startsWith('voice_') ? {id: voice} : voice}},
        delegation: {type: 'client'},
      },
    }));

    socket.on('message', (raw) => {
      try {
        const event = LiveEvent.parse(JSON.parse(raw.toString()));
        if (event.type === 'session.started' && !started) {
          started = true;
          send({type: 'session.commentary.append', event_id: randomUUID(), delegation_id: null, content: prompt});
          silenceTimer = setInterval(() => {
            if (socket.bufferedAmount > 64 * 1024) return fail('GPT-Live audio transport stalled.');
            send({type: 'session.input_audio.append', audio: silence});
          }, 20);
          closeTimer = setTimeout(() => {
            clearInterval(silenceTimer);
            send({type: 'session.close', event_id: closeId});
          }, seconds * 1000);
        } else if (event.type === 'session.output_audio.delta' && event.delta) {
          const chunk = Buffer.from(event.delta, 'base64');
          receivedBytes += chunk.length;
          if (receivedBytes > (seconds + 15) * 48_000) return fail('GPT-Live exceeded the audition capture limit.');
          pcm.push(chunk);
        } else if (event.type === 'session.output_transcript.delta') {
          transcript += event.delta ?? '';
        } else if (event.type === 'session.closed' && event.client_event_id === closeId) {
          if (!receivedBytes || receivedBytes % 2 || !transcript.trim()) return fail('GPT-Live returned no reviewable audio and transcript.');
          cleanup();
          resolve({pcm: Buffer.concat(pcm), transcript});
          socket.close();
        } else if (event.type === 'error') {
          fail('GPT-Live rejected the session or an event.');
        }
      } catch {
        fail('GPT-Live returned an invalid event.');
      }
    });
    socket.on('error', () => fail('GPT-Live WebSocket connection failed.'));
    socket.on('close', () => fail('GPT-Live transport closed without an acknowledged session close.'));
  });
}
