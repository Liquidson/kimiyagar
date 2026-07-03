/* ═══════════════════════════════════════════════════
   مستحصله - تست‌های تعیین کننده
   تمام شش روش، نرمال‌سازی، آزمون‌ها
   ═══════════════════════════════════════════════════ */

import {
  ABJAD_ORDER,
  MOSTAHSELA_MODES,
  DEFAULT_TEST_CONFIG,
  TANAQOZ_TABLE,
  HAMAVAI_TABLE,
  LETTER_DOTS,
  ABJAD_KABIR,
  toLetterArray,
  standardizeText,
  toPersianDigits,
  normalizeTestConfig,
  runAllTests,
  calculateMostahsela,
} from './helpers/load-mostahsela-legacy.mjs';

import assert from 'assert';

// Test constants are available
console.log('✓ All exports available from module');

// Test 1: Basic normalization
const input1 = 'الف باء جیم';
const array1 = toLetterArray(input1);
assert.strictEqual(array1.length, 3);
assert.deepStrictEqual(array1, ['الف', 'باء', 'جیم']);
console.log('✓ Test 1: toLetterArray works');

// Test 2: standardizeText with Persian variants
const text2 = 'پچژگ';  // پ چ ژ گ (variants)
const chars2 = standardizeText(text2);
assert.strictEqual(chars2.length, 4);
assert.deepStrictEqual(chars2.map(c => c.standard), ['ب', 'ج', 'ز', 'ک']);
console.log('✓ Test 2: standardizeText normalizes Persian variants');

// Test 3: testTanaqoz - should detect conflict
const config3 = normalizeTestConfig({ tanaqoz: { active: true, num: 3 } });
const mostahsalat3 = ['ا', 'ب'];
const test3 = runAllTests('ج', mostahsalat3, config3);
assert.strictEqual(test3.passed, true);  // ج has no conflict with ا, ب
console.log('✓ Test 3: testTanaqoz works');

// Test 4: testTakrar - should detect repetition
const mostahsalat4 = ['ا', 'ب', 'ج'];
const config4 = normalizeTestConfig({ takrar: { active: true, num: 3 } });
const test4 = runAllTests('ب', mostahsalat4, config4);
assert.strictEqual(test4.passed, false);  // ب already in last 3
console.log('✓ Test 4: testTakrar detects repetition');

// Test 5: Abjad Up mode
const result5 = calculateMostahsela({
  letters: 'ا ب ج',
  mode: MOSTAHSELA_MODES.ABJAD_UP,
  config: DEFAULT_TEST_CONFIG,
});
assert(result5.finalRow);
assert(result5.steps.length > 0);
assert(result5.summary.accepted !== undefined);
console.log('✓ Test 5: Abjad Up mode executes');

// Test 6: Abjad Down mode
const result6 = calculateMostahsela({
  letters: 'ا ب ج',
  mode: MOSTAHSELA_MODES.ABJAD_DOWN,
  config: DEFAULT_TEST_CONFIG,
});
assert(result6.finalRow);
assert(result6.steps.length > 0);
console.log('✓ Test 6: Abjad Down mode executes');

// Test 7: Deletion mode
const result7 = calculateMostahsela({
  letters: 'ا ب ج د',
  mode: MOSTAHSELA_MODES.DELETION,
  config: DEFAULT_TEST_CONFIG,
});
assert(result7.finalRow);
assert(result7.steps.length > 0);
assert.strictEqual(result7.steps[0].type, 'first');
console.log('✓ Test 7: Deletion mode executes');

// Test 8: Queue mode
const result8 = calculateMostahsela({
  letters: 'ا ب ج د ه',
  mode: MOSTAHSELA_MODES.QUEUE,
  config: DEFAULT_TEST_CONFIG,
});
assert(result8.finalRow);
assert(result8.steps.length > 0);
assert(result8.remainingQueue !== undefined);
console.log('✓ Test 8: Queue mode executes');

// Test 9: Circle Up mode with custom circle
const circle9 = ['ا', 'ب', 'ج', 'د', 'ه'];
const result9 = calculateMostahsela({
  letters: 'ا ب ج',
  mode: MOSTAHSELA_MODES.CIRCLE_UP,
  customCircle: circle9,
  config: DEFAULT_TEST_CONFIG,
});
assert(result9.finalRow);
assert(result9.steps.length > 0);
console.log('✓ Test 9: Circle Up mode executes');

// Test 10: Circle Down mode
const result10 = calculateMostahsela({
  letters: 'ا ب ج',
  mode: MOSTAHSELA_MODES.CIRCLE_DOWN,
  customCircle: circle9,
  config: DEFAULT_TEST_CONFIG,
});
assert(result10.finalRow);
assert(result10.steps.length > 0);
console.log('✓ Test 10: Circle Down mode executes');

// Test 11: toPersianDigits
const digits11 = toPersianDigits(123);
assert.strictEqual(digits11, '۱۲۳');
console.log('✓ Test 11: toPersianDigits converts English to Persian digits');

// Test 12: ABJAD_ORDER has 28 letters
assert.strictEqual(ABJAD_ORDER.length, 28);
console.log('✓ Test 12: ABJAD_ORDER has correct length');

// Test 13: testHamavai with empty result
const config13 = normalizeTestConfig({ hamavai: { active: true, num: 2 } });
const mostahsalat13 = ['ب', 'ج'];
const test13 = runAllTests('د', mostahsalat13, config13);
assert.strictEqual(test13.passed, true);  // د has no homophones
console.log('✓ Test 13: testHamavai passes for letter with no homophones');

// Test 14: Empty circle should throw
try {
  calculateMostahsela({
    letters: 'ا ب',
    mode: MOSTAHSELA_MODES.CIRCLE_UP,
    customCircle: [],
    config: DEFAULT_TEST_CONFIG,
  });
  assert.fail('Should throw for empty circle');
} catch (e) {
  assert(e.message.includes('خالی'));
  console.log('✓ Test 14: Empty circle throws appropriate error');
}

// Test 15: No tests enabled should throw
try {
  calculateMostahsela({
    letters: 'ا ب',
    mode: MOSTAHSELA_MODES.ABJAD_UP,
    config: {
      tanaqoz: { active: false, num: 3 },
      hamavai: { active: false, num: 2 },
      takrar: { active: false, num: 5 },
    },
  });
  assert.fail('Should throw when no tests enabled');
} catch (e) {
  assert(e.message.includes('حداقل یک آزمون'));
  console.log('✓ Test 15: No tests enabled throws appropriate error');
}

// Test 16: Letter with out-of-circle should be marked
const result16 = calculateMostahsela({
  letters: 'ا ب ج ش',  // ش is outside circle9
  mode: MOSTAHSELA_MODES.CIRCLE_UP,
  customCircle: circle9,
  config: DEFAULT_TEST_CONFIG,
});
const outOfCircleSteps = result16.steps.filter(s => s.type === 'out-of-circle');
assert(outOfCircleSteps.length > 0);
console.log('✓ Test 16: Out-of-circle letters are properly marked');

// Test 17: All six modes return proper structure
const modes = [
  MOSTAHSELA_MODES.ABJAD_UP,
  MOSTAHSELA_MODES.ABJAD_DOWN,
  MOSTAHSELA_MODES.CIRCLE_UP,
  MOSTAHSELA_MODES.CIRCLE_DOWN,
  MOSTAHSELA_MODES.DELETION,
  MOSTAHSELA_MODES.QUEUE,
];

modes.forEach((mode) => {
  const circle = mode === MOSTAHSELA_MODES.CIRCLE_UP || mode === MOSTAHSELA_MODES.CIRCLE_DOWN
    ? circle9
    : [];
  const result = calculateMostahsela({
    letters: 'ا ب ج د',
    mode: mode,
    customCircle: circle,
    config: DEFAULT_TEST_CONFIG,
  });
  assert(result.finalRow);
  assert(result.steps);
  assert(result.summary);
  assert(result.mode === mode);
  assert(result.config);
});
console.log('✓ Test 17: All six modes return proper structure');

// Test 18: Haq exception (ه/ح followed by ق/غ)
const config18 = normalizeTestConfig({
  tanaqoz: { active: true, num: 3 },
  hamavai: { active: false, num: 2 },
  takrar: { active: false, num: 5 },
});
const mostahsalat18 = ['ا', 'ب', 'ه'];  // ه in position
const test18 = runAllTests('ق', mostahsalat18, config18);
// ق normally conflicts with ه, but haq exception should allow it
assert.strictEqual(test18.results.tanaqoz.pass, true);
console.log('✓ Test 18: Haq exception (ه ق) is properly handled');

// Test 19: Customizable test config distances
const config19 = normalizeTestConfig({
  tanaqoz: { active: true, num: 1 },
  hamavai: { active: false, num: 2 },
  takrar: { active: true, num: 2 },
});
assert.strictEqual(config19.tanaqoz.num, 1);
assert.strictEqual(config19.takrar.num, 2);
console.log('✓ Test 19: Test config distances are customizable');

// Test 20: Identical inputs with identical mode/config produce identical output
const input20 = 'ا ب ج د ه';
const config20 = DEFAULT_TEST_CONFIG;
const result20a = calculateMostahsela({
  letters: input20,
  mode: MOSTAHSELA_MODES.ABJAD_UP,
  config: config20,
});
const result20b = calculateMostahsela({
  letters: input20,
  mode: MOSTAHSELA_MODES.ABJAD_UP,
  config: config20,
});
assert.strictEqual(result20a.finalRow, result20b.finalRow);
assert.strictEqual(result20a.summary.accepted, result20b.summary.accepted);
console.log('✓ Test 20: Identical inputs produce identical outputs (deterministic)');

console.log('\n✓✓✓ All 20 tests passed ✓✓✓');
