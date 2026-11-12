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

let seed = 1642;
let air = 0;
function music(t) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  air += (seed / 2147483648 - 1 - air) * .021;
  const pressure = swell(t, 10.5, 27, 5, 4.4);
  const lift = swell(t, 32.6, 44, 6.7, 1.9);
  const entry = smooth(t / 1.0);
  const end = 1 - smooth((t - 42.56) / 1.44);
  const pulse = .4 + .6 * Math.pow(Math.sin(Math.PI * 1.48 * t), 6);
  return [-1, 1].map((side) => {
    const drift = side * .34 * sine(.19, t);
    return entry * end * (
      (.029 + .016 * pressure) * sine(36.708, t) + .011 * sine(73.416, t) +
      .013 * sine(110, t, drift) + .045 * air +
      .014 * pressure * pulse * sine(77.1 + side * .24, t) +
      lift * (.030 * sine(146.83, t, drift) + .014 * sine(220 + side * .22, t) +
        .009 * sine(293.66 - side * .19, t, drift))
    );
  });
}

const cues = [
  [1.45, 82.41, .047, 0], [5.15, 110, .065, 0], [5.85, 440, .035, -.45],
  [6.31, 523.25, .035, .35], [6.81, 392, .036, .62], [14.08, 73.42, .089, 0],
  [17.20, 233.08, .048, .37], [20.82, 392, .036, .25], [25.2, 110, .064, -.16],
  [26.07, 293.66, .041, -.34], [26.61, 349.23, .036, .27], [27.12, 440, .044, .38],
  [32.65, 146.83, .063, .06], [34.83, 293.66, .043, -.52], [35.39, 440, .040, 0],
  [35.94, 587.33, .038, .52], [38.76, 110, .054, 0], [39.55, 55, .143, 0],
  [39.69, 146.83, .084, 0], [39.88, 293.66, .053, -.31], [40.18, 587.33, .041, .36],
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

for (const [name, seconds, offset] of [['sentry', 34, 0], ['finale', 10, 34]]) {
  save(`assets/audio/music/${name}-score.wav`, seconds, offset, music);
  save(`assets/audio/sfx/${name}-effects.wav`, seconds, offset, effects);
}
