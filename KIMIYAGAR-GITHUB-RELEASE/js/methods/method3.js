"use strict";

/* ═══════════════════════════════════════════════════
   method3.js — روش ۱×۳: تکسیر استنطاقات (شیوه سوم)
   کیمیاگری با حروف — v1 (ماژولار)
   وابستگی: Core, Steps, Render, Mostahsela

   مراحل شیوه سوم طبق مرجع:
   ۱. سؤال
   ۲. تعدیل و جداسازی حروف
   ۳. محاسبه ۶ مقدار: کبیر، وسیط مجموعی، وسیط کبیر، صغیر، تعداد حروف، تعداد نقاط
   ۴. استنطاق هر ۶ مقدار از یکان به بالا
   ۵. حذف مکررات
   ۶. دو بار تکسیر مؤخر و صدر
   ۷. کنار هم گذاشتن سه سطر
   ۸. مستحصله صف با عدد ۳ برای هر سه آزمون
   ۹. اتصال و خوانش
   ═══════════════════════════════════════════════════ */

const Method3 = (() => {
  const VASEET_MAJMUI = {
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
    'ی':1,'ک':2,'ل':3,'م':4,'ن':5,'س':6,'ع':7,'ف':8,'ص':9,
    'ق':1,'ر':2,'ش':3,'ت':4,'ث':5,'خ':6,'ذ':7,'ض':8,'ظ':9,'غ':1
  };

  const LETTER_DOTS = {
    'ا':0,'ب':1,'ج':1,'د':0,'ه':0,'و':0,'ز':1,'ح':0,'ط':0,'ی':2,
    'ک':0,'ل':0,'م':0,'ن':1,'س':0,'ع':0,'ف':1,'ص':0,'ق':2,'ر':0,
    'ش':3,'ت':2,'ث':3,'خ':1,'ذ':1,'ض':1,'ظ':1,'غ':1
  };

  const ESTENTAT = {
    1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط',10:'ی',
    20:'ک',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص',100:'ق',
    200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ',1000:'غ'
  };

  function normalizeLetter(ch) {
    return Core.PERSIAN_EXTRA?.[ch] || ch;
  }

  function vaseetMajmui(letters) {
    return letters.reduce((sum, ch) => sum + (VASEET_MAJMUI[normalizeLetter(ch)] || 0), 0);
  }

  function vaseetKabir(kabir) {
    const s = String(Math.max(0, Number(kabir) || 0));
    const last = parseInt(s.slice(-1), 10) || 0;
    const rest = s.length > 1 ? parseInt(s.slice(0, -1), 10) : 0;
    return rest + last;
  }

  function saghir(kabir) {
    let n = Math.max(0, Number(kabir) || 0);
    while (n > 9) {
      n = String(n).split('').reduce((a, d) => a + Number(d), 0);
    }
    return n === 0 ? 9 : n;
  }

  function countDots(letters) {
    return letters.reduce((sum, ch) => sum + (LETTER_DOTS[normalizeLetter(ch)] || 0), 0);
  }

  // استنطاق زیر ۱۰۰۰ از یکان به بالا: ۱۱۵ → ه ی ق نیست؛ برای ۱۵۱: ا ن ق
  function estentatUnder1000(n) {
    const out = [];
    const num = Math.max(0, Number(n) || 0);
    const ones = num % 10;
    const tens = Math.floor(num / 10) % 10;
    const hundreds = Math.floor(num / 100) % 10;
    if (ones) out.push(ESTENTAT[ones]);
    if (tens) out.push(ESTENTAT[tens * 10]);
    if (hundreds) out.push(ESTENTAT[hundreds * 100]);
    return out.filter(Boolean);
  }

  // اعداد بزرگ‌تر از ۹۹۹: سه‌تا‌سه‌تا از راست، هر بخش از یکان به بالا، سپس غ
  function estentat(n) {
    const s = String(Math.max(0, Number(n) || 0));
    const groups = [];
    for (let end = s.length; end > 0; end -= 3) {
      groups.push(parseInt(s.slice(Math.max(0, end - 3), end), 10));
    }
    const out = [];
    groups.forEach(g => out.push(...estentatUnder1000(g)));
    if (groups.length > 1) out.push('غ');
    return out;
  }

  function removeRepeats(arr) {
    const seen = new Set();
    const out = [];
    arr.forEach(ch => {
      if (!seen.has(ch)) {
        seen.add(ch);
        out.push(ch);
      }
    });
    return out;
  }

  function taksirMoakhar(arr) {
    const out = [];
    let lo = 0, hi = arr.length - 1, fromEnd = true;
    while (lo <= hi) {
      out.push(fromEnd ? arr[hi--] : arr[lo++]);
      fromEnd = !fromEnd;
    }
    return out;
  }

  function run(q) {
    const question = String(q || '').trim();
    if (!question) return null;

    const full = Core.normalizeText(question);

    Steps.add('سؤال مبنا',
      `<div style="font-size:17px;color:var(--ink);line-height:2">${Core.escapeHTML(question)}</div>`);
    Steps.setProgress(8);

    const letters = Core.extractLetters(full);
    if (!letters.length) return null;

    Steps.add(`تعدیل و جداسازی حروف ابجدی — ${letters.length} حرف`,
      `<div class="small" style="margin-bottom:6px">در شیوه سوم، متن سؤال مبنای محاسبه است و زمان به‌صورت اجباری افزوده نمی‌شود.</div>${Render.chipsWithNum(letters)}`);
    Steps.setProgress(20);

    const kabir = Core.calculateKabir(full);
    const vMajmui = vaseetMajmui(letters);
    const vKabir = vaseetKabir(kabir);
    const sgr = saghir(kabir);
    const cnt = letters.length;
    const dots = countDots(letters);

    Steps.add('محاسبه شش مقدار',
      `<table class="step2-table" style="width:100%">
        <tr><th>کبیر</th><th>وسیط مجموعی</th><th>وسیط کبیر</th><th>صغیر</th><th>تعداد حروف</th><th>تعداد نقاط</th></tr>
        <tr>
          <td style="color:var(--gold-light);font-size:16px">${kabir}</td>
          <td style="color:var(--gold-light);font-size:16px">${vMajmui}</td>
          <td style="color:var(--gold-light);font-size:16px">${vKabir}</td>
          <td style="color:var(--gold-light);font-size:16px">${sgr}</td>
          <td style="color:var(--gold-light);font-size:16px">${cnt}</td>
          <td style="color:var(--gold-light);font-size:16px">${dots}</td>
        </tr>
      </table>`);
    Steps.setProgress(34);

    const values = [kabir, vMajmui, vKabir, sgr, cnt, dots];
    const valNames = ['کبیر', 'وسیط مجموعی', 'وسیط کبیر', 'صغیر', 'تعداد حروف', 'تعداد نقاط'];
    let est = [];
    let estRows = '';
    values.forEach((v, i) => {
      const e = estentat(v);
      est.push(...e);
      estRows += `<div style="margin:3px 0"><span style="color:var(--gold-dim);font-size:11px">${valNames[i]} (${v}):</span> <span style="color:var(--ink)">${e.join(' ')}</span></div>`;
    });

    Steps.add(`استنطاق — ${est.length} حرف`,
      `<div class="small" style="margin-bottom:8px">تفکیک ارقام از یکان به بالا؛ برای اعداد بزرگ‌تر از ۹۹۹، سه‌تا‌سه‌تا از راست و در پایان «غ»</div>
      <div style="direction:rtl;margin-bottom:10px">${estRows}</div>${Render.chips(est)}`);
    Steps.setProgress(48);

    const dedup = removeRepeats(est);
    Steps.add(`حذف مکررات — ${dedup.length} حرف`,
      `<div class="small" style="margin-bottom:6px">اولین ظهور هر حرف نگه داشته می‌شود.</div>${Render.chips(dedup)}`);
    Steps.setProgress(60);

    const t1 = taksirMoakhar(dedup);
    const t2 = taksirMoakhar(t1);
    Steps.add('دو بار تکسیر مؤخر و صدر',
      `<div class="small" style="margin-bottom:6px">آخر، اول، یکی‌مانده‌به‌آخر، دوم، ...</div>
      <div style="color:var(--gold-dim);margin:6px 0 2px;font-size:12px">سطر اصلی:</div>${Render.chips(dedup)}
      <div style="color:var(--gold-dim);margin:8px 0 2px;font-size:12px">تکسیر اول:</div>${Render.chips(t1)}
      <div style="color:var(--gold-dim);margin:8px 0 2px;font-size:12px">تکسیر دوم:</div>${Render.chips(t2)}`);
    Steps.setProgress(72);

    const combined = [...dedup, ...t1, ...t2];
    Steps.add(`کنار هم گذاشتن سه سطر — ${combined.length} حرف`,
      `<div class="small" style="margin-bottom:6px">سطر اصلی + تکسیر اول + تکسیر دوم</div>${Render.chips(combined)}`);
    Steps.setProgress(82);

    const mostResult = Mostahsela.calculateMostahsela({
      letters: combined.join(' '),
      mode: 'queue',
      config: {
        tanaqoz: { active: true, num: 3 },
        hamavai: { active: true, num: 3 },
        takrar:  { active: true, num: 3 }
      }
    });

    const mostahsalat = mostResult?.mostahsalat || [];
    const remainingQueue = mostResult?.remainingQueue || [];

    Steps.add(`مستحصله صف — ${mostahsalat.length} حرف`,
      `<div class="small" style="margin-bottom:6px">امتحان صف با عدد ۳ برای تناقض، هم‌آوایی و تکرار</div>
      <div style="color:var(--gold-dim);margin:6px 0 2px;font-size:12px">مستحصلات:</div>${Render.chips(mostahsalat)}
      ${remainingQueue.length ? `<div style="color:#c17070;margin:8px 0 2px;font-size:12px">باقی‌مانده در صف:</div>${Render.chips(remainingQueue)}` : ''}`);
    Steps.setProgress(92);

    const finalLetters = mostahsalat.length ? mostahsalat : combined;
    const reading = finalLetters.join('');

    Steps.add('اتصال و خوانش حروف مستحصله',
      `<div style="font-size:28px;letter-spacing:8px;color:var(--gold-light);text-align:center;padding:10px">${reading || '—'}</div>
      <div class="small" style="text-align:center;margin-top:6px">حروف مستحصله متصل، مستقیم یا معکوس جواب است.</div>`);
    Steps.activateLast();
    Steps.setProgress(100);

    return {
      finalLetters,
      reading,
      full,
      metrics: { kabir, vaseetMajmui: vMajmui, vaseetKabir: vKabir, saghir: sgr, count: cnt, dots },
      rows: { estentat: est, dedup, taksir1: t1, taksir2: t2, combined, mostahsalat, remainingQueue }
    };
  }

  return { run, estentat, vaseetMajmui, vaseetKabir, saghir, countDots, taksirMoakhar, removeRepeats };
})();
