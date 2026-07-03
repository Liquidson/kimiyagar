
"use strict";

/* ═══════════════════════════════════════════════════
   mostahsela-v2/constants.js — داده‌های موتور مستحصله جلد دوم
   منبع انتقال: mostahsela V2 0.html
   نکته: این فایل فقط داده و ثابت‌ها را نگه می‌دارد.
   ═══════════════════════════════════════════════════ */

const MostahselaV2Constants = (() => {
  const ABJAD_ORDER = Object.freeze([
    'ا','ب','ج','د','ه','و','ز','ح','ط','ی','ک','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ',
  ]);

  const PERSIAN_NORMALIZE = Object.freeze({
    'پ':'ب','چ':'ج','ژ':'ز','گ':'ک','أ':'ا','إ':'ا','آ':'ا','ٱ':'ا',
    'ؤ':'و','ئ':'ی','ك':'ک','ي':'ی','ة':'ه','ۀ':'ه','ى':'ی',
  });

  const DIACRITICS = Object.freeze(['َ','ِ','ُ','ً','ٍ','ٌ','ْ','ّ','ء','ٔ','ـ']);

  // جدول تناقض جلد دوم؛ عیناً از فایل مرجع انتقال داده شده است.
  const DEFAULT_TABLE = Object.freeze({
    'ا': Object.freeze({ 1:Object.freeze(['ع']), 2:Object.freeze(['ع']), 3:Object.freeze(['ع']) }),
    'ب': Object.freeze({ 1:Object.freeze(['ف','ث','ض','ظ','غ']), 2:Object.freeze([]), 3:Object.freeze(['س','ق','ش','ث','خ','ذ','ض','ظ']) }),
    'ج': Object.freeze({ 1:Object.freeze(['ص','ق','ش','ث','خ','ض','ظ','غ']), 2:Object.freeze(['ط','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['ط','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']) }),
    'د': Object.freeze({ 1:Object.freeze(['ز','ط','ص','ق','ظ']), 2:Object.freeze(['د','ص','ظ']), 3:Object.freeze(['د','ص','ظ']) }),
    'ه': Object.freeze({ 1:Object.freeze(['د','ح','ط','ع','ص','ق','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['د','ح','ط','ع','ص','ق','ث','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['د','ح','ط','ع','ص','ق','ث','خ','ذ','ض','ظ','غ']) }),
    'و': Object.freeze({ 1:Object.freeze(['ه','ط','ع','ص','خ','ظ','غ']), 2:Object.freeze(['ه','ع','خ','غ']), 3:Object.freeze(['ه','ع','خ','غ']) }),
    'ز': Object.freeze({ 1:Object.freeze(['ط','س','ف','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ط','س','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['س','ق','ش','ث','خ','ذ','ض','ظ','غ']) }),
    'ح': Object.freeze({ 1:Object.freeze(['ه','ط','ع','ص','خ','ظ','غ']), 2:Object.freeze([]), 3:Object.freeze([]) }),
    'ط': Object.freeze({ 1:Object.freeze(['ج','د','ز','ح','ک','ص','ت','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','ص','ت','ث','ذ','ض','ظ']), 3:Object.freeze(['ج','ص','ت','ث','ذ','ض','ظ']) }),
    'ی': Object.freeze({ 1:Object.freeze(['ظ']), 2:Object.freeze(['د','ظ']), 3:Object.freeze([]) }),
    'ک': Object.freeze({ 1:Object.freeze(['ط','ق','غ']), 2:Object.freeze(['ط','ق','غ']), 3:Object.freeze(['ق','غ']) }),
    'ل': Object.freeze({ 1:Object.freeze(['ض']), 2:Object.freeze(['ع','ث','ض']), 3:Object.freeze(['ض']) }),
    'م': Object.freeze({ 1:Object.freeze([]), 2:Object.freeze(['ظ']), 3:Object.freeze(['ظ']) }),
    'ن': Object.freeze({ 1:Object.freeze([]), 2:Object.freeze(['د']), 3:Object.freeze(['ع','ص','ث','ذ','ض']) }),
    'س': Object.freeze({ 1:Object.freeze(['ز','ص','ش','ث','ذ','ض','ظ','غ']), 2:Object.freeze(['ز','ص','ش','ث','ذ','ض','ظ']), 3:Object.freeze(['ز','ص','ش','ث','ذ','ض','ظ']) }),
    'ع': Object.freeze({ 1:Object.freeze(['ا','ه','ح','ق','ث','خ','غ']), 2:Object.freeze(['ا','ه','ز','ح','ق','ث','خ','ظ','غ']), 3:Object.freeze(['ا','ه','ح','ط','ص','ق','ث','خ','ذ','ظ','غ']) }),
    'ف': Object.freeze({ 1:Object.freeze(['ب']), 2:Object.freeze(['ث','ذ','ظ']), 3:Object.freeze(['ث','ذ','ظ']) }),
    'ص': Object.freeze({ 1:Object.freeze(['ج','ه','ز','ط','ک','س','ش','ث','خ','ذ','ض','ظ']), 2:Object.freeze(['ج','ه','ز','ح','ک','ع','ث','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['ج','ه','ز','ح','ط','ک','ع','ق','ث','ذ','ض','ظ','غ']) }),
    'ق': Object.freeze({ 1:Object.freeze(['ج','ه','ز','ح','ک','ع','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','ه','ز','ح','ع','ق','ث','ذ','ض','ظ','غ']), 3:Object.freeze(['ج','ه','ز','ح','ع','ق','ث','ذ','ض','ظ','غ']) }),
    'ر': Object.freeze({ 1:Object.freeze(['ل','ث','ذ','ظ']), 2:Object.freeze(['ص','ث','ذ','ظ']), 3:Object.freeze(['ص','ث','ذ','ظ','غ']) }),
    'ش': Object.freeze({ 1:Object.freeze(['ج','د','ه','ز','ح','ک','س','ع','ف','ص','ق','ش','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','د','و','ز','ح','ط','س','ع','ص','ق','ش','ث','خ','ض','ظ','غ']), 3:Object.freeze(['ج','د','و','ز','ح','ط','س','ع','ص','ق','ش','ث','خ','ض','ظ','غ']) }),
    'ت': Object.freeze({ 1:Object.freeze(['ط']), 2:Object.freeze(['ط']), 3:Object.freeze(['ط']) }),
    'ث': Object.freeze({ 1:Object.freeze(['ل','ز','ط','س','ص','ث','ذ','ض','ظ']), 2:Object.freeze(['ز','س','ص','ث','ذ','ض','ظ']), 3:Object.freeze(['ز','س','ص','ث','ذ','ض','ظ','غ']) }),
    'خ': Object.freeze({ 1:Object.freeze(['ج','ه','ز','ح','ک','س','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','ه','ز','ح','ک','ع','ث','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['ج','ه','ز','ح','ط','ک','ع','ث','خ','ذ','ض','ظ','غ']) }),
    'ذ': Object.freeze({ 1:Object.freeze(['ج','د','ه','ز','ح','ک','ع','ص','ق','ش','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','د','ه','ز','ط','ک','س','ص','ق','ش','خ','ذ','ض','ظ','غ']), 3:Object.freeze(['ج','ز','ح','ط','ل','س','ع','ف','ص','ق','ر','ش','خ','ذ','ض','ظ','غ']) }),
    'ض': Object.freeze({ 1:Object.freeze(['ج','ه','ز','ح','ک','ع','ق','ش','ث','خ','ذ','ض','ظ','غ']), 2:Object.freeze(['ج','ه','ز','ح','ط','ک','ع','ص','ق','ش','ث','خ','ذ','ظ','غ']), 3:Object.freeze(['ج','ز','ح','ط','ل','س','ف','ص','ق','ش','ث','خ','ذ','ظ','غ']) }),
    'ظ': Object.freeze({ 1:Object.freeze(['ج','د','ز','ط','س','ص','ق','ش','ث','خ','ذ','ظ','غ']), 2:Object.freeze(['ج','د','و','ز','ح','ط','س','ع','ص','ق','ش','ث','خ','ذ','ظ','غ']), 3:Object.freeze(['ج','ز','ح','ط','ل','س','ع','ص','ق','ش','ث','خ','ذ','ظ','غ']) }),
    'غ': Object.freeze({ 1:Object.freeze(['ج','ه','ز','ح','ک','س','ع','ف','ص','ق','خ','ذ','ض','ظ']), 2:Object.freeze(['ج','ه','ز','ح','ع','ق','ث','ذ','ض','ظ','غ']), 3:Object.freeze(['ج','ه','ز','ح','ک','س','ع','ف','ص','ق','خ','ذ','ض','ظ']) }),
  });

  const MODES = Object.freeze({
    ABJAD_UP: 'abjad-up',
    ABJAD_DOWN: 'abjad-down',
    CIRCLE_UP: 'circle-up',
    CIRCLE_DOWN: 'circle-down',
    DELETION: 'deletion',
    QUEUE: 'queue',
  });

  return { ABJAD_ORDER, PERSIAN_NORMALIZE, DIACRITICS, DEFAULT_TABLE, MODES };
})();

