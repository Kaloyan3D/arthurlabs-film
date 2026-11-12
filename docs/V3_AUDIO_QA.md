# V3 audio and master QA

| Check | Result |
| --- | --- |
| Picture | H.264 packet-payload SHA-256 matches V2 exactly. All 5,400 video frames were stream-copied. |
| Duration | 180.000 s for video, AAC audio and container. Both streams start at 0. |
| Decode | Full FFmpeg decode with `-xerror` passed. |
| Loudness | −16.3 LUFS integrated, −1.5 dBTP, 8.3 LU loudness range. No silence at or below −55 dBFS for 0.45 s or longer. |
| Dialogue | Every move uses an existing take at its original rate. Script checks destination overlap and sample equality throughout the interior of each moved region. Quiet handles receive 8 ms blends. |
| Music and effects | Rebuilt from the existing stereo stems at their chapter positions, with the original Studio trim and re-keyed sidechain ducking. |
| V2 file | SHA-256 remains `5b7f77fe67380cb5f50b68e2449f7c2fe8856b3c077e7d91c38f9ad94c6b336e`. |

The matching encoded video hash is `599ba9487bfd70135bb766e7aacf28d12c762b0e10b1b7b67039ceb25528562d`. Visual cue timing was checked against the fixed picture edit and measured voice onsets. The threshold-based analysis can miss quiet phonemes or breaths. Listening was unavailable, so perceived pacing, pronunciation, breath edits, crossfade audibility and mix balance still require an ear check. The A/B preview is provided for that review.
