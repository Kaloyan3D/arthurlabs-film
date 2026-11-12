# V2 quality control

| Check | Result |
| --- | --- |
| Media | 1920 × 1080 H.264 yuv420p at 30 fps, exactly 5,400 decoded frames. Stereo 48 kHz AAC. Both streams and the MP4 container report exactly 180.000 seconds. |
| Integrity | Full FFmpeg decode with `-xerror` passed. TypeScript and whitespace checks passed. |
| V1 preservation | Original SHA-256 `24f6f8b3afa73a2319a280d1180ae76e3dd839a5dce3bb7353951374f910942b` matched after delivery. All 600 opening picture frames match V1. |
| Chapter seams | Inspected frames just before, on and after 20, 52, 99, 116, 136 and 170 seconds. Global frame boundaries remain unchanged. |
| Mobile | Compared 16 decoded V1/V2 pairs at 360 pixels wide. The final lineage view shows R1 through R3 and the diff; the contradiction retains both nodes, the edge and the inspector. Fine print remains secondary at mobile size. |
| Product truth | No replacement UI or generated proof. The Native fixture remains explicitly simulated input; Sentry retains the archived partial result; CCv2 and Nova retain their maturity labels. |
| Audio | −16.3 LUFS, −1.5 dBTP, 8.5 LU range, no detected silence interval of at least 0.45 seconds below −55 dBFS. Zero measured lag in eight V1/V2 waveform windows. |
| Black frames | Only the opening's intentional first 0.70 seconds met the black detection threshold. |

The comparison sheet is `renders/previews/v2-before-after-contact-sheet.jpg`. Each adjacent pair is V1 on the left, V2 on the right. Manual listening for pronunciation and subjective mix balance remains outstanding. Repeat the technical comparison with `python3 scripts/qa/check-polished-master.py`.
