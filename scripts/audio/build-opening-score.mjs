import {writeFileSync} from 'node:fs';

const rate = 48000;
const duration = 20;
const tau = Math.PI * 2;
const smooth = (x) => {
  const n = Math.max(0, Math.min(1, x));
  return n * n * (3 - 2 * n);
};
const swell = (t, start, end, attack, release) =>
  smooth((t - start) / attack) * smooth((end - t) / release);

function writeStereo(path, sample) {
  const bytes = rate * duration * 4;
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
  for (let i = 0; i < rate * duration; i++) {
    const [left, right] = sample(i / rate);
    wav.writeInt16LE(Math.round(left * 32767), 44 + i * 4);
    wav.writeInt16LE(Math.round(right * 32767), 46 + i * 4);
  }
  writeFileSync(path, wav);
}

let seed = 227;
let lowNoise = 0;
let air = 0;
const stereoBed = (t) => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  const noise = seed / 2147483648 - 1;
  lowNoise += (noise - lowNoise) * .012;
  air += (noise - air) * .083;
  const envelope = swell(t, .08, 20, 1.5, 1.25);
  const pressure = swell(t, 8.45, 16.6, 4.1, 1.2);
  const arrival = swell(t, 16.92, 20, .44, 1.52);
  const bass = .067 * Math.sin(tau * 36.708 * t) + .021 * Math.sin(tau * 73.416 * t + .35 * Math.sin(t));
  const mist = lowNoise * (.09 + pressure * .18) + air * .012;
  return [-1, 1].map((side) => {
    const drift = side * .45 * Math.sin(t * .63);
    const string = .032 * Math.sin(tau * 110 * t + drift) +
      .015 * Math.sin(tau * (146.83 + side * .31) * t + .4 * Math.sin(t * 1.2));
    const tension = pressure * (.027 * Math.sin(tau * (77.1 + side * .26) * t) +
      .009 * Math.sin(tau * 155.56 * t + drift));
    const chord = arrival * (.048 * Math.sin(tau * 146.83 * t + drift) +
      .026 * Math.sin(tau * (220 + side * .24) * t) +
      .015 * Math.sin(tau * (293.66 - side * .44) * t + drift));
    return envelope * (bass * (1 - arrival * .25) + mist + string * (.47 + .53 * smooth(t / 8)) + tension + chord);
  });
};

const cues = [
  [.48, 146.83, .044, 0, 1.2],
  [3.86, 440, .047, -.59, .62],
  [4.43, 523.25, .037, .57, .66],
  [4.97, 659.25, .034, .21, .74],
  [6.75, 783.99, .027, -.37, .56],
  [8.36, 587.33, .023, .42, .61],
  [11.38, 155.56, .059, .57, .90],
  [12.60, 82.41, .050, .24, .99],
  [15.31, 110, .031, -.21, .7],
  [17.32, 73.416, .137, 0, 1.1],
  [17.43, 587.33, .059, -.21, .83],
  [17.48, 880, .029, .45, .82],
];

function stereoEffects(t) {
  let left = 0;
  let right = 0;
  for (const [time, pitch, gain, pan, tail] of cues) {
    const x = t - time;
    if (x < 0 || x > 3) continue;
    const struck = (d) => d < 0 ? 0 :
      Math.min(1, d / .018) * Math.exp(-d * 4.4 / tail) * (
        Math.sin(tau * pitch * d + .32 * Math.sin(d * 16)) +
        .23 * Math.sin(tau * pitch * 2.76 * d) * Math.exp(-6 * d));
    left += gain * (struck(x) * Math.sqrt((1 - pan) / 2) + .17 * struck(x - .093) + .10 * struck(x - .231));
    right += gain * (struck(x) * Math.sqrt((1 + pan) / 2) + .19 * struck(x - .137) + .07 * struck(x - .279));
  }
  const fade = smooth((20 - t) / .25);
  return [left * fade, right * fade];
}

writeStereo('assets/audio/music/opening-score.wav', stereoBed);
writeStereo('assets/audio/sfx/opening-effects.wav', stereoEffects);
