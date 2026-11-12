# Original ArthurLabs score

The 180-second instrumental score uses an original D–E–A motif. A fragment first appears over open fifths. Studio states the motif on soft struck tones and answers it with a descending variation. Nexus moves it down an octave over syncopated bass and percussion. CCv2 thins the rhythm and opens the chord voicings; Nova brings back the pulse and sequences the motif upward. Sentry introduces a darker semitone figure, followed by a suspended dominant. The finale recalls the motif over D and resolves to D major with an added ninth.

| Picture beat | Score cue |
| --- | --- |
| Opening wordmark | The upper motif answers during the 16.85–17.49 s reveal. |
| Arthur Studio | The first full motif begins at 21.20 s, with variations over capture, distillation, and the graph. |
| Nexus Native | Low motif at 71.84 s and a centered impact at 72.20 s. |
| CCv2 and Nova | Wider pad voicings across the transition, then a restrained pulse and rising response over parallel branching. |
| Sentry replay | Tension is suspended into the 161.08 s replay cue, with a brief motif answer. |
| Finale | The motif returns at 170.82 s. The D-major resolution begins at 174.65 s and supports the retained picture impact and wordmark. The final chord fades to zero at 180 s. |

The score is deterministic synthesis, built from independently voiced pads, struck FM tones, pitched bass, filtered percussion, and stereo reflection taps. No external recordings, commercial tracks, or paid services were used. The raw score's measured chapter loudness rises from −34.8 LUFS in the opening to −29.6 LUFS in the finale, before mix automation.

The delivered [score](../assets/audio/music/arthurlabs-original-score.wav) is stereo 48 kHz / 24-bit PCM. The separate harmony, motif, and rhythm files are under `assets/audio/music/original-score-stems/`. The edited dialogue is `assets/audio/narration/v3/arthurlabs-dialogue.wav`. The retained effect bus is `assets/audio/sfx/arthurlabs-picture-effects.wav`.

Rebuild with `node scripts/audio/compose-arthurlabs-score.mjs` followed by `python3 scripts/audio/mix-original-score-v3.py`. The mix command writes a review export and expects a fresh review path.
