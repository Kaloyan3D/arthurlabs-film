import {writeFileSync} from 'node:fs';

const rate = 48000;
const tau = 2 * Math.PI;
const sine = (hz, t, phase = 0) => Math.sin(tau * hz * t + phase);
const smooth = (x) => {
  const v = Math.min(1, Math.max(0, x));
  return v * v * (3 - 2 * v);
};
const swell = (t, start, end, attack, release) =>
  smooth((t - start) / attack) * smooth((end - t) / release);

function save(name, seconds, offset, sample) {
  const bytes = rate * seconds * 4;
  const wav = Buffer.alloc(bytes + 44);
  wav.write('RIFF');
  wav.writeUInt32LE(bytes + 36, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 4, 28);
  wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(bytes, 40);
  for (let i = 0; i < rate * seconds; i++) {
    const [left, right] = sample(offset + i / rate);
    wav.writeInt16LE(Math.round(left * 32767), 44 + i * 4);
    wav.writeInt16LE(Math.round(right * 32767), 46 + i * 4);
  }
  writeFileSync(name, wav);
}

let seed = 614;
let air = 0;
function music(t) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  air += (seed / 2147483648 - 1 - air) * .021;
  const weight = swell(t, 19.7, 45, 3.4, 3);
  const shear = swell(t, 31.3, 45, 4.3, 3.1);
  const layers = swell(t, 46.2, 66.2, 3, 3.4);
  const nova = swell(t, 64, 84, 5, 1.5);
  const entry = .25 + .75 * smooth(t / 1.6);
  return [-1, 1].map((side) => {
    const drift = side * .37 * sine(.17, t);
    const fundamental = (.031 + .018 * weight) * sine(36.708, t) + .012 * sine(73.416, t);
    const harmony = .014 * sine(110, t, drift) + layers * .013 * sine(146.83 + side * .23, t, drift);
    const pressure = shear * .012 * sine(77.1 + side * .27, t);
    const resolve = nova * (.017 * sine(146.83, t, drift) + .009 * sine(220 + side * .23, t));
    return entry * (fundamental + harmony + pressure + resolve + .072 * air) * (1 - .70 * smooth((t - 83.4) / .6));
  });
}

const cues = [
  [2.05, 220, .049, .0], [6.15, 110, .066, -.25], [8.03, 440, .035, -.4],
  [10.15, 523.25, .029, .4], [12.04, 293.66, .043, .18], [20.23, 55, .108, 0],
  [22.1, 146.83, .055, -.2], [25.30, 220, .037, .4], [31.1, 73.416, .052, -.2],
  [36.53, 77.78, .092, .0], [38, 233.08, .038, .35], [44.9, 146.83, .053, 0],
  [47.38, 220, .042, -.3], [50.9, 293.66, .035, -.4], [52.3, 440, .026, .25],
  [54.17, 587.33, .028, .38], [58.35, 146.83, .057, .18], [64.35, 55, .091, 0],
  [67.28, 440, .034, -.3], [71.78, 523.25, .035, -.25], [72.2, 659.25, .030, .26],
  [76.8, 440, .036, -.52], [77.1, 587.33, .034, .12], [77.42, 659.25, .034, .55],
  [80.24, 146.83, .079, 0], [81.03, 220, .032, .1],
];

function effects(t) {
  let left = 0;
  let right = 0;
  for (const [onset, hz, gain, pan] of cues) {
    const local = t - onset;
    if (local < 0 || local > 2.4) continue;
    const hit = (d) => d < 0 ? 0 : smooth(d / .025) * Math.exp(-4.9 * d) * (sine(hz, d) + .24 * sine(hz * 2.73, d));
    left += gain * (Math.sqrt((1 - pan) / 2) * hit(local) + .16 * hit(local - .124));
    right += gain * (Math.sqrt((1 + pan) / 2) * hit(local) + .18 * hit(local - .177));
  }
  return [left, right];
}

for (const [name, seconds, offset] of [['nexus-engineering', 47, 0], ['context-compaction', 17, 47], ['nexus-nova', 20, 64]]) {
  save(`assets/audio/music/${name}-score.wav`, seconds, offset, music);
  save(`assets/audio/sfx/${name}-effects.wav`, seconds, offset, effects);
}
