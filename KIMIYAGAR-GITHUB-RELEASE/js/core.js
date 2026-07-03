"use strict";

/* ═══════════════════════════════════════════════════
   core.js — ثوابت ابجد، utils، الگوریتم‌های پایه
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: ندارد (پایه)
   ═══════════════════════════════════════════════════ */

const Core = (() => {
  const MONTH_NAMES = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const ABJAD_28   = ['ا','ب','ج','د','ه','و','ز','ح','ط','ی','ک','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];
  const PERSIAN_EXTRA = { 'پ':'ب','چ':'ج','ژ':'ز','گ':'ک' };
  const MALFUZI = new Set(['ا','ج','د','ذ','س','ش','ص','ض','ع','غ','ق','ک','ل']);
  const MALBUBI = new Set(['م','ن','و']);
  const ABJAD_VALUES = {
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ی':10,
    'ک':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,
    'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
    'پ':2,'چ':3,'ژ':7,'گ':20
  };
  const ESTENTAT = {
    1:'ا',2:'ب',3:'ج',4:'د',5:'ه',6:'و',7:'ز',8:'ح',9:'ط',10:'ی',
    20:'ک',30:'ل',40:'م',50:'ن',60:'س',70:'ع',80:'ف',90:'ص',100:'ق',
    200:'ر',300:'ش',400:'ت',500:'ث',600:'خ',700:'ذ',800:'ض',900:'ظ',1000:'غ'
  };
  const ABJAD_NAMES = {
    'ا':'الف','ب':'با','ج':'جیم','د':'دال','ه':'ها','و':'واو','ز':'زا',
    'ح':'حا','ط':'طا','ی':'یا','ک':'کاف','ل':'لام','م':'میم','ن':'نون',
    'س':'سین','ع':'عین','ف':'فا','ص':'صاد','ق':'قاف','ر':'را','ش':'شین',
    'ت':'تا','ث':'ثا','خ':'خا','ذ':'ذال','ض':'ضاد','ظ':'ظا','غ':'غین'
  };
  const NAZEERA_ABJADI = {
    'ا':'س','ب':'ع','ج':'ف','د':'ص','ه':'ق','و':'ر','ز':'ش','ح':'ت',
    'ط':'ث','ی':'خ','ک':'ذ','ل':'ض','م':'ظ','ن':'غ','س':'ا','ع':'ب',
    'ف':'ج','ص':'د','ق':'ه','ر':'و','ش':'ز','ت':'ح','ث':'ط','خ':'ی',
    'ذ':'ک','ض':'ل','ظ':'م','غ':'ن'
  };
  const AHATAMI_L1 = ['ا','ه','ط','م','ف','ش','ذ','ب','و','ی','ن','ص','ت','ض'];
  const AHATAMI_L2 = ['ج','ز','ک','س','ق','ث','ظ','د','ح','ل','ع','ر','خ','غ'];
  const NAZEERA_AHATAMI = {};
  for (let i = 0; i < 14; i++) {
    NAZEERA_AHATAMI[AHATAMI_L1[i]] = AHATAMI_L2[i];
    NAZEERA_AHATAMI[AHATAMI_L2[i]] = AHATAMI_L1[i];
  }
  const HOMOPHONE = {
    'ا':['ع'],'ع':['ا'],'ه':['ح'],'ح':['ه'],'ت':['ط'],'ط':['ت'],
    'س':['ص','ث'],'ص':['س','ث'],'ث':['س','ص'],
    'ز':['ذ','ض','ظ'],'ذ':['ز','ض','ظ'],'ض':['ز','ذ','ظ'],'ظ':['ز','ذ','ض'],
    'ق':['غ'],'غ':['ق']
  };
  const CONTRADICT = {
    'ج':['ش','ق','غ','خ'],
    'ز':['خ','ق','غ','س','ص','ث','ش'],
    'ه':['ع','ق','غ','خ'],'ح':['ع','ق','غ','خ'],
    'ک':['ق','غ'],
    'س':['ز','ذ','ض','ظ','ش'],
    'ع':['ه','ح','خ','غ','ق'],
    'ص':['ز','ذ','ض','ظ','ش'],
    'ق':['ک','ز','ذ','ض','ظ','ه','ح','ع','خ','ج'],
    'ش':['ج','ز','ذ','ض','ظ','س','ص','ث'],
    'ث':['ز','ذ','ض','ظ','ش'],
    'خ':['ز','ذ','ض','ظ','ه','ح','ع','ق','ج'],
    'ذ':['خ','ق','غ','س','ص','ث','ش'],
    'ض':['خ','ق','غ','س','ص','ث','ش'],
    'ظ':['خ','ق','غ','س','ص','ث','ش'],
    'غ':['ک','ز','ذ','ض','ظ','ه','ح','ع','خ','ج']
  };
  const ONES    = ['','یک','دو','سه','چهار','پنج','شش','هفت','هشت','نه','ده','یازده','دوازده','سیزده','چهارده','پانزده','شانزده','هفده','هجده','نوزده'];
  const TENS    = ['','ده','بیست','سی','چهل','پنجاه','شصت','هفتاد','هشتاد','نود'];
  const HUNDREDS= ['','صد','دویست','سیصد','چهارصد','پانصد','ششصد','هفتصد','هشتصد','نهصد'];
  const ORD = {
    1:'اول',2:'دوم',3:'سوم',4:'چهارم',5:'پنجم',6:'ششم',7:'هفتم',8:'هشتم',9:'نهم',
    10:'دهم',11:'یازدهم',12:'دوازدهم',13:'سیزدهم',14:'چهاردهم',15:'پانزدهم',
    16:'شانزدهم',17:'هفدهم',18:'هجدهم',19:'نوزدهم',20:'بیستم',
    21:'بیست و یکم',22:'بیست و دوم',23:'بیست و سوم',24:'بیست و چهارم',
    25:'بیست و پنجم',26:'بیست و ششم',27:'بیست و هفتم',28:'بیست و هشتم',
    29:'بیست و نهم',30:'سی‌ام',31:'سی و یکم'
  };

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function normalizeText(t) {
    if (!t) return '';
    return t
      .replace(/[ي]/g,'ی').replace(/[ك]/g,'ک')
      .replace(/[ۀة]/g,'ه').replace(/[أإٱآ]/g,'ا')
      .replace(/[ؤ]/g,'و').replace(/[ئ]/g,'ی').replace(/آ/g,'ا')
      .replace(/[\u064B-\u065F\u0670]/g,'')
      .replace(/\s+/g,' ').trim();
  }
  function toJalali(gy, gm, gd) {
    const g = [31,28,31,30,31,30,31,31,30,31,30,31];
    let jy, jm, jd, i;
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days = 355666 + 365*gy + ~~((gy2+3)/4) - ~~((gy2+99)/100) + ~~((gy2+399)/400) + gd;
    for (i = 0; i < gm-1; i++) days += g[i];
    jy = -1595 + 33 * ~~(days/12053);
    days %= 12053;
    jy += 4 * ~~(days/1461);
    days %= 1461;
    if (days > 365) { jy += ~~((days-1)/365); days = (days-1)%365; }
    if (days < 186) { jm = 1 + ~~(days/31); jd = 1 + days%31; }
    else { jm = 7 + ~~((days-186)/30); jd = 1 + (days-186)%30; }
    return { jy, jm, jd };
  }
  function num2words(n) {
    n = parseInt(n);
    if (isNaN(n) || n === 0) return 'صفر';
    let p = [];
    if (n >= 1000) { const th = Math.floor(n/1000); p.push(th===1 ? 'هزار' : num2words(th)+' هزار'); n %= 1000; }
    if (n >= 100) { p.push(HUNDREDS[Math.floor(n/100)]); n %= 100; }
    if (n >= 20) { const t=Math.floor(n/10),o=n%10; p.push(o ? TENS[t]+' و '+ONES[o] : TENS[t]); n=0; }
    else if (n > 0) p.push(ONES[n]);
    return p.join(' و ');
  }
  const dayOrdinal = d => ORD[d] || num2words(d);

  function extractLetters(t) {
    const r = [];
    for (const ch of normalizeText(t)) {
      if (PERSIAN_EXTRA[ch]) r.push(PERSIAN_EXTRA[ch]);
      else if (ABJAD_28.includes(ch)) r.push(ch);
    }
    return r;
  }
  function separateGroups(l) {
    const malf=[], malb=[], masr=[];
    for (const ch of l) {
      if (MALFUZI.has(ch)) malf.push(ch);
      else if (MALBUBI.has(ch)) malb.push(ch);
      else masr.push(ch);
    }
    return { malf, malb, masr };
  }
  function letterType(ch) {
    return MALFUZI.has(ch) ? 'malf' : MALBUBI.has(ch) ? 'malb' : 'masr';
  }
  function taksir(a) {
    const r = []; let lo=0, hi=a.length-1, e=true;
    while (lo <= hi) { if (e) r.push(a[hi--]); else r.push(a[lo++]); e=!e; }
    return r;
  }
  function emtezaj3(a, b, c) {
    const r = [], mx = Math.max(a.length, b.length, c.length);
    for (let i=0; i<mx; i++) {
      if (i<a.length) r.push({ ch:a[i], src:'malf' });
      if (i<b.length) r.push({ ch:b[i], src:'malb' });
      if (i<c.length) r.push({ ch:c[i], src:'masr' });
    }
    return r;
  }
  function imtezaj4(r1, r2, r3, r4) {
    const result = [], mx = Math.max(r1.length, r2.length, r3.length, r4.length);
    for (let i=0; i<mx; i++) {
      if (i<r1.length) result.push(r1[i]);
      if (i<r2.length) result.push(r2[i]);
      if (i<r3.length) result.push(r3[i]);
      if (i<r4.length) result.push(r4[i]);
    }
    return result;
  }
  function pickFourth(arr) {
    const r=[];
    for (let i=3; i<arr.length; i+=4) r.push(typeof arr[i]==='object' ? arr[i].ch : arr[i]);
    return r;
  }
  function emtehan(letters, distance=1) {
    const accepted=[], log=[];
    for (let i=0; i<letters.length; i++) {
      const ch = letters[i];
      const prev = accepted.slice(-distance);
      if (!prev.length) { accepted.push(ch); log.push({ch,kept:true,reason:'اول سطر'}); continue; }
      let conflict = null;
      const immediate = accepted[accepted.length-1];
      for (const p of prev) {
        if (p===ch) { conflict='تکرار با «'+p+'»'; break; }
        if (HOMOPHONE[ch]?.includes(p)) { conflict='هم‌آوا با «'+p+'»'; break; }
        if (HOMOPHONE[p]?.includes(ch)) { conflict='هم‌آوا با «'+p+'»'; break; }
        if (p===immediate && (p==='ه'||p==='ح') && (ch==='ق'||ch==='غ')) { continue; }
        if (CONTRADICT[ch]?.includes(p)) { conflict='تناقض با «'+p+'»'; break; }
        if (CONTRADICT[p]?.includes(ch)) { conflict='تناقض با «'+p+'»'; break; }
      }
      if (conflict) log.push({ch,kept:false,reason:conflict});
      else { accepted.push(ch); log.push({ch,kept:true,reason:'تأیید'}); }
    }
    return { accepted, log };
  }

  function calculateKabir(text) {
    let total = 0;
    for (const ch of normalizeText(text).replace(/\s/g,'')) {
      const c = PERSIAN_EXTRA[ch] || ch;
      if (ABJAD_VALUES[c]) total += ABJAD_VALUES[c];
    }
    return total;
  }
  function madakhel(n) {
    const steps = [n];
    while (n >= 10) { const ones=n%10, rest=Math.floor(n/10); n=ones+rest; steps.push(n); }
    return steps;
  }
  function estentatSingle(n) {
    if (n<=0) return [];
    const result=[], str=String(n);
    let place = Math.pow(10, str.length-1);
    for (const digit of str) {
      const d=parseInt(digit), val=d*place;
      if (val>0 && ESTENTAT[val]) result.push(ESTENTAT[val]);
      place /= 10;
    }
    return result;
  }
  function estentat(n) {
    if (n < 1000) return estentatSingle(n);
    const str=String(n), parts=[];
    for (let i=str.length; i>0; i-=3) parts.unshift(str.substring(Math.max(0,i-3),i));
    const result=[];
    for (const p of parts) result.push(...estentatSingle(parseInt(p)));
    result.push('غ');
    return result;
  }
  function besatMalfoozi(letters) {
    const result=[];
    for (const ch of letters) {
      const name = ABJAD_NAMES[ch] || ch;
      for (const c of name) {
        if (PERSIAN_EXTRA[c]) result.push(PERSIAN_EXTRA[c]);
        else if (ABJAD_28.includes(c)) result.push(c);
      }
    }
    return result;
  }

  function estentatSingleLSB(n){
    const r=[]; const s=String(n); let place=1;
    for(let i=s.length-1;i>=0;i--){ const v=(+s[i])*place; if(v>0&&ESTENTAT[v]) r.push(ESTENTAT[v]); place*=10; }
    return r;
  }
  function estentat2(n){
    const s=String(n);
    const topPlace=Math.pow(10,s.length-1);
    if(topPlace<=1000) return estentatSingleLSB(n);
    const parts=[]; for(let i=s.length;i>0;i-=3) parts.push(s.substring(Math.max(0,i-3),i));
    const r=[]; for(const p of parts) r.push(...estentatSingleLSB(parseInt(p))); r.push('غ');
    return r;
  }
  function nazeeraAbjadi(letters)  { return letters.map(ch => NAZEERA_ABJADI[ch] || ch); }
  function nazeeraAhatami(letters) { return letters.map(ch => NAZEERA_AHATAMI[ch] || ch); }

  return {
    MONTH_NAMES, ABJAD_28, PERSIAN_EXTRA, MALFUZI, MALBUBI,
    ABJAD_VALUES, ESTENTAT, ABJAD_NAMES,
    escapeHTML, normalizeText, toJalali, num2words, dayOrdinal,
    extractLetters, separateGroups, letterType,
    taksir, emtezaj3, imtezaj4, pickFourth, emtehan,
    calculateKabir, madakhel, estentat, estentat2, besatMalfoozi,
    nazeeraAbjadi, nazeeraAhatami
  };
})();
