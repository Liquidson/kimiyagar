import assert from 'assert';
import fs from 'fs';

const referencePath = 'references/kimiyagar-v1-volume2-single-file-clean.html';
const reference = fs.readFileSync(referencePath, 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const registry = fs.readFileSync('js/registry.js', 'utf8');
const history = fs.readFileSync('js/history.js', 'utf8');
const calculationToolsV2 = fs.readFileSync('js/tools/calculation-tools-v2-controller.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

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

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n');
}

function extractBlock(kind, source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${kind}\\s+[^>]*data-source="${escaped}"[^>]*>([\\s\\S]*?)<\\/${kind}>`, 'g');
  const matches = [...reference.matchAll(re)];
  assert.strictEqual(matches.length, 1, `${kind}[data-source="${source}"] must exist exactly once`);
  return matches[0][1];
}

function assertIndexOrder(paths) {
  const positions = paths.map((path) => {
    const position = index.indexOf(path);
    assert(position >= 0, `${path} is missing from index.html`);
    return position;
  });
  for (let i = 1; i < positions.length; i += 1) {
    assert(positions[i - 1] < positions[i], `${paths[i - 1]} must load before ${paths[i]}`);
  }
}

test('extracted files match reference data-source blocks', () => {
  const targets = [
    ['style', 'css/volume-sections.css'],
    ['script', 'js/core/mostahsela-v2/constants.js'],
    ['script', 'js/core/mostahsela-v2/engine.js'],
    // mostahsela-v2.js intentionally contains the approved V1 input auto-spacing parity patch.
    ['script', 'js/tools/calculation-tools-v2-controller.js'],
    ['script', 'js/tools/volume-pages-controller.js'],
  ];
  for (const [kind, path] of targets) {
    assert.strictEqual(
      normalizeLineEndings(fs.readFileSync(path, 'utf8')),
      normalizeLineEndings(extractBlock(kind, path)),
      `${path} must match the extracted ${kind} block`
    );
  }
});

test('volume stylesheet loads after tool styles and before main.css', () => {
  assertIndexOrder([
    'css/mostahsela.css',
    'css/calculation-tools.css',
    'css/volume-sections.css',
    'css/main.css',
  ]);
});

test('script load order preserves dependencies', () => {
  assertIndexOrder([
    'js/core/mostahsela-v2/constants.js',
    'js/core/mostahsela-v2/engine.js',
    'js/tools/mostahsela-v2.js',
  ]);
  assertIndexOrder([
    'js/core/calculation-tools/utils.js',
    'js/core/calculation-tools/madakhel.js',
    'js/core/calculation-tools/order.js',
    'js/core/calculation-tools/rotation.js',
    'js/core/calculation-tools/taksir-sadr.js',
    'js/core/calculation-tools/taksir-moakhar.js',
    'js/core/calculation-tools/laqt-circular.js',
    'js/core/calculation-tools/laqt-linear.js',
    'js/tools/calculation-tools-controller.js',
    'js/tools/calculation-tools-v2-controller.js',
    'js/tools/volume-pages-controller.js',
    'js/app.js',
  ]);
});

test('outer pages and mounting hosts remain singular', () => {
  assert.strictEqual(count(index, /id="mostahselaPage"/g), 1);
  assert.strictEqual(count(index, /id="mostahselaPageBody"/g), 1);
  assert.strictEqual(count(index, /id="calculationToolsPage"/g), 1);
  assert.strictEqual(count(index, /id="calculationToolsPageBody"/g), 1);
});

test('app mounts volume pages once and routes tool cards to existing pages', () => {
  assert.strictEqual(count(app, /VolumePagesController\.mountMostahsela/g), 1);
  assert.strictEqual(count(app, /VolumePagesController\.mountTools/g), 1);
  assert(app.includes("VolumePagesController.activateMostahsela(1)"));
  assert(app.includes("VolumePagesController.activateTools(1)"));
  assert(app.includes("Pages.open('mostahselaPage')"));
  assert(app.includes("Pages.open('calculationToolsPage')"));
  assert(!index.includes('MostahselaToolController.initUI();'));
  assert(!index.includes('CalculationToolsController.initUI();'));
});

test('registry keeps one card per active tool with two-volume metadata', () => {
  assert(/id:'mostahsela'[\s\S]*?volumes:\[1,2\]/.test(registry));
  assert(/id:'toolset'[\s\S]*?volumes:\[1,2\]/.test(registry));
  assert(!registry.includes("id:'astrology'"), 'astrology tool must be absent from Registry');
  assert(!registry.includes('محاسبه استرولوژی'), 'astrology label must be absent from Registry');
  assert(/id:'jafar11'[\s\S]*?enabled:false/.test(registry));
  assert(/id:'jafar15'[\s\S]*?enabled:false/.test(registry));
});

test('volume 2 calculation tools expose seven tools and reuse shared engines', () => {
  for (const id of ['madakhel', 'order', 'rotation', 'taksir_sadr', 'taksir_moakhar', 'laqt_circular', 'laqt_linear']) {
    assert(calculationToolsV2.includes(`${id}: {`), `${id} selector entry missing`);
  }
  for (const engineCall of [
    'CalculationToolMadakhel.calculate',
    'CalculationToolOrder.calculate',
    'CalculationToolRotation.calculate',
    'CalculationToolTaksirSadr.calculate',
    'CalculationToolTaksirMoakhar.calculate',
    'CalculationToolLaqtCircular.calculate',
    'CalculationToolLaqtLinear.calculate',
  ]) {
    assert(calculationToolsV2.includes(engineCall), `${engineCall} is not used`);
    assert(!calculationToolsV2.includes(`const ${engineCall.split('.')[0]}`), `${engineCall} engine must not be duplicated`);
  }
});

test('history defaults legacy records to volume 1 and routes volume 2 restores', () => {
  assert(history.includes('p.volume || r.volume || r.meta?.volume || 1'));
  assert(history.includes('meta: { ...(r.meta || {}), volume }'));
  assert(history.includes('payload: {'));
  assert(history.includes('MostahselaV2ToolController.restoreRecord(it)'));
  assert(history.includes('const controller = volume === 2 ? CalculationToolsV2Controller : CalculationToolsController;'));
  assert(history.includes('controller.restoreResult(p)'));
});

test('production runtime does not load the reference HTML or cache it', () => {
  assert(!index.includes(referencePath));
  assert(!sw.includes(referencePath));
  assert(!sw.includes('kimiyagar-v1-volume2-single-file-clean.html'));
});

console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
if (failed > 0) process.exit(1);
