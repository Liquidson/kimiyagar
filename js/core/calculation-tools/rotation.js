"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/rotation.js — گردش دایره‌ای سطر بر دایره مرجع
   Generates rotation rows by moving each letter N steps through a circle
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolRotation = (() => {
  const U = CalculationToolsUtils;

  function calculate(inputString, circleString, direction, numSteps, outOfBoundMode) {
    const circle = U.lettersFromString(circleString);
    const input = U.lettersFromString(inputString);

    if (circle.length === 0) {
      return { error: 'دایره مرجع را وارد کنید' };
    }
    if (input.length === 0) {
      return { error: 'رشته حرفی را وارد کنید' };
    }
    if (new Set(circle).size !== circle.length) {
      return { error: 'دایره مرجع نباید حروف تکراری داشته باشد' };
    }

    const outside = input.filter(c => !circle.includes(c));
    if (outOfBoundMode === 'error' && outside.length > 0) {
      return { error: `حروف خارج از دایره: ${[...new Set(outside)].join('، ')} — عملیات متوقف شد` };
    }

    const L = circle.length;
    const allRows = [];

    for (let step = 0; step <= numSteps; step++) {
      const row = [];
      input.forEach(letter => {
        const idx = circle.indexOf(letter);
        if (idx === -1) {
          if (outOfBoundMode === 'fixed') row.push(letter);
          return;
        }
        let newIdx = direction === 'up' ? (idx + step) % L : ((idx - step) % L + L) % L;
        row.push(circle[newIdx]);
      });
      allRows.push(row);
    }

    return {
      success: true,
      rows: allRows,
      outside: outside.length > 0 ? outside : null,
      outOfBoundMode,
      direction,
      numSteps
    };
  }

  return { calculate };
})();
