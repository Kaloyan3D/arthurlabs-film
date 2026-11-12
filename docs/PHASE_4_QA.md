# Phase 4 quality control

- Reviewed decoded frames across the archived result, source and local replay, as well as both chapter boundaries and the final type. The full contact sheet is `renders/previews/sentry-finale-v1-contact-sheet.jpg`.
- All four exports decode cleanly as H.264 yuv420p, 1920 × 1080 at 30 fps with stereo 48 kHz AAC. The complete master container and both streams report 180.000 seconds. Video contains exactly 5,400 frames.
- The splice preserves all 4,080 earlier picture frames and all 1,320 ending frames in order. The first 136 seconds of decoded audio are sample-identical to the locked file. No earlier source export was overwritten or regenerated.
- Sentry starts at frame 4,080 (136.000 s), and the finale at frame 5,100 (170.000 s). The first Sentry frame carries the last Nova visual state. The Sentry end card carries into the start of the finale.
- The full mix measured −18.7 LUFS integrated and −1.8 dBTP. Black detection found only the opening's intentional first 0.70 s of darkness. No span of at least 0.45 s below −55 dBFS was detected.
- Transcript and waveform checks confirmed wording and identified natural edit boundaries. Direct listening was unavailable. Manual playback for pronunciation and subjective mix balance remains outstanding.

Repeat the media, decoded-picture and locked-audio checks with `python3 scripts/qa/check-final-film.py`.
