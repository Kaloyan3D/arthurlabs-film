import OpenAI from 'openai';
import {z} from 'zod';
import {approvedKey} from './shared';

try {
  const apiKey = approvedKey('creating a saved voice');
  const prompt = z.string().trim().min(1).parse(process.env.ARTHURLABS_VOICE_PROMPT ?? '');
  const client = new OpenAI({apiKey, baseURL: 'https://api.openai.com/v1', maxRetries: 0, timeout: 60_000});
  const voice = await client.audio.voices.create({
    type: 'prompt',
    name: process.env.ARTHURLABS_VOICE_NAME || 'ArthurLabs audition',
    prompt,
    model: 'auto',
  });
  console.log(`Set ARTHURLABS_LIVE_VOICE=${voice.id} in your local .env.`);
} catch (error) {
  console.error(error instanceof OpenAI.APIError ? `Voice API error (HTTP ${error.status ?? 'unknown'}).` : (error as Error).message);
  process.exitCode = 1;
}
