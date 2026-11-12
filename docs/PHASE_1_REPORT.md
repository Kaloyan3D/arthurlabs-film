# ArthurLabs opening delivery

The selected master is `renders/previews/arthurlabs-opening-v3.mp4`. The requested `arthurlabs-opening-v1.mp4` and intermediate `arthurlabs-opening-v2.mp4` are retained as separate review exports. The master runs for 20 seconds and ends on a typography-only ARTHURLABS reveal.

The opening is available in Studio as `ArthurLabsOpening`. Its scene and sound mix sit alongside the existing 180-second composition and technical proof. No dependencies were added. The provided project and nearby workspaces contained no `ARTHURLABS_VIDEO_TRUTH.md`. The opening uses an abstract network and makes no claims about implemented features.

## Source and reproduction

- `src/scenes/ArthurLabsOpening.tsx` handles the atmospheric layers, title, and soundtrack.
- `src/three/ThoughtChamber.tsx` handles the frame-driven camera, seed, branches, filament propagation, fracture, and convergence.
- `scripts/audio/build-opening-score.mjs` synthesizes the score and effects stems.
- `scripts/audio/mix-opening.sh` edits the retained take and rebuilds the mix.

```sh
npm run typecheck
npm run studio
sh scripts/audio/mix-opening.sh
npx remotion render src/index.tsx ArthurLabsOpening renders/previews/arthurlabs-opening-v3-rebuild.mp4 --codec=h264 --crf=15 --gl=angle --concurrency=4
```

Media stays in the project's existing ignored audio and render directories. The master references the baked stereo mix during rendering. Keep the original take and generated WAVs with the project when transferring it to another machine.

[Art direction](PHASE_1_ART_DIRECTION.md) · [Storyboard](PHASE_1_STORYBOARD.md) · [Audio](PHASE_1_AUDIO.md) · [Quality control](PHASE_1_QA.md)

## V4 comparison

`ArthurLabsOpeningV4` adds a macro push on the seed and a closer pass at the fracture. A moving key brings out the facets. Warm and cool signals meet on the stressed link, which bends and separates on the existing impact cue. At the reveal the seed flattens into a seam that opens vertically onto the wordmark.

`renders/previews/arthurlabs-opening-v4.mp4` decoded cleanly at 1920 × 1080 and 30 fps, with 600 video frames. Its encoded AAC payload matches v3 byte for byte, and the original v3 file checksum is unchanged. The six decoded comparison frames are in `renders/previews/arthurlabs-opening-v3-v4.jpg`, with v3 on the left.

```sh
npx remotion render src/index.tsx ArthurLabsOpeningV4 renders/previews/arthurlabs-opening-v4-rebuild.mp4 --codec=h264 --crf=15 --gl=angle --concurrency=4
```
