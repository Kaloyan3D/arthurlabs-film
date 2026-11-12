import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [source] = process.argv.slice(2);
if (!source) throw new Error('Pass the path to the built Sentry checkout.');
const {SnapshotEngine} = await import(pathToFileURL(resolve(source, 'packages/snapshot-engine/dist/index.js')).href);
const root = await mkdtemp(join(tmpdir(), 'sentry-manifest-replay-'));
try {
  const file = 'manifest.ndjson';
  const sha256 = createHash('sha256').update('hello').digest('hex');
  const rows = [
    JSON.stringify({relativePath: 'src/a.ts', type: 'file', sha256}),
    '{corrupt',
    JSON.stringify({relativePath: 'src/b.ts', type: 'file', sha256: 'invalid'}),
  ];
  await writeFile(join(root, file), rows.join('\n') + '\n');
  const engine = new SnapshotEngine(root, {
    getSnapshot: () => ({manifest: {artifactId: 'manifest-fixture'}}),
    getArtifact: () => ({relativeStoragePath: file}),
  });
  const hashes = await engine.baselineFileHashes('snapshot-fixture');
  assert.deepEqual([...hashes.keys()], ['src/a.ts']);
  console.log('Input: 3 manifest rows');
  console.log('Returned: 1 baseline entry (src/a.ts)');
  console.log('Malformed rows: skipped without error');
  console.log('PASS: reported behavior reproduced');
} finally {
  await rm(root, {recursive: true, force: true});
}
