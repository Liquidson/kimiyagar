/* ═══════════════════════════════════════════════════
   مستحصله - بارگذار برای پروژه Node.js
   بارگذاری فایل‌های IIFE بدون تغییر
   ═══════════════════════════════════════════════════ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

/**
 * Load the production Mostahsela IIFE modules in correct order
 * without modification, returning the public API
 *
 * This loader executes the browser-style IIFE modules in a function scope
 * that simulates a script tag environment.
 */
export function loadMostahselaLegacy() {
  // Concatenate all modules in order
  const scripts = [
    'js/core/mostahsela/constants.js',
    'js/core/mostahsela/normalize.js',
    'js/core/mostahsela/test-engine.js',
    'js/core/mostahsela/mostahsela-engine.js',
    'js/core/mostahsela/index.js',
  ];

  let concatenatedCode = '';
  for (const script of scripts) {
    const filePath = path.join(projectRoot, script);
    const code = fs.readFileSync(filePath, 'utf8');
    // Remove "use strict" from each file to allow global assignment
    const cleanedCode = code.replace(/^["']use strict["'];?\s*/m, '');
    concatenatedCode += cleanedCode + '\n\n';
  }

  // Create a global scope object and execute the code in a function context
  // This simulates how script tags work in the browser
  const globalScope = {};

  try {
    // Use Function constructor to execute code in a scope where const/var declarations
    // can be captured. We'll wrap it so we can access the final values.
    const moduleLoaderFunc = new Function(
      'globalScope',
      `
      // Execute the concatenated module code
      ${concatenatedCode}

      // Return the public API
      return {
        Mostahsela,
        MostahselaConstants,
        MostahselaNormalize,
        MostahselaTestEngine,
        MostahselaEngine,
      };
      `
    );

    const modules = moduleLoaderFunc(globalScope);

    if (!modules.Mostahsela) {
      throw new Error('Mostahsela object not created');
    }

    return modules.Mostahsela;
  } catch (error) {
    throw new Error(`Failed to load Mostahsela modules: ${error.message}`);
  }
}

/**
 * Convenience exports matching the test import expectations
 */
const legacy = loadMostahselaLegacy();

export const {
  calculateMostahsela,
  ABJAD_ORDER,
  MOSTAHSELA_MODES,
  DEFAULT_TEST_CONFIG,
  TANAQOZ_TABLE,
  HAMAVAI_TABLE,
  LETTER_DOTS,
  ABJAD_KABIR,
  ABJAD_BALAMARTABE,
  toLetterArray,
  standardizeText,
  toPersianDigits,
  normalizeTestConfig,
  runAllTests,
} = legacy;
