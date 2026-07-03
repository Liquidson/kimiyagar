import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const suites = [
  'tests/mostahsela.test.mjs',
  'tests/mostahsela-golden.test.mjs',
  'tests/mostahsela-v2.test.mjs',
  'tests/mostahsela-v2-auto-spacing.test.mjs',
  'tests/volume2-integration.test.mjs',
  'tests/calculation-tools.test.mjs'
];

let failedSuites = 0;
for (const suite of suites) {
  console.log(`\n===== ${suite} =====`);
  const result = spawnSync(process.execPath, [suite], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) failedSuites += 1;
}

console.log(`\nSuites: ${suites.length} | Passed: ${suites.length - failedSuites} | Failed: ${failedSuites}`);
if (failedSuites > 0) process.exitCode = 1;
