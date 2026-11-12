# Phase 2 delivery

The independently renderable `ArthurStudioScene` covers frames 600–1559 of the planned film. The two exports are `renders/previews/arthur-studio-v1.mp4` and `renders/previews/arthurlabs-first-52s.mp4`. The locked V4 is the source of the stitched opening. The 180-second composition remains available as the production slate.

The product footage was captured in a real macOS Tauri session. Capture, provider distillation, a verified contradiction, an authored dependency and an immutable revision history all came from the same local demo profile. The editorial treatment preserves the application's colors and UI. The final pass isolates the distillation result, adds a readable hold on the dependency inspector, and matches the opening's loudness.

```sh
npm run typecheck
npm run studio
npx remotion render src/index.tsx ArthurStudioScene renders/previews/arthur-studio-v1-rebuild.mp4 --codec=h264 --crf=15 --gl=angle --concurrency=4
```

The generated assets follow the project's existing ignore rules. Retain the source recordings and stems with the film when moving the workspace.

[Product audit](PHASE_2_PRODUCT_AUDIT.md) · [Storyboard](PHASE_2_STORYBOARD.md) · [Footage](PHASE_2_FOOTAGE.md) · [Audio](PHASE_2_AUDIO.md) · [QA](PHASE_2_QA.md)
