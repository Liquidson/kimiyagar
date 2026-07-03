"use strict";

const Share = (() => {
  const METHOD_NAMES = { '1x1':'روش ۱×۱ — امتزاج حروف سه‌گانه', '1x2':'روش ۱×۲ — حروف سه‌گانه از مداخل' };
  function txt(r) {
    if (!r) return '';
    const methodName = METHOD_NAMES[r.method] || ('روش ' + (r.method || ''));
    const lines = ['☽ کیمیاگری با حروف', '▪ ' + methodName, '', 'سوال: ' + (r.question || '—'), 'جواب: ' + (r.reading || '—')];
    if (r.note) lines.push('یادداشت: ' + r.note);
    return lines.join('\n');
  }
  function doCopy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-9999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function copyResult(r) { if (!r) { Toast.show('ابتدا نتیجه استخراج کنید'); return; } const text = txt(r); Promise.resolve(doCopy(text)).then(ok => Toast.show(ok ? 'سوال و جواب کپی شد' : 'کپی ناموفق بود')); }
  function shareResult(r) { if (!r) { Toast.show('ابتدا نتیجه استخراج کنید'); return; } const text = txt(r); if (navigator.share) { navigator.share({ title:'کیمیاگری با حروف', text }).catch(() => {}); } else { Promise.resolve(doCopy(text)).then(ok => Toast.show(ok ? 'کپی شد (اشتراک پشتیبانی نمی‌شود)' : 'کپی ناموفق')); } }
  return { copyResult, shareResult };
})();
