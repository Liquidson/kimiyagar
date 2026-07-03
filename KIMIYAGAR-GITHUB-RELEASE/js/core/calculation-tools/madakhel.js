"use strict";

/* ═══════════════════════════════════════════════════════════════
   calculation-tools/madakhel.js — محاسبه‌گر مداخل
   Extracts 5 values: عدد کبیر, بلامرتبه, صغیر, تعداد حروف, تعداد نقاط
   ═══════════════════════════════════════════════════════════════ */

const CalculationToolMadakhel = (() => {
  const U = CalculationToolsUtils;

  function calculate(inputText) {
    if (!inputText || !inputText.trim()) {
      return { error: 'لطفاً متن را وارد کنید' };
    }

    const chars = U.standardizeText(inputText);
    if (chars.length === 0) {
      return { error: 'هیچ حرف معتبری یافت نشد' };
    }

    let kabir = 0, bala = 0, dots = 0;
    chars.forEach(c => {
      kabir += U.ABJAD_KABIR[c.standard];
      bala += U.ABJAD_BALAMARTABE[c.standard];
      dots += U.LETTER_DOTS[c.standard];
    });

    let saghir = kabir % 9;
    if (saghir === 0) saghir = 9;

    return {
      success: true,
      original: inputText,
      standardized: chars.map(c => c.standard),
      kabir,
      bala,
      saghir,
      count: chars.length,
      dots,
      table: chars.map(c => ({
        original: c.original,
        standard: c.standard,
        kabir: U.ABJAD_KABIR[c.standard],
        bala: U.ABJAD_BALAMARTABE[c.standard],
        dots: U.LETTER_DOTS[c.standard]
      }))
    };
  }

  return { calculate };
})();
