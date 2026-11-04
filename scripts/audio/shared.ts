import {existsSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {spawnSync} from 'node:child_process';

if (existsSync('.env')) loadEnvFile('.env');

export function approvedKey(operation: string): string {
  if (!process.argv.includes('--approved')) throw new Error(`Obtain approval before ${operation}, then add --approved.`);
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Set OPENAI_API_KEY in the local environment.');
  return key;
}

export function runMedia(program: string, args: string[]) {
  const result = spawnSync(program, args, {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `${program} exited ${result.status}`);
  return result;
}
