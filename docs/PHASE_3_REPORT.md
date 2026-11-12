# Phase 3 delivery

The 84-second Nexus chapter covers 00:52–02:16. It is available as `NexusEngineeringScene`, `ContextCompactionScene`, `NexusNovaScene` and the integrated `NexusSequence` composition. The finished 136-second preview uses the locked first 52 seconds as its source.

| Export | Frames |
| --- | ---: |
| `nexus-engineering-v1.mp4` | 1,410 |
| `context-compaction-v1.mp4` | 510 |
| `nexus-nova-v1.mp4` | 600 |
| `nexus-sequence-v1.mp4` | 2,520 |
| `arthurlabs-first-136s.mp4` | 4,080 |

The second picture pass added genuine Native acceptance stills, clarified DSH review with its actual test assertion, and added directional motion to the Nova branches. Prior masters were preserved. Sentry remains outside this cut.

```sh
npm run typecheck
npm run studio
python3 scripts/audio/mix-nexus.py
npx remotion render src/index.tsx NexusSequence renders/previews/nexus-sequence-rebuild.mp4 --codec=h264 --crf=16 --gl=angle --concurrency=4
python3 scripts/qa/check-nexus.py
```

The logs, stills and generated audio assets follow the project's existing ignore rules. Keep them alongside the workspace when transferring the project.

[Audit](PHASE_3_NEXUS_AUDIT.md) · [Feature evidence](PHASE_3_FEATURE_EVIDENCE.md) · [Storyboard](PHASE_3_STORYBOARD.md) · [Footage](PHASE_3_FOOTAGE.md) · [Audio](PHASE_3_AUDIO.md) · [QA](PHASE_3_QA.md)
