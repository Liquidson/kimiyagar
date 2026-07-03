"use strict";

/* ═══════════════════════════════════════════════════
   مستحصله - تطبیع ورودی
   ═══════════════════════════════════════════════════ */

const MostahselaNormalize = (() => {
  const { ABJAD_KABIR, DIACRITICS, PERSIAN_NORMALIZE } = MostahselaConstants;

  function toLetterArray(value) {
    if (Array.isArray(value)) {
      return value.map(String).map((item) => item.trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value.trim().split(/\s+/).filter(Boolean);
    }
    return [];
  }

  function standardizeText(raw) {
    const chars = [];
    for (const ch of String(raw ?? '')) {
      if (DIACRITICS.includes(ch)) continue;
      if (ch === ' ' || ch === '‌') continue;

      const standard = PERSIAN_NORMALIZE[ch] || ch;
      if (DIACRITICS.includes(standard)) continue;
      if (Object.prototype.hasOwnProperty.call(ABJAD_KABIR, standard)) {
        chars.push({ original: ch, standard });
      }
    }
    return chars;
  }

  function toPersianDigits(value) {
    const digits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(value).replace(/[0-9]/g, (digit) => digits[Number(digit)]);
  }

  return { toLetterArray, standardizeText, toPersianDigits };
})();
