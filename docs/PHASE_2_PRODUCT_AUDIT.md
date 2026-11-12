# Arthur Studio product audit

The capture source was `feature/nodes-integration` at commit `d9be78ffa12e576557e6137eb1c72f6dcaac1959`. Remote branch tips were compared on November 4, 2026. This was the most recent remote tip. The default branch was `main`, and `dev` and the other feature tips predated it. The application was built from a separate clone. [Inspected source](https://github.com/Kaloyan3D/A.R.T.H.U.R/tree/d9be78ffa12e576557e6137eb1c72f6dcaac1959)

| Product behavior | Implementation and capture evidence |
| --- | --- |
| Capture | `CaptureComposer` → `ArthurClient` → native commands → SQLite. Home visibly retains the typed capture while organization runs. |
| Distillation | `AutoOrganize` queues only persisted captures. The native distillation service uses GPT-6 Luna, validates candidates and resolves source evidence before commit. Three provider-backed runs completed and all three initial revisions have capture evidence. |
| Cognitive Graph | `commands/graph.rs` exposes manual creation and inference. Inference proposes candidates and verifies them before storage. Native SQLite recorded `contradicts` with origin `model` and `depends_on` with origin `user`. |
| Supported types | `packages/contracts/cognitive.ts` and the SQLite constraint agree on `related_to`, `extends`, `depends_on`, `contradicts`, `derived_from`, `duplicates` and `supersedes`. Contradiction is symmetric, dependency directional. |
| Thought Lineage | The native Evolution UI reads revisions of one object. The SQLite trigger prevents revisions from being updated in place. R1 has capture provenance, while R2 and R3 are user edits. The demo shows saving R3 and retaining both predecessors. |

The film uses the app's real dark UI and application terminology. The editorial title names the product Arthur Studio, while the native window and sidebar say Arthur. No sync, cross-device, Android voice capture or future capabilities are featured.
