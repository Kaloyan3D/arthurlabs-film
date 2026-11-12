# Nexus footage and evidence provenance

| Material | Origin |
| --- | --- |
| Studio handoff | Last decoded frame of the locked `arthur-studio-v1.mp4`, used as the first visual state. |
| DSH controller | Literal stdout from `node tests/AihController.Tests.cjs` at the audited dev commit. The panel typesets that log, with no invented terminal session. `dsh-host.log` separately retains 159 passing host platform assertions. |
| Native desktop | Two genuine archived stills from the Taskboard acceptance run, showing the real window in progress and after `cargo test --offline` passed. The cut between stills compresses time. Both are labeled recorded acceptance material. |
| Shell counterexample | Actual stdout after running `sh -c 'false \|\| true'` and printing its return code. This illustrative shell command ran separately from the broker tests. |
| Native broker | Literal excerpt of the Linux ARM64 `cargo test --locked -p nexus-broker --lib verification::tests:: -- --nocapture` output. All 63 selected tests passed. The displayed case uses injected receipt facts to verify classification and does not run npm. |
| CCv2 and Nova | Deterministic 3D illustrations. The RC banner summarizes repository evidence, and the Nova label persists throughout the planned architecture scene. |

To reproduce, export the audited dev tree into a scratch directory with `git archive`. Run the controller tests with Node. Run the Native tests from `native/` on Linux, retaining the adjacent `config/` tree and `apps/nexus-desktop/src/test/contract/` fixtures used by the test build. Original stdout, failed local probes and repository stills are retained in `assets/footage/nexus/`. No live DSH task or fresh provider-powered Native run was captured for this chapter.
