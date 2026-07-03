"use strict";

/* ═══════════════════════════════════════════════════
   مستحصله - موتور آزمون‌ها
   تناقض آوایی، هم‌آوایی، تکرار، استثنای حق
   ═══════════════════════════════════════════════════ */

const MostahselaTestEngine = (() => {
  const { DEFAULT_TEST_CONFIG, HAQ_GROUP_A, HAQ_GROUP_B, HAMAVAI_TABLE, TANAQOZ_TABLE } = MostahselaConstants;
  const { toPersianDigits } = MostahselaNormalize;

  function isHaqException(letter, lastN) {
    if (!lastN || lastN.length === 0) return false;
    const last = lastN[lastN.length - 1];
    return HAQ_GROUP_A.includes(last) && HAQ_GROUP_B.includes(letter);
  }

  function testTanaqoz(letter, lastN) {
    const conflicts = TANAQOZ_TABLE[letter] || [];
    if (conflicts.length === 0) {
      return { pass: true, reason: 'این حرف تناقض آوایی ندارد' };
    }

    const conflicting = lastN.filter((char) => conflicts.includes(char));
    if (conflicting.length > 0 && isHaqException(letter, lastN)) {
      const last = lastN[lastN.length - 1];
      return {
        pass: true,
        reason: `استثنای حق: «${last} ${letter}» از راست به چپ حق خوانده می‌شود`,
      };
    }

    if (conflicting.length > 0) {
      return { pass: false, reason: `تناقض با: ${conflicting.join('، ')}` };
    }
    return { pass: true, reason: 'بدون تناقض' };
  }

  function testHamavai(letter, lastN) {
    const homophones = HAMAVAI_TABLE[letter] || [];
    if (homophones.length === 0) {
      return { pass: true, reason: 'این حرف هم‌آوا ندارد' };
    }

    const found = lastN.filter((char) => homophones.includes(char));
    if (found.length > 0) {
      return {
        pass: false,
        reason: `هم‌آوا با: ${found.join('، ')} در سطر موجود است`,
      };
    }
    return { pass: true, reason: 'بدون هم‌آوا در سطر' };
  }

  function testTakrar(letter, lastN) {
    if (lastN.includes(letter)) {
      return {
        pass: false,
        reason: `حرف "${letter}" در ${toPersianDigits(lastN.length)} حرف آخر تکرار شده`,
      };
    }
    return { pass: true, reason: 'تکرار نشده' };
  }

  function normalizeTestConfig(config = {}) {
    return {
      tanaqoz: {
        active: config.tanaqoz?.active ?? DEFAULT_TEST_CONFIG.tanaqoz.active,
        num: Number.parseInt(config.tanaqoz?.num, 10) || DEFAULT_TEST_CONFIG.tanaqoz.num,
      },
      hamavai: {
        active: config.hamavai?.active ?? DEFAULT_TEST_CONFIG.hamavai.active,
        num: Number.parseInt(config.hamavai?.num, 10) || DEFAULT_TEST_CONFIG.hamavai.num,
      },
      takrar: {
        active: config.takrar?.active ?? DEFAULT_TEST_CONFIG.takrar.active,
        num: Number.parseInt(config.takrar?.num, 10) || DEFAULT_TEST_CONFIG.takrar.num,
      },
    };
  }

  function runAllTests(letter, mostahsalat, rawConfig = {}) {
    const config = normalizeTestConfig(rawConfig);
    const results = {};
    let passed = true;

    if (config.tanaqoz.active) {
      const lastN = mostahsalat.slice(-config.tanaqoz.num);
      const result = testTanaqoz(letter, lastN);
      results.tanaqoz = { ...result, checked: lastN };
      if (!result.pass) passed = false;
    } else {
      results.tanaqoz = { pass: true, reason: 'غیرفعال', checked: [], skipped: true };
    }

    if (config.hamavai.active) {
      const lastN = mostahsalat.slice(-config.hamavai.num);
      const result = testHamavai(letter, lastN);
      results.hamavai = { ...result, checked: lastN };
      if (!result.pass) passed = false;
    } else {
      results.hamavai = { pass: true, reason: 'غیرفعال', checked: [], skipped: true };
    }

    if (config.takrar.active) {
      const lastN = mostahsalat.slice(-config.takrar.num);
      const result = testTakrar(letter, lastN);
      results.takrar = { ...result, checked: lastN };
      if (!result.pass) passed = false;
    } else {
      results.takrar = { pass: true, reason: 'غیرفعال', checked: [], skipped: true };
    }

    return { passed, results };
  }

  return { isHaqException, testTanaqoz, testHamavai, testTakrar, normalizeTestConfig, runAllTests };
})();
