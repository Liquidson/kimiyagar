"use strict";

/* ═══════════════════════════════════════════════════
   Calculation Tools Utils
   کیمیاگری با حروف — نسخه ۱
   ═══════════════════════════════════════════════════ */

const CalculationToolsUtils = (() => {
  // ─── Abjad order (for progression/regression) ───
  const ABJAD_ORDER = ['ا','ب','ج','د','ه','و','ز','ح','ط','ی','ک','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];

  // ─── Tables for Madakhel ───
  const ABJAD_KABIR = { 'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ی':10,'ک':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000 };
  const ABJAD_BALAMARTABE = { 'ا':1,'ی':1,'ق':1,'غ':1,'ب':2,'ک':2,'ر':2,'ج':3,'ل':3,'ش':3,'د':4,'م':4,'ت':4,'ه':5,'ن':5,'ث':5,'و':6,'س':6,'خ':6,'ز':7,'ع':7,'ذ':7,'ح':8,'ف':8,'ض':8,'ط':9,'ص':9,'ظ':9 };
  const LETTER_DOTS = { 'ا':0,'ب':1,'ج':1,'د':0,'ه':0,'و':0,'ز':1,'ح':0,'ط':0,'ی':2,'ک':0,'ل':0,'م':0,'ن':1,'س':0,'ع':0,'ف':1,'ص':0,'ق':2,'ر':0,'ش':3,'ت':2,'ث':3,'خ':1,'ذ':1,'ض':1,'ظ':1,'غ':1 };

  // ─── Normalization ───
  const PERSIAN_NORMALIZE = { 'پ':'ب','چ':'ج','ژ':'ز','گ':'ک','أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ؤ':'و','ئ':'ی','ك':'ک','ي':'ی','ة':'ه' };
  const DIACRITICS = ['َ','ِ','ُ','ً','ٍ','ٌ','ْ','ّ','ء','ٔ'];

  // ─── Helper functions ───
  function toPersianDigits(n) {
    const fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(n).replace(/[0-9]/g, d => fa[d]);
  }

  function getNextInSequence(letter, seq, direction) {
    const idx = seq.indexOf(letter);
    if (idx === -1) return null;
    if (direction === 'up') return seq[(idx + 1) % seq.length];
    return seq[(idx - 1 + seq.length) % seq.length];
  }

  function getDirection(mode) {
    if (mode === 'abjad-up' || mode === 'circle-up') return 'up';
    return 'down';
  }

  function standardizeText(raw) {
    let chars = [];
    for (const ch of raw) {
      if (DIACRITICS.includes(ch)) continue;
      if (ch === ' ' || ch === '‌') continue;
      let c = PERSIAN_NORMALIZE[ch] || ch;
      if (DIACRITICS.includes(c)) continue;
      if (ABJAD_KABIR.hasOwnProperty(c)) chars.push({ original: ch, standard: c });
    }
    return chars;
  }

  function lettersFromString(raw) {
    return raw.trim().split(/\s+/).filter(Boolean);
  }

  return {
    ABJAD_ORDER, ABJAD_KABIR, ABJAD_BALAMARTABE, LETTER_DOTS,
    PERSIAN_NORMALIZE, DIACRITICS,
    toPersianDigits, getNextInSequence, getDirection,
    standardizeText, lettersFromString
  };
})();
