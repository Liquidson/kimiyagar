"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/order.js — ترتیب‌دهی بر اساس دایره دلخواه
   Sorts input letters by their position in a custom reference circle
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolOrder = (() => {
  const U = CalculationToolsUtils;

  function calculate(inputString, circleString, outOfBoundMode) {
    const circle = U.lettersFromString(circleString);
    const input = U.lettersFromString(inputString);

    if (circle.length === 0) {
      return { error: 'دایره دلخواه را وارد کنید' };
    }
    if (input.length === 0) {
      return { error: 'رشته حرفی را وارد کنید' };
    }

    const outside = input.filter(c => !circle.includes(c));
    if (outOfBoundMode === 'error' && outside.length > 0) {
      return { error: `حروف خارج از دایره: ${[...new Set(outside)].join('، ')} — عملیات متوقف شد` };
    }

    // Sort: for each letter in circle, include all its occurrences from input
    let output = [];
    circle.forEach(letter => {
      const count = input.filter(c => c === letter).length;
      for (let i = 0; i < count; i++) output.push(letter);
    });

    if (outOfBoundMode === 'keep' && outside.length > 0) {
      output = output.concat(outside);
    }

    // Build table
    const table = circle.map((letter, idx) => {
      const count = input.filter(c => c === letter).length;
      return count > 0 ? {
        letter,
        position: idx + 1,
        count
      } : null;
    }).filter(Boolean);

    return {
      success: true,
      output,
      outside: outside.length > 0 ? outside : null,
      outOfBoundMode,
      table
    };
  }

  return { calculate };
})();
