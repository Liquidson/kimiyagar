"use strict";

/* ═══════════════════════════════════════════════════
   method2.js — روش ۱×۲: حروف سه‌گانه از مداخل
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: Core, Steps, Render
   ═══════════════════════════════════════════════════ */

const Method2 = (() => {
  function run(q, y, m, d, h, min) {
    const timeStr = `${Core.num2words(y)} ${m} ${Core.dayOrdinal(d)} ${Core.num2words(h)} ${Core.num2words(min)}`;
    const full = Core.normalizeText(`${q} ${timeStr}`);

    /* ── مرحله ۱: سوال ── */
    Steps.add('سوال اصلی',
      `<div style="font-size:17px;color:var(--ink);line-height:2">${Core.escapeHTML(q)}</div>`);
    Steps.setProgress(6);

    /* ── مرحله ۲: افزودن زمان و تعدیل حروف ── */
    Steps.add('افزودن زمان به سوال',
      `<div style="color:var(--gold);line-height:2;margin-bottom:6px">${Core.escapeHTML(timeStr)}</div>
       <div class="small">متن کامل:</div>
       <div style="color:var(--ink);line-height:2;font-size:14px">${Core.escapeHTML(full)}</div>`);
    Steps.setProgress(12);

    const letters = Core.extractLetters(full);
    if (!letters.length) return null;
    Steps.add(`تعدیل و جداسازی حروف ابجدی — ${letters.length} حرف`, Render.chipsWithNum(letters));
    Steps.setProgress(18);

    /* ── مرحله ۳: عدد کبیر ── */
    const kabir = Core.calculateKabir(full);
    Steps.add('محاسبه عدد کبیر',
      `<div style="font-size:30px;color:var(--gold-light);text-align:center;letter-spacing:4px;padding:8px">${kabir}</div>
       <div class="small" style="text-align:center">مجموع ارزش ابجد کبیر تمام حروف</div>`);
    Steps.setProgress(28);

    /* ── مرحله ۴: مداخل تنزلی ── */
    const mad = Core.madakhel(kabir);
    Steps.add('مداخل تنزلی',
      `<div class="small" style="margin-bottom:6px">آنقدر یکان را با باقی عدد جمع می‌کنیم تا یک‌رقمی شود</div>
       <div style="direction:ltr;text-align:center;color:var(--gold);font-size:18px;line-height:2.2;letter-spacing:1px">${mad.join('  ←  ')}</div>`);
    Steps.setProgress(38);

    /* ── مرحله ۵: استنطاق ── */
    let est = [];
    for (const n of mad) est.push(...Core.estentat2(n));
    Steps.add(`استنطاق — ${est.length} حرف`,
      `<div class="small" style="margin-bottom:6px">تفکیک ارقام هر عدد و تبدیل به حرف ابجدی</div>${Render.chips(est)}`);
    Steps.setProgress(46);

    /* ── مرحله ۶: بسط ملفوظی ── */
    const L1 = Core.besatMalfoozi(est);
    Steps.add(`بسط ملفوظی — ${L1.length} حرف`,
      `<div class="small" style="margin-bottom:6px">نوشتن حروف به همان شکل که تلفظ می‌شوند</div>${Render.chips(L1)}`);
    Steps.setProgress(54);

    /* ── مرحله ۷: نظیره ابجدی ── */
    const L2 = Core.nazeeraAbjadi(L1);
    Steps.add('نظیره ابجدی',
      `<div class="small" style="margin-bottom:6px">حرف روبروی هر حرف در دایره ابجدی (۱۴ حرف جلوتر)</div>${Render.chips(L2)}`);
    Steps.setProgress(62);

    /* ── مرحله ۸: نظیره اهطمی ── */
    const L3 = Core.nazeeraAhatami(L2);
    Steps.add('نظیره اهطمی',
      `<div class="small" style="margin-bottom:6px">حرف روبروی هر حرف در ترتیب اهطمی (۱۴ حرف جلوتر)</div>${Render.chips(L3)}`);
    Steps.setProgress(68);

    /* ── مرحله ۹: تکسیر موخر و صدر (سطر چهارم) ── */
    const L4 = Core.taksir(L3);
    Steps.add('تکسیر موخر و صدر',
      `<div class="small" style="margin-bottom:6px">روی سطر نظیره اهطمی — آخر، اول، یکی‌مانده‌به‌آخر، دوم...</div>${Render.chips(L4)}`);
    Steps.setProgress(74);

    /* ── مرحله ۱۰: امتزاج چهار سطر (ستونی) ── */
    const mix4 = Core.imtezaj4(L1, L2, L3, L4);
    Steps.add(`امتزاج چهار سطر — ${mix4.length} حرف`,
      `<div class="small" style="margin-bottom:6px">چهار سطر هم‌طول؛ ستون‌به‌ستون کنار هم چیده می‌شوند:</div>
       <div style="font-size:12px;color:var(--ink-dim);line-height:2.1;direction:rtl;margin-bottom:8px">
         <div><span style="color:var(--gold-dim)">۱) بسط ملفوظی:</span> ${L1.join(' ')}</div>
         <div><span style="color:var(--gold-dim)">۲) نظیره ابجدی:</span> ${L2.join(' ')}</div>
         <div><span style="color:var(--gold-dim)">۳) نظیره اهطمی:</span> ${L3.join(' ')}</div>
         <div><span style="color:var(--gold-dim)">۴) تکسیر:</span> ${L4.join(' ')}</div>
       </div>
       ${Render.chips(mix4)}`);
    Steps.setProgress(80);

    /* ── مرحله ۱۱+۱۲: تعیین نوع و جداسازی سه دسته ── */
    const { malf, malb, masr } = Core.separateGroups(mix4);
    Steps.add('تعیین نوع و جداسازی سه دسته',
      `<div style="color:#4a7a4a;margin-bottom:4px">ملفوظی — ${malf.length} حرف</div>${Render.chips(malf)}
       <div style="color:#4a4a8a;margin:8px 0 4px">ملبوبی — ${malb.length} حرف</div>${Render.chips(malb)}
       <div style="color:#7a4a4a;margin:8px 0 4px">مسروری — ${masr.length} حرف</div>${Render.chips(masr)}`);
    Steps.setProgress(86);

    /* ── مرحله ۱۳: امتزاج سه‌گانه (بدون تکسیر) ── */
    const mixed = Core.emtezaj3(malf, malb, masr);
    Steps.add(`امتزاج سه‌گانه — ${mixed.length} حرف`, Render.chipsEmtezaj(mixed));
    Steps.setProgress(90);

    /* ── مرحله ۱۴: شمارش به ۴ ── */
    const picked = Core.pickFourth(mixed);
    Steps.add(`شمارش به ۴ — ${picked.length} حرف`, Render.chipsWithNum(picked));
    Steps.setProgress(94);

    /* ── مرحله ۱۵: امتحان حروف (فاصله ۳) ── */
    const { accepted, log } = Core.emtehan(picked, 3);  // فاصله ۳ برای روش ۲
    Steps.add(`امتحان حروف (فاصله ۳) — ${accepted.length} تأیید`, Render.chipsEmtehan(log));
    Steps.setProgress(98);

    /* ── مرحله ۱۶+۱۷: خوانش حروف مستحصله ── */
    const finalLetters = accepted.length ? accepted : (picked.length ? picked : ['ا']);
    const reading = finalLetters.join('');
    Steps.add('خوانش حروف مستحصله',
      `<div style="font-size:28px;letter-spacing:8px;color:var(--gold-light);text-align:center;padding:10px">${reading || '—'}</div>`);
    Steps.activateLast();
    Steps.setProgress(100);

    return { finalLetters, reading, full, timeStr };
  }
  return { run };
})();
