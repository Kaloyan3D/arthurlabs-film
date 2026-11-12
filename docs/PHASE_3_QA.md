# Nexus quality control

- Reviewed decoded frames across the three chapters and at the cut boundaries. The revised DSH proof pairs authentic stdout with the real review-classification assertions. The Native acceptance shot uses two labeled archival states. CCv2 keeps canonical history visually separate from projected tiers. Nova's planned label remains visible throughout.
- All five exports decoded with FFmpeg `-xerror` at 1920 × 1080, 30 fps, H.264 yuv420p and stereo 48 kHz AAC. Exact video counts were 1,410, 510, 600, 2,520 and 4,080. The stitched streams start at zero and run for 136 seconds.
- The chapter starts land at stitched frames 1,560, 2,970 and 3,480, corresponding to 52.000, 99.000 and 116.000 seconds. The locked opening, Studio and first-52-second checksums matched their pre-production values.
- The stitched mix measured −18.6 LUFS integrated and −2.3 dBTP. Silence detection found no spans of at least 0.45 seconds below −55 dBFS. Black detection found only the original opening's intentional first 0.70 seconds of darkness.
- Narration review used the provider transcripts and measured waveform gaps. Direct listening was unavailable, so pronunciation and subjective mix balance remain unverified by ear.

See `renders/previews/nexus-sequence-v1-contact-sheet.jpg` for the decoded picture review. Run `python3 scripts/qa/check-nexus.py` to repeat frame counts, decode checks and frame hash comparison.
