import assert from 'node:assert/strict';
import {runMedia} from '../audio/shared';

const asset = process.argv[2] ?? 'renders/previews/technical-proof.mp4';
const {stdout} = runMedia(process.env.FFPROBE || 'ffprobe', [
  '-v', 'error', '-count_frames', '-show_entries',
  'stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_frames,pix_fmt,sample_rate',
  '-of', 'json', asset,
]);
const {streams} = JSON.parse(stdout) as {streams: Record<string, string | number>[]};
const video = streams.find((stream) => stream.codec_type === 'video');
const audio = streams.find((stream) => stream.codec_type === 'audio');
assert.equal(video?.codec_name, 'h264');
assert.equal(video?.width, 1920);
assert.equal(video?.height, 1080);
assert.equal(video?.r_frame_rate, '30/1');
assert.equal(video?.nb_read_frames, '150');
assert.equal(video?.pix_fmt, 'yuv420p');
assert.equal(audio?.codec_name, 'aac');
assert.equal(audio?.sample_rate, '48000');

const {stderr} = runMedia(process.env.FFMPEG || 'ffmpeg', [
  '-hide_banner', '-nostdin', '-i', asset, '-vn',
  '-af', 'silencedetect=noise=-45dB:d=0.1', '-f', 'null', '-',
]);
const start = Number(stderr.match(/silence_end: ([\d.]+)/)?.[1]);
const end = Number([...stderr.matchAll(/silence_start: ([\d.]+)/g)][1]?.[1]);
assert.ok(Math.abs(start - 1) < 1 / 30, `Audio cue starts at ${start}s, expected frame 30.`);
assert.ok(Math.abs(end - 1.25) < 1 / 30, `Audio cue ends at ${end}s, expected 1.25s.`);
console.log(`1920×1080, 30 fps, 150 H.264 frames. AAC cue ${start}s–${end}s at 48 kHz.`);
