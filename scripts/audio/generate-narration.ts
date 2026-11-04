import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import OpenAI from 'openai';
import {z} from 'zod';
import {approvedKey} from './shared';
import {auditionLive} from './live';

function wave(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF');
  header.writeUInt32LE(pcm.length + 36, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24_000, 24);
  header.writeUInt32LE(48_000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

try {
  const apiKey = approvedKey('making a billable narration request');
  const [scriptPath, output] = process.argv.slice(2).filter((arg) => arg !== '--approved');
  if (!scriptPath || !output?.endsWith('.wav')) throw new Error('Usage: npm run audio:narration -- SCRIPT.txt TAKE.wav --approved');
  if (existsSync(output) || existsSync(`${output}.transcript.txt`)) throw new Error('Choose a fresh output path.');
  const input = z.string().trim().min(1).max(4096).parse(await readFile(scriptPath, 'utf8'));
  const provider = z.enum(['speech', 'live']).parse(process.env.ARTHURLABS_AUDIO_PROVIDER || 'speech');
  const delivery = process.env.ARTHURLABS_DELIVERY || 'Clear, measured English narration.';
  if (provider === 'speech') {
    const client = new OpenAI({apiKey, baseURL: 'https://api.openai.com/v1', maxRetries: 0, timeout: 120_000});
    const voice = process.env.ARTHURLABS_SPEECH_VOICE || 'marin';
    if (voice.startsWith('voice_')) throw new Error('Use a named Speech API voice. Prompt-created voice IDs require GPT-Live.');
    const result = await client.audio.speech.create({
      model: process.env.ARTHURLABS_SPEECH_MODEL || 'gpt-4o-mini-tts',
      voice, input, instructions: delivery, response_format: 'wav',
    });
    await writeFile(output, Buffer.from(await result.arrayBuffer()), {flag: 'wx'});
  } else {
    const seconds = z.coerce.number().int().min(5).max(90).parse(process.env.ARTHURLABS_LIVE_CAPTURE_SECONDS || '20');
    const {pcm, transcript} = await auditionLive(apiKey, process.env.ARTHURLABS_LIVE_MODEL || 'gpt-live-1',
      process.env.ARTHURLABS_LIVE_VOICE || 'marin', input, delivery, seconds);
    await writeFile(output, wave(pcm), {flag: 'wx'});
    await writeFile(`${output}.transcript.txt`, transcript, {flag: 'wx'});
    console.log('GPT-Live audition saved. Check wording and completeness against the script before use.');
  }
} catch (error) {
  console.error(error instanceof OpenAI.APIError ? `Speech API error (HTTP ${error.status ?? 'unknown'}).` : (error as Error).message);
  process.exitCode = 1;
}
