"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/taksir-sadr.js — تکسیر صدر و مؤخر
   Pattern: first, last, second, second-last, ... until return to original
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolTaksirSadr = (() => {
  function taksirSadr(row) {
    const result = [];
    let left = 0, right = row.length - 1;
    while (left <= right) {
      if (left <= right) { result.push(row[left]); left++; }
      if (left <= right) { result.push(row[right]); right--; }
    }
    return result;
  }

  function calculate(inputString) {
    if (!inputString || !inputString.trim()) {
      return { error: 'رشته ورودی را وارد کنید' };
    }

    const input = inputString.trim().split(/\s+/).filter(Boolean);
    if (input.length === 0) {
      return { error: 'حروفی را وارد کنید' };
    }

    const original = input.join(' ');
    const rows = [input];
    let current = input;
    let count = 0;
    const SAFETY = 10000;

    while (true) {
      current = taksirSadr(current);
      count++;
      rows.push(current);
      if (current.join(' ') === original) break;
      if (count >= SAFETY) break;
    }

    return {
      success: true,
      rows: rows.map(r => r.join(' ')),
      cycleCount: count
    };
  }

  return { calculate };
})();
