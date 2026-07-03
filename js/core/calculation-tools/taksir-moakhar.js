"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/taksir-moakhar.js — تکسیر مؤخر و صدر
   Pattern: last, first, second-last, second, ... until return to original
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolTaksirMoakhar = (() => {
  function taksirMoakhar(row) {
    const result = [];
    let left = 0, right = row.length - 1;
    while (left <= right) {
      if (right >= left) { result.push(row[right]); right--; }
      if (left <= right) { result.push(row[left]); left++; }
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
      current = taksirMoakhar(current);
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
