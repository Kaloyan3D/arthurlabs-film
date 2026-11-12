# Scored V3 final QA

The scored V3 supersedes the earlier narration-only mix. The earlier edit remains at `renders/previews/arthurlabs-hackathon-master-v3-narration-only.mp4`, and the existing A/B preview remains a dialogue-pacing comparison. V2 and the original stems were preserved.

The first mix pass left the score too low against the intended arc, based on measured bed levels. The final pass raised the music input by 3.5 dB before ducking and reduced the overall gain by 0.35 dB. The score bus has a 28 Hz high-pass and a 2.5 dB cut around 1.9 kHz for dialogue space. Voice keys the music ducking with a 38 ms attack and 480 ms release. The final limiter is oversampled at 192 kHz. Dialogue samples and timing come directly from the earlier V3 edit.

| Check | Result |
| --- | --- |
| Master | 180.000 seconds, 5,400 decoded 1920 × 1080 H.264 frames at 30 fps, stereo AAC at 48 kHz. |
| Picture | V2 and scored V3 have identical H.264 payload SHA-256, `599ba9487bfd70135bb766e7aacf28d12c762b0e10b1b7b67039ceb25528562d`. |
| Encoded mix | −16.5 LUFS integrated, −1.5 dBTP, 9.9 LU range. |
| Silence and decode | Full FFmpeg decode passed. No silence of at least 0.45 s below −55 dBFS was detected. |
| Cues | Sampled the actual picture at the musical handoffs and compared the programmed cue times with the retained dialogue timeline. |
| Locked V2 | File SHA-256 remains `5b7f77fe67380cb5f50b68e2449f7c2fe8856b3c077e7d91c38f9ad94c6b336e`. |

Timing, development, and intensity were checked against the cue sheet, rendered frame samples, and loudness measurements. Listening by ear was unavailable. Musical timbre, subjective impact, intelligibility, and ducking audibility remain for a listening pass.
