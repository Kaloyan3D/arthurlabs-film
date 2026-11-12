# V2 audio finishing

V2 remasters the approved V1 soundtrack. The original narration takes, wording, edit points, score, sound effects, ducking, and stereo placement are retained. There were no new model calls or audio regenerations.

| Measure | V1 encoded | V2 processed PCM |
| --- | ---: | ---: |
| Integrated loudness | −18.7 LUFS | −16.3 LUFS |
| True peak | −1.8 dBTP | −1.5 dBTP |
| Loudness range | 8.5 LU | 8.5 LU |

The master receives 2.35 dB of gain and a latency-compensated peak limiter at 192 kHz before resampling to 48 kHz. The limiter has a 4 ms attack and 55 ms release with makeup gain disabled. The encoded delivery is stereo AAC at 320 kb/s. There is no chapter-by-chapter normalization or stereo widening.

The V1 chapter measurements were within about 0.8 LU of each other for the first five chapters. A separate speech-window comparison of isolated narration against the sum of the un-ducked score and effects put dialogue roughly 7–11 dB above the bed across chapters. This is an RMS proxy measured in 100 ms voice-active windows at 4 kHz, not a perceptual intelligibility score. The existing scene mixes already duck the bed under speech, so the polish keeps the established speech-to-music relationships.

The remaster processes one continuous track, retaining the existing fades and boundary timing. Pronunciation, background artifacts and subjective music balance require a listening pass.

The final AAC decode measured −16.3 LUFS, −1.5 dBTP and 8.5 LU range. Normalized waveform correlation against V1 found zero measured lag in eight sampled windows and correlations of 0.99695 or higher. Silence detection found no interval of 0.45 seconds or longer below −55 dBFS.
