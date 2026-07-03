"use strict";

/* ═══════════════════════════════════════════════════
   method1.js — روش ۱×۱: امتزاج حروف سه‌گانه
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: Core, Steps, Render
   ═══════════════════════════════════════════════════ */

const Method1 = (() => {
  function run(q, y, m, d, h, min) {
    const timeStr = `${Core.num2words(y)} ${m} ${Core.dayOrdinal(d)} ${Core.num2words(h)} ${Core.num2words(min)}`;
    const full = Core.normalizeText(`${q} ${timeStr}`);

    Steps.add('سوال اصلی',
      `<div style="font-size:17px;color:var(--ink);line-height:2">${q}</div>`);
    Steps.setProgress(12);

    Steps.add('افزودن زمان به سوال',
      `<div style="color:var(--gold);line-height:2;margin-bottom:6px">${timeStr}</div>
       <div class="small">متن کامل:</div>
       <div style="color:var(--ink);line-height:2;font-size:14px">${full}</div>`);
    Steps.setProgress(22);

    const letters = Core.extractLetters(full);
    if (!letters.length) return null;

    Steps.add(`جداسازی حروف ابجدی — ${letters.length} حرف`, Render.chipsWithNum(letters));
    Steps.setProgress(33);

    const { malf, malb, masr } = Core.separateGroups(letters);
    Steps.add('تعیین نوع و جداسازی سه دسته',
      `<div style="color:#4a7a4a;margin-bottom:4px">ملفوظی — ${malf.length} حرف</div>${Render.chips(malf)}
       <div style="color:#4a4a8a;margin:8px 0 4px">ملبوبی — ${malb.length} حرف</div>${Render.chips(malb)}
       <div style="color:#7a4a4a;margin:8px 0 4px">مسروری — ${masr.length} حرف</div>${Render.chips(masr)}`);
    Steps.setProgress(46);

    const tMalf = Core.taksir(malf), tMalb = Core.taksir(malb), tMasr = Core.taksir(masr);
    Steps.add('تکسیر موخر و صدر',
      `<div class="small" style="margin-bottom:6px">آخر، اول، یکی‌مانده‌به‌آخر، دوم...</div>
       <div style="color:#4a7a4a;margin-bottom:4px">ملفوظی:</div>${Render.chips(tMalf)}
       <div style="color:#4a4a8a;margin:8px 0 4px">ملبوبی:</div>${Render.chips(tMalb)}
       <div style="color:#7a4a4a;margin:8px 0 4px">مسروری:</div>${Render.chips(tMasr)}`);
    Steps.setProgress(58);

    const mixed = Core.emtezaj3(tMalf, tMalb, tMasr);
    Steps.add(`امتزاج — ${mixed.length} حرف`, Render.chipsEmtezaj(mixed));
    Steps.setProgress(70);

    const picked = Core.pickFourth(mixed);
    Steps.add(`شمارش به ۴ — ${picked.length} حرف`, Render.chips(picked));
    Steps.setProgress(82);

    const { accepted, log } = Core.emtehan(picked, 1);  // فاصله ۱ برای روش ۱
    Steps.add(`امتحان حروف (فاصله ۱) — ${accepted.length} تأیید`, Render.chipsEmtehan(log));
    Steps.setProgress(94);

    const finalLetters = accepted.length ? accepted : (picked.length ? picked : ['ا']);
    const reading = finalLetters.join('');
    Steps.add('خوانش حروف مستحصله',
      `<div style="font-size:28px;letter-spacing:8px;color:var(--gold-light);text-align:center;padding:10px">${reading||'—'}</div>`);
    Steps.activateLast();
    Steps.setProgress(100);

    return { finalLetters, reading, full, timeStr };
  }
  return { run };
})();
