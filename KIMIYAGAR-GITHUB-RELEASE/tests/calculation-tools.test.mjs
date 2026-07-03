import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ console });

const modules = [
  ['js/core/calculation-tools/utils.js', 'CalculationToolsUtils'],
  ['js/core/calculation-tools/madakhel.js', 'CalculationToolMadakhel'],
  ['js/core/calculation-tools/order.js', 'CalculationToolOrder'],
  ['js/core/calculation-tools/rotation.js', 'CalculationToolRotation'],
  ['js/core/calculation-tools/taksir-sadr.js', 'CalculationToolTaksirSadr'],
  ['js/core/calculation-tools/taksir-moakhar.js', 'CalculationToolTaksirMoakhar'],
  ['js/core/calculation-tools/laqt-circular.js', 'CalculationToolLaqtCircular'],
  ['js/core/calculation-tools/laqt-linear.js', 'CalculationToolLaqtLinear']
];

for (const [relativePath, globalName] of modules) {
  const fullPath = path.join(root, relativePath);
  const source = fs.readFileSync(fullPath, 'utf8');
  vm.runInContext(`${source}\nthis.${globalName} = ${globalName};`, context, { filename: relativePath });
}

let passed = 0;
let failed = 0;

function check(condition, message, details = '') {
  if (condition) {
    passed += 1;
    console.log(`✓ ${message}`);
  } else {
    failed += 1;
    console.error(`✗ ${message}${details ? ` — ${details}` : ''}`);
  }
}

function equal(actual, expected, message) {
  check(Object.is(actual, expected), message, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function deepEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(a === e, message, `expected ${e}, got ${a}`);
}

const {
  CalculationToolMadakhel: Madakhel,
  CalculationToolOrder: Order,
  CalculationToolRotation: Rotation,
  CalculationToolTaksirSadr: TaksirSadr,
  CalculationToolTaksirMoakhar: TaksirMoakhar,
  CalculationToolLaqtCircular: LaqtCircular,
  CalculationToolLaqtLinear: LaqtLinear
} = context;

// Madakhel
let result = Madakhel.calculate('سامان');
check(result.success === true, 'Madakhel parses a valid input');
equal(result.count, 5, 'Madakhel counts all five letters in سامان');
check(result.kabir > 0, 'Madakhel calculates عدد کبیر');
check(result.bala > 0, 'Madakhel calculates عدد بلامرتبه');
check(result.saghir >= 1 && result.saghir <= 9, 'Madakhel keeps عدد صغیر in 1–9');
check(Madakhel.calculate('').error !== undefined, 'Madakhel rejects empty input');
result = Madakhel.calculate('س ا م ا ن');
check(result.success === true, 'Madakhel accepts spaced input');
equal(result.count, 5, 'Madakhel ignores spaces without dropping letters');

// Order
result = Order.calculate('د ا ب ا', 'ا ب ج د', 'error');
check(result.success === true, 'Order performs a basic sort');
deepEqual(result.output, ['ا', 'ا', 'ب', 'د'], 'Order follows the supplied circle');
check(Order.calculate('د ا ب ع', 'ا ب ج د', 'error').error !== undefined, 'Order detects out-of-circle letters in error mode');
result = Order.calculate('د ا ب ع', 'ا ب ج د', 'keep');
check(result.success === true, 'Order supports keep mode');
equal(result.output.at(-1), 'ع', 'Order keeps out-of-circle letters at the end');
check(Order.calculate('', 'ا ب ج', 'error').error !== undefined, 'Order rejects empty input');

// Rotation
result = Rotation.calculate('ا ب', 'ا ب ج د', 'up', 2, 'error');
check(result.success === true, 'Rotation performs a basic operation');
equal(result.rows.length, 3, 'Rotation returns rows 0 through 2');
deepEqual(result.rows[0], ['ا', 'ب'], 'Rotation row 0 is unchanged');
deepEqual(result.rows[1], ['ب', 'ج'], 'Rotation row 1 moves upward');
deepEqual(result.rows[2], ['ج', 'د'], 'Rotation row 2 moves upward');
result = Rotation.calculate('ا ب', 'ا ب ج د', 'down', 1, 'error');
deepEqual(result.rows[1], ['د', 'ا'], 'Rotation supports downward movement');
check(Rotation.calculate('ا', 'ا ب ا ج', 'up', 1, 'error').error !== undefined, 'Rotation detects duplicate circle letters');

// Taksir Sadr
result = TaksirSadr.calculate('ا ب ج د ه');
check(result.success === true, 'Taksir Sadr performs a basic operation');
check(result.rows.length > 1, 'Taksir Sadr generates multiple rows');
deepEqual(result.rows[0].split(' '), ['ا', 'ب', 'ج', 'د', 'ه'], 'Taksir Sadr preserves the first row');
equal(result.rows.at(-1).replaceAll(' ', ''), 'ابجده', 'Taksir Sadr returns to the original sequence');
check(TaksirSadr.calculate('').error !== undefined, 'Taksir Sadr rejects empty input');
result = TaksirSadr.calculate('ا');
check(result.success === true, 'Taksir Sadr accepts a single character');
equal(result.cycleCount, 1, 'Taksir Sadr records one transformation for a single-character cycle');

// Taksir Moakhar
result = TaksirMoakhar.calculate('ا ب ج د ه');
check(result.success === true, 'Taksir Moakhar performs a basic operation');
check(result.rows.length > 1, 'Taksir Moakhar generates multiple rows');
const sadr = TaksirSadr.calculate('ا ب ج د ه');
check(result.rows[1] !== sadr.rows[1], 'Taksir Moakhar differs from Taksir Sadr');
equal(result.rows.at(-1).replaceAll(' ', ''), 'ابجده', 'Taksir Moakhar returns to the original sequence');

// Laqt Circular
result = LaqtCircular.calculate('ا ب ج د ه', '3', '1');
check(result.success === true, 'Laqt Circular performs a basic operation');
equal(result.output.length, 5, 'Laqt Circular extracts every letter');
equal(result.steps.length, 5, 'Laqt Circular logs every step');
equal(result.steps[0].countPath.length, 3, 'Laqt Circular records the counting path');
check(LaqtCircular.calculate('ا ب ج', '0', '1').error !== undefined, 'Laqt Circular rejects zero count');
check(LaqtCircular.calculate('ا ب ج', '2', '0').error !== undefined, 'Laqt Circular rejects zero start');

// Laqt Linear
result = LaqtLinear.calculate('ا ب ج د ه', '2', '1', 'rtl');
check(result.success === true, 'Laqt Linear performs RTL extraction');
deepEqual(result.output, ['ا', 'ج', 'ه'], 'Laqt Linear RTL output is correct');
equal(result.steps.length, 3, 'Laqt Linear records RTL steps');
result = LaqtLinear.calculate('ا ب ج د ه', '2', '1', 'ltr');
check(result.success === true, 'Laqt Linear performs LTR extraction');
deepEqual(result.output, ['ه', 'ج', 'ا'], 'Laqt Linear LTR output is correct');
check(LaqtLinear.calculate('ا ب ج', '0', '1', 'rtl').error !== undefined, 'Laqt Linear rejects zero count');
check(LaqtLinear.calculate('ا ب ج', '2', '5', 'rtl').error !== undefined, 'Laqt Linear rejects an out-of-range start');

console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed} | Skipped: 0`);
if (failed > 0) process.exitCode = 1;
