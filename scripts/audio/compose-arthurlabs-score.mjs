import {mkdirSync, writeFileSync} from 'node:fs';

const rate = 48000;
const length = 180 * rate;
const tau = 2 * Math.PI;
const bus = () => [new Float32Array(length), new Float32Array(length)];
const harmony = bus();
const motif = bus();
const rhythm = bus();
const hz = (note) => 440 * 2 ** ((note - 69) / 12);
const smooth = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};

function tone(target, {at, span, note, level, pan = 0, kind}) {
  const start = Math.round(at * rate);
  const count = Math.min(length - start, Math.round(span * rate));
  const phase = tau * hz(note) / rate;
  const left = level * Math.sqrt((1 - pan) / 2);
  const right = level * Math.sqrt((1 + pan) / 2);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const p = phase * i;
    let wave;
    if (kind === 'pad') {
      const envelope = smooth(t / 1.65) * smooth((span - t) / 2.0);
      wave = envelope * (.63 * Math.sin(p + .17 * Math.sin(t * 1.71)) +
        .22 * Math.sin(p * 1.0033 + .6) + .115 * Math.sin(p * 2 + .44 * Math.sin(t * .93)) +
        .035 * Math.sin(p * 3.002 - .3));
    } else if (kind === 'bell') {
      const envelope = smooth(t / .052) * Math.exp(-1.9 * t) * smooth((span - t) / .35);
      wave = envelope * (Math.sin(p + .49 * Math.exp(-4.6 * t) * Math.sin(p * 2.01)) +
        .11 * Math.exp(-2.1 * t) * Math.sin(p * 3.96 + .4));
    } else {
      const envelope = smooth(t / .033) * Math.exp(-5.6 * t) * smooth((span - t) / .12);
      wave = envelope * (Math.sin(p) + .14 * Math.sin(p * 2 + .33) + .06 * Math.sin(p * 3));
    }
    target[0][start + i] += left * wave;
    target[1][start + i] += right * wave;
  }
}

// Open fifth → minor/add9 → suspended dominant → luminous D major/add9.
const chords = [
  [0, 9.2, [38, 45, 52], .031], [7.7, 8.9, [38, 48, 53, 57], .033],
  [15.0, 7, [38, 45, 52, 57], .043],
  [20.1, 9, [38, 45, 53, 64], .036], [27.4, 9, [34, 41, 53, 60, 64], .034],
  [35.1, 9, [36, 43, 50, 55, 62], .033], [42.6, 10.8, [38, 45, 53, 57, 64], .040],
  [51.8, 9.7, [38, 45, 48, 53], .046], [60.0, 10, [36, 43, 48, 55, 62], .043],
  [69.5, 10.4, [34, 41, 48, 53, 57], .049], [78.6, 10.5, [33, 40, 50, 55, 58], .044],
  [88.0, 12, [38, 45, 48, 53], .042],
  [98.2, 9.8, [34, 45, 48, 53, 64], .043], [106.6, 10.7, [36, 43, 50, 55, 64], .045],
  [115.4, 8.5, [38, 45, 53, 57, 64], .045], [122.5, 8.5, [41, 48, 55, 57, 64], .047],
  [129.5, 8.5, [34, 41, 48, 57, 64], .047],
  [135.7, 9.4, [38, 45, 51, 53], .044], [143.7, 9.0, [34, 41, 48, 52, 57], .047],
  [151.4, 9.4, [31, 43, 50, 53, 58], .045], [159.0, 11.7, [33, 40, 50, 55, 58], .052],
  [169.4, 7.7, [38, 45, 50, 57, 64], .049], [174.65, 5.35, [38, 45, 54, 57, 64, 69], .056],
];
for (const [at, span, notes, level] of chords) {
  notes.forEach((note, i) => tone(harmony, {at: at + i * .055, span: span - i * .055,
    note, level: level * (i === 0 ? 1 : .58), pan: i === 0 ? 0 : [-.48, .40, -.22, .56, -.40][i - 1], kind: 'pad'}));
}

// D–E–A: fragments in the opening, full statements in Studio and the finale.
for (const [at, notes, spacing, gain] of [
  [3.9, [62, 64], .86, .017], [16.85, [69, 64], .64, .036],
  [21.2, [62, 64, 69], .66, .030], [29.95, [65, 64, 60], .61, .037],
  [35.55, [62, 64, 69], .74, .040], [44.1, [57, 62, 64], .79, .031],
  [56.9, [50, 52, 57], .47, .034], [71.84, [50, 57, 64], .44, .053],
  [94.9, [62, 64], .80, .024], [99.84, [62, 64, 69], .94, .037],
  [109.2, [60, 64, 67], .83, .034], [117.4, [62, 64, 69], .62, .036],
  [127.9, [64, 67, 69], .49, .041], [131.6, [69, 74, 76], .49, .037],
  [142.5, [50, 52, 57], .42, .033], [150.0, [51, 50], .52, .038],
  [161.08, [57, 62, 64], .38, .045], [167.25, [57, 62], .73, .031],
  [170.82, [62, 64, 69], .88, .047], [175.42, [69, 74, 76], .41, .049],
]) {
  notes.forEach((note, i) => tone(motif, {at: at + i * spacing, span: 2.8,
    note, level: gain * (i === 0 ? .84 : 1), pan: [-.35, .29, .12][i], kind: 'bell'}));
}

let state = 0x24c8d39;
function strike(at, gain, pan, type) {
  const start = Math.round(at * rate);
  const count = Math.round((type === 'kick' ? .51 : .22) * rate);
  let noiseLow = 0;
  for (let i = 0; i < count && start + i < length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const noise = state / 2147483648 - 1;
    noiseLow += .12 * (noise - noiseLow);
    const t = i / rate;
    const wave = type === 'kick' ?
      Math.sin(tau * (42 * t + .95 * (1 - Math.exp(-65 * t)))) * Math.exp(-13 * t) :
      (noiseLow + .26 * Math.sin(tau * (type === 'rim' ? 780 : 1980) * t)) * Math.exp(-38 * t);
    const sample = gain * wave * smooth(t / .009) * smooth((count / rate - t) / .055);
    rhythm[0][start + i] += sample * Math.sqrt((1 - pan) / 2);
    rhythm[1][start + i] += sample * Math.sqrt((1 + pan) / 2);
  }
}

for (const [start, end, step, root, strength, pattern] of [
  [24, 49, .68, 38, .30, [0, 3, 6]],
  [52.4, 69.7, .54, 38, .78, [0, 2, 5, 7]],
  [72, 87.8, .54, 34, .86, [0, 3, 4, 7]],
  [88.45, 96, .61, 38, .57, [0, 2, 5]],
  [116.8, 134.4, .63, 38, .53, [0, 3, 5]],
  [137.0, 160.0, .49, 38, .92, [0, 2, 3, 6]],
  [161.12, 168.8, .49, 33, .98, [0, 3, 5, 7]],
]) {
  for (let beat = 0; start + step * beat < end; beat++) {
    const at = start + step * beat;
    const cell = beat % 8;
    const phrase = .70 + .30 * smooth(Math.min((at - start) / 2, (end - at) / 2));
    if (pattern.includes(cell)) {
      tone(rhythm, {at, span: .56, note: root + (cell === 5 ? 7 : 0),
        level: .036 * strength * phrase, kind: 'pulse'});
      strike(at, .047 * strength * phrase, 0, 'kick');
    }
    if (cell === 2 || cell === 6) strike(at + .024, .027 * strength, cell === 2 ? -.33 : .35, 'rim');
    if ((beat + Math.floor(beat / 8)) % 3 === 0) strike(at + step / 2, .018 * strength, .39, 'tick');
  }
}
strike(72.20, .103, 0, 'kick');
// The retained original reveal impact supplies the finale transient.

function space(channels, wet, taps) {
  for (let i = length - 1; i >= 0; i--) {
    for (const [seconds, gain] of taps) {
      const j = i - Math.round(seconds * rate);
      if (j >= 0) {
        channels[0][i] += channels[1][j] * wet * gain;
        channels[1][i] += channels[0][j] * wet * gain;
      }
    }
  }
}
space(harmony, .19, [[.041, .65], [.117, .44], [.211, .28]]);
space(motif, .40, [[.078, .65], [.143, .43], [.288, .33], [.417, .20], [.623, .14]]);
space(rhythm, .11, [[.061, .65], [.149, .31]]);

function wav(path, tracks) {
  const bytes = length * 6;
  const buffer = Buffer.alloc(bytes + 44);
  buffer.write('RIFF');
  buffer.writeUInt32LE(bytes + 36, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 6, 28);
  buffer.writeUInt16LE(6, 32);
  buffer.writeUInt16LE(24, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(bytes, 40);
  for (let i = 0; i < length; i++) {
    const fade = smooth(i / (rate * .38)) * smooth((length - 1 - i) / (rate * 1.32));
    for (let channel = 0; channel < 2; channel++) {
      let sample = 0;
      for (const track of tracks) sample += track[channel][i];
      buffer.writeIntLE(Math.round(Math.max(-1, Math.min(1, sample * fade)) * 8388607), 44 + i * 6 + channel * 3, 3);
    }
  }
  writeFileSync(path, buffer);
}

const directory = 'assets/audio/music/original-score-stems';
mkdirSync(directory, {recursive: true});
wav(`${directory}/harmony.wav`, [harmony]);
wav(`${directory}/motif.wav`, [motif]);
wav(`${directory}/rhythm.wav`, [rhythm]);
wav('assets/audio/music/arthurlabs-original-score.wav', [harmony, motif, rhythm]);
