import {resolve} from 'node:path';
import {runMedia} from './shared';

const [, , input, output] = process.argv;
if (!input || !output?.endsWith('.wav') || resolve(input) === resolve(output)) {
  throw new Error('Usage: npm run audio:normalize -- INPUT.wav NEW-OUTPUT.wav');
}

const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const filter = 'loudnorm=I=-16:TP=-1.5:LRA=11';
const {stderr} = runMedia(ffmpeg, ['-hide_banner', '-nostdin', '-i', input, '-vn', '-af', `${filter}:print_format=json`, '-f', 'null', '-']);
const measurement = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
const keys = {measured_I: 'input_i', measured_TP: 'input_tp', measured_LRA: 'input_lra', measured_thresh: 'input_thresh', offset: 'target_offset'};
const measured = Object.entries(keys).map(([option, key]) => {
  const value = Number(measurement[key]);
  if (!Number.isFinite(value)) throw new Error('The take has no measurable loudness.');
  return `${option}=${value}`;
}).join(':');
runMedia(ffmpeg, ['-hide_banner', '-nostdin', '-n', '-i', input, '-vn', '-af', `${filter}:${measured}:linear=true`, '-ar', '48000', '-c:a', 'pcm_s24le', output]);
