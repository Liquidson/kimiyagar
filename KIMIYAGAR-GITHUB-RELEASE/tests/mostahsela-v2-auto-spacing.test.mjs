import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('js/tools/mostahsela-v2.js', 'utf8');

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

function createHarness() {
  const listeners = new Map();
  const input = {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    addEventListener(type, handler) { listeners.set(type, handler); },
    setSelectionRange(start, end) {
      this.selectionStart = start;
      this.selectionEnd = end;
    },
  };

  const passiveElement = {
    style: {},
    addEventListener() {},
  };

  const elements = new Map([
    ['mostahselaV2ToolWrapper', passiveElement],
    ['mostahselaV2Input', input],
    ['mostahselaV2ModeSwitcher', passiveElement],
    ['mostahselaV2DepthSwitcher', passiveElement],
    ['mostahselaV2RunBtn', passiveElement],
    ['mostahselaV2CopyBtn', passiveElement],
    ['mostahselaV2ShareBtn', passiveElement],
    ['mostahselaV2SaveBtn', passiveElement],
    ['mostahselaV2CircleSection', passiveElement],
  ]);

  const context = {
    console,
    window: { clipboardData: null },
    document: {
      getElementById(id) { return elements.get(id) || passiveElement; },
      querySelector(selector) {
        if (selector === '[data-v2-mode].active') return { dataset: { v2Mode: 'abjad-up' } };
        return null;
      },
      querySelectorAll() { return []; },
    },
    MostahselaV2: { runAnchorTest: () => ({ passed: true }) },
    Core: {},
    History: {},
    Toast: { show() {} },
    navigator: {},
    Event,
  };

  vm.createContext(context);
  vm.runInContext(`${source}
globalThis.__controller = MostahselaV2ToolController;`, context);
  context.__controller.init();
  return { input, listeners };
}

test('Mostahsela V2 typing سامان becomes spaced letters', () => {
  const { input, listeners } = createHarness();
  assert.equal(typeof listeners.get('input'), 'function', 'input listener must be attached to mostahselaV2Input');
  input.value = 'سامان';
  input.selectionStart = input.value.length;
  input.selectionEnd = input.value.length;
  listeners.get('input')();
  assert.equal(input.value, 'س ا م ا ن');
});

test('Mostahsela V2 normalizes whitespace to one space per letter', () => {
  const { input, listeners } = createHarness();
  input.value = 'س  ا\nم\tا ن';
  input.selectionStart = input.value.length;
  input.selectionEnd = input.value.length;
  listeners.get('input')();
  assert.equal(input.value, 'س ا م ا ن');
});

test('Mostahsela V2 pasted Persian text is spaced automatically', () => {
  const { input, listeners } = createHarness();
  assert.equal(typeof listeners.get('paste'), 'function', 'paste listener must be attached to mostahselaV2Input');
  input.value = '';
  input.selectionStart = 0;
  input.selectionEnd = 0;
  listeners.get('paste')({
    preventDefault() {},
    clipboardData: { getData: () => 'سامان' },
  });
  assert.equal(input.value, 'س ا م ا ن');
});

console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
if (failed > 0) process.exit(1);
