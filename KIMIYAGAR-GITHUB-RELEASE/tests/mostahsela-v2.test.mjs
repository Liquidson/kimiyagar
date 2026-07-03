import assert from 'assert';
import fs from 'fs';
import vm from 'vm';

function loadMostahselaV2() {
  const context = { console };
  context.globalThis = context;
  vm.createContext(context);

  const constants = fs.readFileSync('js/core/mostahsela-v2/constants.js', 'utf8');
  const engine = fs.readFileSync('js/core/mostahsela-v2/engine.js', 'utf8');
  vm.runInContext(`${constants}\nglobalThis.MostahselaV2Constants = MostahselaV2Constants;`, context, {
    filename: 'js/core/mostahsela-v2/constants.js',
  });
  vm.runInContext(`${engine}\nglobalThis.MostahselaV2 = MostahselaV2;`, context, {
    filename: 'js/core/mostahsela-v2/engine.js',
  });
  return context.MostahselaV2;
}

const MostahselaV2 = loadMostahselaV2();
const { MODES } = MostahselaV2;

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

function test(name, fn) {
  total += 1;
  try {
    fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${name}: ${error.message}`);
  }
}

function expectThrows(fn, pattern) {
  let thrown = null;
  try {
    fn();
  } catch (error) {
    thrown = error;
  }
  assert(thrown, 'Expected function to throw');
  if (pattern) assert(pattern.test(thrown.message), `Unexpected error message: ${thrown.message}`);
}

const customCircle = 'ا ب ج د ه و ز ح ط ی ک ل م ن س ع ف ص ق ر ش ت ث خ ذ ض ظ غ';
const sampleInput = 'ج د ا ش ت ک ه';

test('internal anchor test passes', () => {
  assert.strictEqual(MostahselaV2.runAnchorTest().passed, true);
});

for (const mode of [
  MODES.ABJAD_UP,
  MODES.ABJAD_DOWN,
  MODES.CIRCLE_UP,
  MODES.CIRCLE_DOWN,
  MODES.DELETION,
  MODES.QUEUE,
]) {
  test(`mode executes: ${mode}`, () => {
    const result = MostahselaV2.calculate({
      letters: sampleInput,
      mode,
      depth: 3,
      customCircle,
    });
    assert.strictEqual(result.mode, mode);
    assert(Array.isArray(result.steps));
    assert(result.summary);
    assert.strictEqual(typeof result.finalRow, 'string');
  });
}

for (const depth of [1, 2, 3]) {
  test(`depth accepted: ${depth}`, () => {
    const result = MostahselaV2.calculate({ letters: sampleInput, mode: MODES.ABJAD_UP, depth });
    assert.strictEqual(result.depth, depth);
  });
}

test('invalid depth is rejected', () => {
  expectThrows(() => MostahselaV2.calculate({ letters: sampleInput, depth: 4 }), /عمق تناقض/);
});

test('Persian and Arabic normalization works', () => {
  assert.deepStrictEqual(
    Array.from(MostahselaV2.normalizeLetters('پچژگأإآؤئكيىة')),
    ['ب', 'ج', 'ز', 'ک', 'ا', 'ا', 'ا', 'و', 'ی', 'ک', 'ی', 'ی', 'ه']
  );
});

test('empty input is rejected', () => {
  expectThrows(() => MostahselaV2.calculate({ letters: '', mode: MODES.ABJAD_UP }), /لطفاً/);
});

test('empty custom circle is rejected for circle mode', () => {
  expectThrows(
    () => MostahselaV2.calculate({ letters: sampleInput, mode: MODES.CIRCLE_UP, customCircle: '' }),
    /دایره دلخواه/
  );
});

test('unknown mode is rejected', () => {
  expectThrows(() => MostahselaV2.calculate({ letters: sampleInput, mode: 'unknown-mode' }), /ناشناخته/);
});

test('identical input produces deeply identical output', () => {
  const input = { letters: sampleInput, mode: MODES.QUEUE, depth: 2 };
  assert.deepStrictEqual(MostahselaV2.calculate(input), MostahselaV2.calculate(input));
});

console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
if (failed > 0) process.exit(1);
