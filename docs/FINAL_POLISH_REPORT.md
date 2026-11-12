# ArthurLabs polished master V2

The submission export is `renders/final/arthurlabs-hackathon-master-v2.mp4`. It is exactly **03:00.000**, with 5,400 frames of 1080p H.264 and stereo AAC. The locked V1 remains available as the fallback.

The biggest improvements are the larger native Studio views, the dedicated “An exit code isn’t proof” beat, and Sentry's tighter link from the archived finding to the actual catch block and replay result. The approved opening picture is frame-identical. V2 keeps the original narration edit and brings the soundtrack to −16.3 LUFS with peak headroom.

Play either MP4 in QuickTime Player or another H.264/AAC player. The 360-pixel-wide comparison pairs are in `renders/previews/v2-before-after-contact-sheet.jpg`, with V1 to the left of V2 in each pair.

## Reproduce

```sh
npm run typecheck
npx remotion render src/index.tsx PolishedChapters renders/previews/arthurlabs-polished-chapters-v2.mp4 --codec=h264 --crf=14 --gl=angle --concurrency=4 --muted
sh scripts/render/stitch-polished-master.sh
python3 scripts/qa/check-polished-master.py
```

The commands expect fresh V2 output paths. The edit uses the original approved audio and the existing source captures. No model calls were made. Manual listening remains outstanding.

[Audit](FINAL_POLISH_AUDIT.md) · [Changes](FINAL_POLISH_CHANGES.md) · [Audio](FINAL_POLISH_AUDIO.md) · [QA](FINAL_POLISH_QA.md)
