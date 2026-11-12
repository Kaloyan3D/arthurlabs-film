# ArthurLabs film setup report

Verified on 2026-11-04 on Apple Silicon (arm64), macOS 27.2 build 26B123.
The project uses npm and an exact-version lockfile.

| Component | Version or status |
| --- | --- |
| Node.js / npm | 26.13.0 / 11.20.0 |
| Homebrew | 7.0.12 |
| Python / pip | 3.9.6 / 21.2.4 |
| Git / GitHub CLI | 2.54.0 / 2.103.3 |
| Rust / Cargo | 1.99.1 / 1.99.1 |
| FFmpeg / ffprobe | 9.0.2, installed through Homebrew |
| Remotion / CLI / Three integration / Media | 4.0.540 |
| React / TypeScript | 19.3.1 / 7.0.2 |
| Three.js / React Three Fiber | 0.187.0 / 9.8.2 |
| OpenAI SDK / Zod | 7.50.0 / 4.6.7 |
| Screen recording | macOS Screenshot is installed and supports region recording. Review permissions and a real capture before production. |
| Blender / OBS Studio / DaVinci Resolve | Optional, not found in the Applications scan and not installed. |
| Disk | About 50 GiB available during inspection. |
| Animation | Remotion frame-driven interpolation covers the Phase 0 motion. GSAP was not needed. |

Installed 13 official Remotion skills with
`npx -y skills@latest add remotion-dev/skills --agent codex -g -y`.
Verified Codex skill files under `~/.agents/skills/`. The best-practices
skill routes to composition, markup, 3D, audio, render and Studio guidance.
Newly installed skills can be discovered on the next Codex turn.
[Official Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills)

## Smoke tests

- TypeScript compiled and npm reported no missing runtime dependencies.
- Studio built and served locally. Composition discovery found
  `ArthurLabsFilm` (5,400 frames) and `TechnicalProof` (150 frames).
- Remotion downloaded Headless Shell and rendered the technical proof.
  A decoded frame showed the text and 3D graph.
- FFprobe counted 150 H.264 yuv420p frames at 1920×1080 and 30 fps.
  The AAC stream is 48 kHz. The MP4 container reports 5.013 seconds
  including audio padding.
- The source WAV is 0.25 seconds. The rendered cue crossed the detector's
  threshold at 1.0025 seconds and returned to silence at 1.241396 seconds.
  Both are within one frame of the planned timing.
- The local timing and normalization scripts were exercised against
  synthetic WAV audio. The two OpenAI commands refuse to run without
  the approval flag.

## Narration and remaining inputs

GPT-Live uses `gpt-live-1` for prompt-created voices. Its adapter records
a bounded audition and transcript, with a server close acknowledgement.
Review each take for omissions, added words and timing. The Speech API
adapter accepts the script as input and uses `gpt-4o-mini-tts` by default.
OpenAI lists January 6, 2027 as the shutdown date for that endpoint's
current models and directs new migration work to
`gpt-realtime-2.1-mini` over Realtime. The transport adapter can change
without touching the Remotion timeline. Identify AI narration in the
finished film as required by the OpenAI speech guidance.
[Custom voices](https://developers.openai.com/api/docs/guides/custom-voices) ·
[GPT-Live WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets) ·
[Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech)

Both narration adapters passed authenticated smoke tests with the built-in
`marin` voice and the same short test line. FFprobe verified 24 kHz mono
16-bit PCM WAV output for Speech (3.10 s) and GPT-Live (6.18 s).
The GPT-Live transcript matched the test line exactly. The takes are in
`assets/audio/narration/phase-0-speech.wav` and
`assets/audio/narration/phase-0-live.wav`. These tests used two authorized
billable requests. Saved voice creation and production-length delivery
remain untested.
The separately supplied `ARTHURLABS_VIDEO_TRUTH.md`, an approved script and
real product recordings are needed before production. The five-second proof
uses synthetic sound and abstract graphics to test the pipeline.

Commands and the exact audio and render arguments are in [README.md](README.md).
