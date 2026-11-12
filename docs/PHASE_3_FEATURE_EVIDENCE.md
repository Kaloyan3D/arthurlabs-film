# Nexus feature evidence

Baseline for the two harnesses is Nexus `dev`, commit `3b90bdd4bdbb39519ba5b4870de753db8d8ccea7`. The remote feature branch names in the brief have been merged or removed; the local linux-arm64 branch tip is `04521de3b5230b6d80b329f19b0a5676d8aa4af0`, an ancestor of dev.

| Subject | Status | Source and scope |
| --- | --- | --- |
| Nexus DSH | Implemented; selected controller behavior tested | README and `config/AihController.cjs`; vendored `deepseek-ai-dsh-agent-0.1.1-rc.2-nexus.1.tgz` plus routing authority patch. Controller tests exercise session binding, review dispatch, status and policy. |
| DSH Control Room | Implemented, source-audited | `ui/nexus-controller`. No live provider session or Control Room interaction in this edit. |
| Nexus Native | Implemented; selected broker behavior tested | Original Rust workspace under `native/` with broker, kernel, runtime and store. `native/nexus-broker/src/verification` records receipt provenance and distinguishes execution from check evidence. |
| Native shell evidence | Tested, fixture scope | `composed_shell_checks_are_never_trusted_pass_evidence` injects tool-result fixtures. An apparent zero from `npm test \|\| true` is inconclusive for shell composition. This test does not execute npm or make a whole-task attestation. |
| Native recovery | Implemented, source-audited | Native store and broker source and A-series evidence reports. Recovery is not demonstrated in the filmed test. |
| CCv2 | Integrated within documented scope; release-candidate route evidence | `docs/integration/ccv2-dev-report.md` and `docs/architecture/context-compaction-v2.md` §§29, 54. HOT/WARM/COLD visualize selected tiers; PINNED and ARCHIVE are also defined. Canonical history sits outside the projected working context. |
| Muse Spark 1.3 Contributor | Documented RC1 live validation | §54 records OpenCode Go tests of checkpointed context, tool-call continuity, count/send identity and restart. This is a scoped test of a DSH-related route, not broad Meta integration. |
| Nova | Planned | Three cost-tier modes are the proposed product direction in the film brief. The diagram represents a Native extension, without implying a shared DSH orchestration layer. |
| Native desktop Taskboard | Recorded real provider acceptance run | `native/A6.1.4-EVIDENCE.md` and `native/docs/a614-screenshots/w-{running,done}.png`, last changed in `1bf5ad51455640d790be026f91cd8744704cb89e`. The UI reports sandbox command success and explicitly limits its meaning. |
