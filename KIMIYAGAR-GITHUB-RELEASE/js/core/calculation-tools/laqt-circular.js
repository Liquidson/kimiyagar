"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/laqt-circular.js — لقط متصل (شمارش منفصل دایره‌ای)
   Circular detached counting: removes every Nth letter from a circular sequence
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolLaqtCircular = (() => {
  function calculate(inputString, countValue, startValue) {
    if (!inputString || !inputString.trim()) {
      return { error: 'رشته ورودی را وارد کنید' };
    }

    const input = inputString.trim().split(/\s+/).filter(Boolean);
    if (input.length === 0) {
      return { error: 'حروفی را وارد کنید' };
    }

    const count = parseInt(countValue);
    const start = parseInt(startValue);

    if (!count || count < 1) {
      return { error: 'عدد شمارش باید مثبت باشد' };
    }
    if (!start || start < 1) {
      return { error: 'شماره شروع باید مثبت باشد' };
    }

    let letters = [...input];
    const output = [];
    const stepsLog = [];
    let pos = (start - 1) % letters.length;
    let stepNum = 0;

    while (letters.length > 0) {
      stepNum++;
      const before = [...letters];
      const startLetter = letters[pos];
      const selIdx = (pos + count - 1) % letters.length;

      // Counting path
      const countPath = [];
      for (let k = 0; k < count; k++) {
        countPath.push(letters[(pos + k) % letters.length]);
      }

      const selected = letters[selIdx];
      output.push(selected);

      stepsLog.push({
        stepNum,
        before: [...before],
        startLetter,
        startIdx: pos + 1,
        count,
        countPath: [...countPath],
        selected,
        output: [...output]
      });

      letters.splice(selIdx, 1);
      if (letters.length > 0) pos = selIdx % letters.length;
    }

    return {
      success: true,
      output,
      steps: stepsLog
    };
  }

  return { calculate };
})();
