# Sentry evidence and footage

No live Windows GUI recording or provider rerun was used. The chapter uses an archived production run, a literal code excerpt, and a local replay of the same reported behavior. The architecture diagram is labeled and uses recorded statuses. It is not an application screenshot.

- `assets/footage/sentry/nova-end.png` is the final decoded Nexus frame, extracted read-only.
- `archived-evidence.json` contains only selected archive fields. Finding `find_01M5Y7W081EBPNDS3EFJW5ARB9` references two evidence records, one baseline code reference and one Node replica. The diagram uses the recorded snapshot hash prefix `9aeea73a86ba`.
- `manifest-replay.log` is actual stdout from `scripts/capture/replay-sentry-manifest.mjs`. The fixture has one valid row, malformed JSON and a non-hex hash. The real built loader returns only the valid entry. The PASS line means the reported behavior was reproduced.
- The actual code and archived evidence are from the MIT-licensed Sentry repository. The copyright and license notice are preserved in `assets/footage/sentry/SENTRY-LICENSE.txt`. Graphic motifs and audio are original to this production.

For reproduction, check out the audited commit in an isolated directory, run `npx -y pnpm@9.12.3 --filter @qa/run-engine... install --frozen-lockfile` and `npx -y pnpm@9.12.3 --filter @qa/run-engine... build` there. From the film workspace, pass that directory to `node scripts/capture/replay-sentry-manifest.mjs`.
