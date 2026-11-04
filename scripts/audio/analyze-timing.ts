import {z} from 'zod';
import {runMedia} from './shared';

const [, , asset, fpsArgument = '30'] = process.argv;
if (!asset) throw new Error('Usage: npm run audio:timing -- TAKE.wav [FPS]');
const fps = z.coerce.number().positive().finite().parse(fpsArgument);
const {stdout} = runMedia(process.env.FFPROBE || 'ffprobe', [
  '-v', 'error', '-select_streams', 'a:0', '-show_entries',
  'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', '-i', asset,
]);
const probe = z.object({
  streams: z.array(z.object({codec_name: z.string(), sample_rate: z.string(), channels: z.number()})).nonempty(),
  format: z.object({duration: z.coerce.number().positive()}),
}).parse(JSON.parse(stdout));
const durationSeconds = probe.format.duration;
console.log(JSON.stringify({asset, fps, durationSeconds, frames: Math.ceil(durationSeconds * fps), ...probe.streams[0]}, null, 2));
