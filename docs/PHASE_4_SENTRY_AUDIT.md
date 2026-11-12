# Sentry source and product audit

The audit used `dev` at `f47f527906a97f42290a58bc1ebdf58e13372209`. The QA contracts branch `d1ce9c2befb04b93530716f9b57d675e2e66d1fc` has later unmerged work, including snapshot filter parity and stage changes. The film anchors its code replay to dev. The public latest release is **v1.0.2 Windows Stable**, tag `2640efcd78744cb02c517a405e648722e662bd60`. It ships an unsigned Windows x64 ZIP and SHA-256 sidecar, with Windows 11 and WSL2 required. No macOS release or usable Windows/WSL2 session was available for this capture. [Audited source](https://github.com/Mert1026/Sentry/tree/f47f527906a97f42290a58bc1ebdf58e13372209) · [Release](https://github.com/Mert1026/Sentry/releases/tag/v1.0.2)

| Claim | Classification and evidence |
| --- | --- |
| Shared immutable source state | Implemented. The RunCoordinator freezes a revision, checks its content hash and creates one private workspace per selected AgentRun. See `packages/run-engine/src/index.ts`, `packages/snapshot-engine/src/index.ts` and `docs/architecture/v1-pipeline.md`. |
| Three selectable paths | Implemented. OpenCode with a configured OpenRouter model, DeepSeek through DeepSeek Harness, and GLM through Claude Code. The models are configuration, as documented in `docs/architecture/agent-stack.md`. The film names the paths and avoids fixing model versions. |
| Independent findings and evidence | Implemented. Findings carry originating stack and evidence IDs. Evidence carries provenance. The run-engine parallel-execution suite passed 5 tests, including isolation and a no-peer-information assertion. |
| Recorded result | Archived production Full QA run `run_01M5Y7P7EE0GPAH3KRBJT00Q4S` is **partial**. OpenCode and DeepSeek completed; GLM failed. The archived finding is from OpenCode. The export includes code and reproduction evidence, with zero separate verification runs. |
| Local replay | A benign scratch manifest reproduces the exact loader behavior on the audited dev source. This directly invokes the real SnapshotEngine method with fixture metadata. It is a narrow check of one finding and does not execute providers or change the audited repository. |
| Full and Targeted QA | Implemented. Both share the independent topology. Historical merger/verifier/retest components are outside the active desktop QA claim. |
| Fourth security specialist | Future direction from the production brief. No active fourth path was found in the audited configuration. It is excluded from the picture and claims. |

The archived export was committed in `22b58b0e12c3487f4e8a5d47d10aee576334ab8d`. [Recorded run source](https://github.com/Mert1026/Sentry/commit/22b58b0e12c3487f4e8a5d47d10aee576334ab8d)
