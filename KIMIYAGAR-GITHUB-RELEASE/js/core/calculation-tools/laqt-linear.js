"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/laqt-linear.js — لقط منقطع (شمارش منفصل خطی)
   Linear detached counting: selects every Nth letter from a linear sequence
   Direction: RTL (right-to-left, default) or LTR (left-to-right)
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolLaqtLinear = (() => {
  function calculate(inputString, countValue, startValue, direction) {
    if (!inputString || !inputString.trim()) {
      return { error: 'رشته ورودی را وارد کنید' };
    }

    let input = inputString.trim().split(/\s+/).filter(Boolean);
    if (input.length === 0) {
      return { error: 'حروفی را وارد کنید' };
    }

    const count = parseInt(countValue);
    const start = parseInt(startValue);

    if (!count || count < 1) {
      return { error: 'عدد شمارش باید مثبت باشد' };
    }
    if (!start || start < 1 || start > input.length) {
      return { error: 'شماره شروع نامعتبر است' };
    }

    // Direction: RTL (default, scientific) = same order; LTR = reversed
    const work = direction === 'rtl' ? input : [...input].reverse();

    const selected = [];
    for (let i = start - 1; i < work.length; i += count) {
      selected.push({
        pos: i + 1,
        letter: work[i]
      });
    }

    return {
      success: true,
      output: selected.map(s => s.letter),
      steps: selected
    };
  }

  return { calculate };
})();
