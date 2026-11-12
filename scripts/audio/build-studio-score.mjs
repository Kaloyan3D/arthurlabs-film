import {writeFileSync} from 'node:fs';

const rate = 48000;
const frames = 32 * rate;
const tau = 2 * Math.PI;
const sin = (frequency, time, phase = 0) => Math.sin(tau * frequency * time + phase);
const ease = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};
const swell = (t, start, end, attack, release) => ease((t - start) / attack) * ease((end - t) / release);

function save(path, sample) {
  const bytes = frames * 4;
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
  for (let i = 0; i < frames; i++) {
    const [left, right] = sample(i / rate);
    wav.writeInt16LE(Math.round(left * 32767), 44 + i * 4);
    wav.writeInt16LE(Math.round(right * 32767), 46 + i * 4);
  }
  writeFileSync(path, wav);
}

let seed = 432;
let air = 0;
save('assets/audio/music/studio-score.wav', (t) => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  air += (seed / 2147483648 - 1 - air) * .026;
  const chord = swell(t, 2.1, 10.3, 2.9, 3.1) + swell(t, 14.5, 21.6, 2.8, 2.6);
  const tension = swell(t, 20.2, 27.4, 2.6, 2.2);
  const resolution = ease((t - 27.05) / 3.6);
  const entrance = ease(t / .9);
  const bass = .050 * sin(36.708, t) + .013 * sin(73.416, t);
  return [-1, 1].map((side) => {
    const drift = side * .24 * sin(.22, t);
    const fifth = .017 * sin(110, t, drift) + chord * .012 * sin(146.83 + side * .23, t);
    const pressure = tension * (.021 * sin(77.1 + side * .23, t) + .006 * sin(155.56, t));
    const clear = resolution * (.024 * sin(146.83, t, drift) + .012 * sin(220 + side * .17, t));
    return entrance * (bass * (1 - resolution * .28) + air * .076 + fifth + pressure + clear) * (1 - .83 * ease((t - 31.34) / .66));
  });
});

const cues = [
  [2.05, 220, .047, 0, .85],
  [6.46, 587.33, .025, .44, .42],
  [9.10, 440, .043, .35, .85],
  [14.05, 659.25, .045, .30, .82],
  [16.92, 523.25, .034, -.31, .58],
  [21.90, 82.41, .119, .16, 1.14],
  [22.00, 233.08, .033, .48, .87],
  [28.63, 587.33, .036, .36, .72],
  [30.72, 146.83, .064, 0, 1.08],
  [30.83, 440, .031, -.28, .87],
];

save('assets/audio/sfx/studio-effects.wav', (t) => {
  let left = 0;
  let right = 0;
  for (const [at, pitch, gain, pan, tail] of cues) {
    const x = t - at;
    if (x < 0 || x > 2) continue;
    const strike = (d) => d < 0 ? 0 : ease(d / .021) * Math.exp(-d * 4.3 / tail) *
      (sin(pitch, d) + .21 * sin(2.71 * pitch, d) * Math.exp(-5 * d));
    left += gain * (strike(x) * Math.sqrt((1 - pan) / 2) + .14 * strike(x - .103));
    right += gain * (strike(x) * Math.sqrt((1 + pan) / 2) + .16 * strike(x - .161));
  }
  const end = ease((32 - t) / .27);
  return [left * end, right * end];
});
