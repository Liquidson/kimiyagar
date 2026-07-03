/* ═══════════════════════════════════════════════════
   مستحصله - تست‌های Golden Regression
   تأیید رفتار محرک بر اساس Fixtures ثبت‌شده
   ═══════════════════════════════════════════════════ */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMostahselaLegacy } from './helpers/load-mostahsela-legacy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, 'fixtures', 'mostahsela-golden.json');

// Load the production engine
const engine = loadMostahselaLegacy();

// Load fixtures
const fixturesData = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
const fixtures = fixturesData.fixtures;

console.log(`\n═══════════════════════════════════════════════════`);
console.log(`مستحصله - تست‌های Golden Regression`);
console.log(`Golden Fixtures Regression Test`);
console.log(`═══════════════════════════════════════════════════\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const fixture of fixtures) {
  try {
    // Execute the engine with fixture input
    const result = engine.calculateMostahsela({
      letters: fixture.input.letters,
      mode: engine.MOSTAHSELA_MODES[fixture.mode.toUpperCase().replace(/-/g, '_')],
      ...(fixture.input.circle && { customCircle: fixture.input.circle }),
      config: fixture.input.config,
    });

    // Validate expected outputs
    if (fixture.expectedOutput.finalRow !== undefined) {
      assert.strictEqual(
        result.finalRow,
        fixture.expectedOutput.finalRow,
        `finalRow mismatch for ${fixture.id}`
      );
    }

    if (fixture.expectedOutput.mostahsalat !== undefined) {
      assert.deepStrictEqual(
        result.mostahsalat,
        fixture.expectedOutput.mostahsalat,
        `mostahsalat mismatch for ${fixture.id}`
      );
    }

    if (fixture.expectedOutput.stepsCount !== undefined) {
      assert.strictEqual(
        result.steps.length,
        fixture.expectedOutput.stepsCount,
        `steps count mismatch for ${fixture.id}`
      );
    }

    // Validate output structure
    assert(Array.isArray(result.mostahsalat), `${fixture.id}: mostahsalat must be array`);
    assert(Array.isArray(result.steps), `${fixture.id}: steps must be array`);
    assert(typeof result.finalRow === 'string', `${fixture.id}: finalRow must be string`);
    assert(result.summary !== undefined, `${fixture.id}: summary must exist`);
    assert(typeof result.mode === 'string', `${fixture.id}: mode must be string`);

    console.log(`✓ ${fixture.id}: ${fixture.description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${fixture.id}: ${error.message}`);
    failed++;
    failures.push({
      id: fixture.id,
      error: error.message,
    });
  }
}

// Test determinism: run a fixture twice and compare
console.log(`\n─────────────────────────────────────────────────`);
console.log(`Determinism Test`);
console.log(`─────────────────────────────────────────────────\n`);

const deterministicFixture = fixtures.find(f => f.id === 'determinism-repeated');
if (deterministicFixture) {
  try {
    const result1 = engine.calculateMostahsela({
      letters: deterministicFixture.input.letters,
      mode: engine.MOSTAHSELA_MODES[deterministicFixture.mode.toUpperCase().replace(/-/g, '_')],
      config: deterministicFixture.input.config,
    });

    const result2 = engine.calculateMostahsela({
      letters: deterministicFixture.input.letters,
      mode: engine.MOSTAHSELA_MODES[deterministicFixture.mode.toUpperCase().replace(/-/g, '_')],
      config: deterministicFixture.input.config,
    });

    assert.deepStrictEqual(result1, result2, 'Identical inputs must produce identical outputs');
    console.log(`✓ Determinism verified: repeated calls produce identical output`);
    passed++;
  } catch (error) {
    console.log(`✗ Determinism test failed: ${error.message}`);
    failed++;
  }
}

// Summary
console.log(`\n═══════════════════════════════════════════════════`);
console.log(`Golden Test Summary`);
console.log(`═══════════════════════════════════════════════════`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log(`\nFailures:`);
  failures.forEach(f => console.log(`  - ${f.id}: ${f.error}`));
  process.exit(1);
} else {
  console.log(`\n✓✓✓ All Golden Fixture tests passed ✓✓✓\n`);
  process.exit(0);
}
