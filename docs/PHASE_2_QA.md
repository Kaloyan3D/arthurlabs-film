# Phase 2 quality control

| Check | Result |
| --- | --- |
| Standalone | H.264 yuv420p, 1920 × 1080, 30 fps, 960 frames and 32.000 seconds. Stereo AAC at 48 kHz. |
| Stitched | Same format, 1,560 frames and 52.000 seconds. Video and audio both start at zero. |
| Boundary | Decoded frame hashes matched all 600 V4 frames and all 960 Studio frames in order. Frame 599 is at 19.966667 s and frame 600 at 20.000000 s. The V4 source file checksum was unchanged. |
| Integrity | Both deliverables decoded with FFmpeg `-xerror`. Black detection found only V4's intentional first 0.70 s of darkness in the stitched export. |
| Sound | Both exports measured −18.4 LUFS. Studio peaked at −4.6 dBTP and the stitched preview at −2.9 dBTP. No silence interval at or below −55 dBFS for 0.45 s was detected. |
| Narration | Provider transcript contains the full text. Measured gaps informed the phrase edits, and the last phrase ends inside the segment. |
| Product truth | Native screenshots and read-only SQLite inspection confirmed three completed distillations with source-backed initial revisions, a model-origin contradiction, a user-origin dependency, and the lineage revision chain. |
| Source | TypeScript compilation and whitespace checks passed. |

The draft was reviewed through decoded frames across the sequence. The final pass isolated the saved capture and distillation result, held on the selected dependency inspector, and separated the closing title fade from the product image. The final contact sheet is `renders/previews/arthur-studio-v1-contact-sheet.jpg`. The dependency crop was also inspected at 1280 × 720 after correcting the left margin.

Direct audio listening was unavailable. Wording, edits, and the stitch were checked using the returned transcript, waveform timing, codec metadata and loudness measurements.
