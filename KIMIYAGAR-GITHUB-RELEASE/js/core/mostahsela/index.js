"use strict";

/* ═══════════════════════════════════════════════════
   مستحصله - نقطه ورود یکپارچه
   تمام ماژول‌های محاسباتی
   ═══════════════════════════════════════════════════ */

const Mostahsela = (() => {
  const {
    ABJAD_ORDER, MOSTAHSELA_MODES, DEFAULT_TEST_CONFIG, TANAQOZ_TABLE,
    HAMAVAI_TABLE, LETTER_DOTS, ABJAD_KABIR, ABJAD_BALAMARTABE,
  } = MostahselaConstants;
  const { toLetterArray, standardizeText, toPersianDigits } = MostahselaNormalize;
  const { normalizeTestConfig, runAllTests } = MostahselaTestEngine;
  const { calculateMostahsela } = MostahselaEngine;

  return {
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
  };
})();
