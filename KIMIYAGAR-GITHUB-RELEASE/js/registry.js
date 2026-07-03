"use strict";

/* ═══════════════════════════════════════════════════
   registry.js — فهرست مرکزی روش‌ها و ابزارها
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: ندارد
   ═══════════════════════════════════════════════════ */

const Registry = (() => {
  /*
   * هر روش یک object با این فیلدها:
   *   id        : شناسه یکتا  ('1x1', '1x2', ...)
   *   volume    : جلد (1 یا 2)
   *   code      : برچسب نمایشی ('1 × 1', '1 × 2')
   *   name      : نام فارسی
   *   enabled   : آیا فعال است؟
   *   run       : تابع اجرا (فقط اگر enabled=true)
   *
   * برای اضافه کردن روش جدید:
   *   1. تابع run را در فایل methods/methodX.js بنویسید
   *   2. یک شیء به لیست زیر اضافه کنید با enabled:true
   */
  const methods = [
    // ─── جلد یکم ───
    { id:'1x1', volume:1, code:'1 × 1', name:'امتزاج حروف سه‌گانه',          enabled:true  },
    { id:'1x2', volume:1, code:'1 × 2', name:'حروف سه‌گانه از مداخل',         enabled:true  },
    { id:'1x3', volume:1, code:'1 × 3', name:'تکسیر استنطاقات',               enabled:true  },
    { id:'1x4', volume:1, code:'1 × 4', name:'بُدّوحُ یَلَن نوع اول',          enabled:false },
    { id:'1x5', volume:1, code:'1 × 5', name:'بدوح یلن نوع دوم',              enabled:false },
    { id:'1x6', volume:1, code:'1 × 6', name:'سیر طالب و مطلوب',              enabled:false },
    { id:'1x7', volume:1, code:'1 × 7', name:'جزء اساس و صفحه نظیره',         enabled:false },
    { id:'1x8', volume:1, code:'1 × 8', name:'رباعی السباعی',                 enabled:false },
    { id:'1x9', volume:1, code:'1 × 9', name:'شمارش ویژه',                    enabled:false },
    { id:'1x10',volume:1, code:'1 × 10',name:'بسط تلفظی اعداد',               enabled:false },
    { id:'1x11',volume:1, code:'1 × 11',name:'اتصالات حروف',                  enabled:false },
    { id:'1x12',volume:1, code:'1 × 12',name:'حصص نمودن',                     enabled:false },
    { id:'1x13',volume:1, code:'1 × 13',name:'صفحات جامع',                    enabled:false },
    // ─── جلد دوم ───
    { id:'2x1', volume:2, code:'2 × 1', name:'آوای غافیطوسی نوع اول',         enabled:false },
    { id:'2x2', volume:2, code:'2 × 2', name:'آوای غافیطوسی نوع دوم',         enabled:false },
    { id:'2x3', volume:2, code:'2 × 3', name:'آوای میزان اهطمی',              enabled:false },
    { id:'2x4', volume:2, code:'2 × 4', name:'آوای بیناتی',                   enabled:false },
    { id:'2x5', volume:2, code:'2 × 5', name:'آوای استخراج عددی',             enabled:false },
    { id:'2x6', volume:2, code:'2 × 6', name:'آوای اهطمی سوال',               enabled:false },
    { id:'2x7', volume:2, code:'2 × 7', name:'آوای اهطمی نوع دوم',            enabled:false },
    { id:'2x8', volume:2, code:'2 × 8', name:'آوای نظم تطبیقی',               enabled:false },
    { id:'2x9', volume:2, code:'2 × 9', name:'آوای وزن تطبیقی',               enabled:false },
    { id:'2x10',volume:2, code:'2 × 10',name:'آوای وزن ثابت',                 enabled:false },
    { id:'2x11',volume:2, code:'2 × 11',name:'باب‌های مشترک نوع اول',          enabled:false },
    { id:'2x12',volume:2, code:'2 × 12',name:'باب‌های مشترک نوع دوم',          enabled:false },
    { id:'2x13',volume:2, code:'2 × 13',name:'باب‌های مشترک موزون',            enabled:false },
  ];

  /*
   * هر ابزار یک object با این فیلدها:
   *   id      : شناسه
   *   icon    : آیکون نمایشی
   *   name    : نام فارسی
   *   desc    : توضیح کوتاه
   *   model   : نام مدل (اختیاری، برای JAFAR)
   *   enabled : آیا فعال است؟
   */
  const tools = [
    { id:'mostahsela', icon:'⚗', name:'محاسبه مستحصله',    desc:'استخراج حروف مستحصله',   enabled:true,  run:true, volumes:[1,2] },
    { id:'toolset',    icon:'∑', name:'ابزار محاسبه',       desc:'مجموعه ابزارهای تخصصی محاسبه',   enabled:true,  run:true, volumes:[1,2] },
    { id:'jafar11',    icon:'⌁', name:'خوانش و تفسیر جواب', desc:'تحلیل هوشمند حروف مستحصله',      model:'JAFAR.1.1', enabled:false },
    { id:'jafar15',    icon:'◇', name:'چت با هوش مصنوعی',   desc:'دستیار تخصصی مسلط به علم جفر',  model:'JAFAR.1.5', enabled:false },
  ];

  function getMethod(id) { return methods.find(m => m.id === id); }
  function getMethodsByVolume(v) { return methods.filter(m => m.volume === v); }

  return { methods, tools, getMethod, getMethodsByVolume };
})();
