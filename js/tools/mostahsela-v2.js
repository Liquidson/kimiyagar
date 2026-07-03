
"use strict";

/* ═══════════════════════════════════════════════════
   tools/mostahsela-v2.js — رابط مستحصله جلد دوم
   وابستگی: MostahselaV2, History, Toast, Core
   ═══════════════════════════════════════════════════ */

const MostahselaV2ToolController = (() => {
  let _lastRecord = null;

  const MODE_NAMES = Object.freeze({
    'abjad-up': 'ترقی ابجدی',
    'abjad-down': 'تنزل ابجدی',
    'circle-up': 'ترقی دایره دلخواه',
    'circle-down': 'تنزل دایره دلخواه',
    deletion: 'روش حذفی',
    queue: 'روش صفی',
  });

  function initUI() {
    return `
      <div class="mostahsela-tool-wrapper" id="mostahselaV2ToolWrapper">
        <div class="card mostahsela-input-card">
          <div class="sec-title" style="margin-bottom:12px">رشته حروف</div>
          <label for="mostahselaV2Input">حروف یا متن را وارد کنید؛ تعدیل خودکار انجام می‌شود:</label>
          <textarea id="mostahselaV2Input" class="mostahsela-textarea" placeholder="مثال: ج د ا ش ت ک ه"></textarea>
          <div id="mostahselaV2InputError" class="validation-error" style="display:none;margin-top:8px"></div>
        </div>

        <div class="card mostahsela-modes-card">
          <div class="sec-title" style="margin-bottom:16px">انتخاب الگو</div>
          <div class="mostahsela-mode-grid" id="mostahselaV2ModeSwitcher">
            <button type="button" class="mostahsela-mode-btn active" data-v2-mode="abjad-up"><span class="mode-name">ترقی ابجدی</span><span class="mode-label">جلو در دایره ابجد</span></button>
            <button type="button" class="mostahsela-mode-btn" data-v2-mode="abjad-down"><span class="mode-name">تنزل ابجدی</span><span class="mode-label">عقب در دایره ابجد</span></button>
            <button type="button" class="mostahsela-mode-btn" data-v2-mode="circle-up"><span class="mode-name">ترقی دایره</span><span class="mode-label">دایره دلخواه — جلو</span></button>
            <button type="button" class="mostahsela-mode-btn" data-v2-mode="circle-down"><span class="mode-name">تنزل دایره</span><span class="mode-label">دایره دلخواه — عقب</span></button>
            <button type="button" class="mostahsela-mode-btn" data-v2-mode="deletion"><span class="mode-name">حذفی</span><span class="mode-label">حذف حرف متناقض</span></button>
            <button type="button" class="mostahsela-mode-btn" data-v2-mode="queue"><span class="mode-name">صفی</span><span class="mode-label">صف انتظار متناقض‌ها</span></button>
          </div>
        </div>

        <div class="card mostahsela-circle-card" id="mostahselaV2CircleSection" style="display:none">
          <div class="sec-title" style="margin-bottom:12px">دایره دلخواه</div>
          <textarea id="mostahselaV2Circle" class="mostahsela-textarea" placeholder="ا ل م ح ر ف ق ز ه ک د س ع ن ب ج و ی ت ث خ ذ ض ظ غ ص ط ش"></textarea>
          <div id="mostahselaV2CircleError" class="validation-error" style="display:none;margin-top:8px"></div>
        </div>

        <div class="card">
          <div class="sec-title" style="margin-bottom:12px">عمق تناقض</div>
          <p class="small" style="margin-bottom:12px">بررسی به‌صورت تجمعی از فاصله ۱ تا عمق انتخاب‌شده انجام می‌شود.</p>
          <div class="volume-depth-grid" id="mostahselaV2DepthSwitcher" role="radiogroup" aria-label="عمق تناقض">
            <button type="button" class="volume-depth-btn" data-v2-depth="1" aria-pressed="false"><strong>۱</strong><span>فاصله ۱</span></button>
            <button type="button" class="volume-depth-btn" data-v2-depth="2" aria-pressed="false"><strong>۲</strong><span>فاصله ۱ و ۲</span></button>
            <button type="button" class="volume-depth-btn active" data-v2-depth="3" aria-pressed="true"><strong>۳</strong><span>فاصله ۱ تا ۳</span></button>
          </div>
        </div>

        <button type="button" class="calc-btn mostahsela-run-btn" id="mostahselaV2RunBtn">✦ محاسبه مستحصله جلد دوم ✦</button>

        <div id="mostahselaV2Results" style="display:none">
          <div class="divider"><span>✦</span></div>
          <div class="card mostahsela-result-card">
            <div class="sec-title" style="margin-bottom:16px">نتیجه نهایی</div>
            <div class="mostahsela-final-row" id="mostahselaV2FinalRow">—</div>
            <div class="mostahsela-summary-row">
              <div class="mostahsela-summary-chip"><div class="chip-label">پذیرفته</div><div class="chip-value" id="mostahselaV2Accepted">۰</div></div>
              <div class="mostahsela-summary-chip"><div class="chip-label">تغییر یافته</div><div class="chip-value" id="mostahselaV2Changed">۰</div></div>
              <div class="mostahsela-summary-chip"><div class="chip-label">حذف / صف</div><div class="chip-value" id="mostahselaV2Removed">۰</div></div>
            </div>
          </div>
          <div class="card mostahsela-steps-card">
            <div class="sec-title" style="margin-bottom:12px">مراحل محاسبه</div>
            <div id="mostahselaV2StepsList" class="mostahsela-steps-list"></div>
          </div>
          <div class="card">
            <div class="sec-title" style="margin-bottom:8px">یادداشت</div>
            <textarea id="mostahselaV2Note" class="mostahsela-textarea" placeholder="یادداشت روی این نتیجه..."></textarea>
          </div>
          <div class="mostahsela-actions">
            <button type="button" class="tool-btn" id="mostahselaV2CopyBtn">📋 کپی</button>
            <button type="button" class="tool-btn" id="mostahselaV2ShareBtn">🔗 اشتراک</button>
            <button type="button" class="tool-btn" id="mostahselaV2SaveBtn">💾 ذخیره نتیجه و یادداشت</button>
          </div>
        </div>
      </div>`;
  }

  function getMode() {
    return document.querySelector('[data-v2-mode].active')?.dataset.v2Mode || 'abjad-up';
  }

  function getDepth() {
    return Number.parseInt(document.querySelector('[data-v2-depth].active')?.dataset.v2Depth || '3', 10);
  }

  function toggleCircleSection() {
    const mode = getMode();
    const section = document.getElementById('mostahselaV2CircleSection');
    if (section) section.style.display = mode === 'circle-up' || mode === 'circle-down' ? 'block' : 'none';
  }

  function conflictText(conflict) {
    const type = conflict.type === 'repetition' ? 'تکرار' : 'جدول';
    return `${type} در فاصله ${conflict.distance} با «${conflict.previousLetter}»`;
  }

  function renderStep(step, index) {
    const original = Core.escapeHTML(step.originalLetter || '—');
    const finalLetter = Core.escapeHTML(step.finalLetter || '—');
    const snapshot = (step.snapshotBefore || []).map(Core.escapeHTML).join(' ') || '—';
    const labels = {
      accepted: ['accepted', step.origin === 'queue' ? 'از صف پذیرفته شد' : 'پذیرفته شد'],
      'accepted-original': ['accepted', 'پذیرفته شد'],
      'accepted-after-shift': ['changed', 'تغییر یافت'],
      deleted: ['deleted', 'حذف شد'],
      queued: ['queued', 'وارد صف شد'],
      unresolved: ['deleted', 'ناممتحن'],
      'outside-circle': ['deleted', 'خارج از دایره'],
    };
    const [badgeClass, badgeText] = labels[step.action] || ['deleted', step.action || 'نامشخص'];
    const attempts = (step.attempts || []).map((attempt) => {
      const candidate = Core.escapeHTML(attempt.candidate);
      const details = (attempt.conflicts || []).map(conflictText).map(Core.escapeHTML).join(' — ');
      return `<div class="step-detail-row"><span class="label">امتحان «${candidate}»:</span><span class="value ${attempt.passed ? 'pass' : 'fail'}">${attempt.passed ? '✓ بدون تناقض' : `✗ ${details}`}</span></div>`;
    }).join('');

    return `<div class="mostahsela-step-entry">
      <div class="step-header" role="button" tabindex="0" aria-expanded="false">
        <div class="step-num">${index + 1}</div>
        <span class="step-original">${original}</span>
        <span style="color:var(--gold-dim)">←</span>
        <span class="step-final ${step.finalLetter ? 'accepted' : 'rejected'}">${finalLetter}</span>
        <span class="step-badge ${badgeClass}">${badgeText}</span>
        <span class="step-chevron">›</span>
      </div>
      <div class="step-body">
        <div class="step-detail-row"><span class="label">مستحصلات قبل:</span><span class="value">${snapshot}</span></div>
        ${attempts || '<div class="step-detail">برای این مرحله مسیر امتحان وجود ندارد.</div>'}
      </div>
    </div>`;
  }

  function renderResults(result) {
    document.getElementById('mostahselaV2FinalRow').textContent = result.finalRow || '—';
    document.getElementById('mostahselaV2Accepted').textContent = result.summary.accepted;
    document.getElementById('mostahselaV2Changed').textContent = result.summary.changed;
    document.getElementById('mostahselaV2Removed').textContent = result.summary.removed;

    const list = document.getElementById('mostahselaV2StepsList');
    list.innerHTML = (result.steps || []).map(renderStep).join('');
    if (result.remainingQueue?.length) {
      const queue = document.createElement('div');
      queue.className = 'mostahsela-queue-card';
      queue.textContent = `باقی‌مانده در صف: ${result.remainingQueue.join(' ')}`;
      list.appendChild(queue);
    }
    list.querySelectorAll('.step-header').forEach((header) => {
      const toggle = () => {
        const entry = header.parentElement;
        const isOpen = entry.classList.toggle('open');
        header.setAttribute('aria-expanded', String(isOpen));
      };
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
    });
    document.getElementById('mostahselaV2Results').style.display = 'block';
  }

  function calculate() {
    const input = document.getElementById('mostahselaV2Input').value;
    const customCircle = document.getElementById('mostahselaV2Circle').value;
    const inputError = document.getElementById('mostahselaV2InputError');
    const circleError = document.getElementById('mostahselaV2CircleError');
    inputError.style.display = 'none';
    circleError.style.display = 'none';

    try {
      const mode = getMode();
      const depth = getDepth();
      const result = MostahselaV2.calculate({ letters: input, mode, depth, customCircle });
      _lastRecord = {
        id: Date.now(),
        type: 'mostahsela',
        title: `مستحصله جلد دوم — ${MODE_NAMES[mode]}`,
        createdAt: new Date().toISOString(),
        input,
        output: result.finalRow,
        note: '',
        meta: { volume: 2, mode, modeName: MODE_NAMES[mode] },
        payload: {
          volume: 2,
          input,
          mode,
          modeName: MODE_NAMES[mode],
          customCircle,
          depth,
          finalRow: result.finalRow,
          summary: result.summary,
          steps: result.steps,
          remainingQueue: result.remainingQueue || [],
        },
      };
      renderResults(result);
      Toast.show('محاسبه جلد دوم انجام شد ✓');
    } catch (error) {
      const message = error?.message || 'خطا در محاسبه';
      if (getMode() === 'circle-up' || getMode() === 'circle-down') {
        circleError.textContent = message;
        circleError.style.display = 'block';
      } else {
        inputError.textContent = message;
        inputError.style.display = 'block';
      }
    }
  }

  function resultText() {
    if (!_lastRecord) return '';
    const p = _lastRecord.payload;
    return `جلد: دوم\nالگو: ${p.modeName}\nعمق تناقض: ${p.depth}\nورودی: ${p.input}\nخروجی: ${p.finalRow}`;
  }

  function copyResult() {
    const text = resultText();
    if (!text) { Toast.show('ابتدا محاسبه را انجام دهید'); return; }
    navigator.clipboard.writeText(text).then(() => Toast.show('کپی شد ✓')).catch(() => Toast.show('کپی ناموفق بود'));
  }

  function shareResult() {
    const text = resultText();
    if (!text) { Toast.show('ابتدا محاسبه را انجام دهید'); return; }
    if (navigator.share) navigator.share({ title: 'مستحصله جلد دوم', text }).catch(() => {});
    else copyResult();
  }

  function saveToHistory() {
    if (!_lastRecord) { Toast.show('ابتدا محاسبه را انجام دهید'); return; }
    _lastRecord.note = document.getElementById('mostahselaV2Note').value.trim();
    History.push(_lastRecord);
    Toast.show(_lastRecord.note ? 'نتیجه و یادداشت ذخیره شد ✓' : 'نتیجه ذخیره شد ✓');
  }

  function restoreRecord(record) {
    if (!record) return;
    const payload = record.payload || {};
    _lastRecord = record;
    document.getElementById('mostahselaV2Input').value = payload.input || record.input || '';
    document.getElementById('mostahselaV2Circle').value = payload.customCircle || '';
    document.querySelectorAll('[data-v2-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.v2Mode === (payload.mode || 'abjad-up'));
    });
    document.querySelectorAll('[data-v2-depth]').forEach((button) => {
      const active = Number(button.dataset.v2Depth) === Number(payload.depth || 3);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    toggleCircleSection();
    if (payload.finalRow) {
      renderResults({
        finalRow: payload.finalRow,
        summary: payload.summary || { accepted: 0, changed: 0, removed: 0 },
        steps: payload.steps || [],
        remainingQueue: payload.remainingQueue || [],
      });
    }
    document.getElementById('mostahselaV2Note').value = record.note || '';
  }

  function formatLetterInput(text) {
    if (!text) return '';
    const cleaned = text.replace(/\s+/g, '');
    if (!cleaned) return '';
    return Array.from(cleaned).join(' ');
  }

  function init() {
    const wrapper = document.getElementById('mostahselaV2ToolWrapper');
    if (!wrapper) return;

    const inputField = document.getElementById('mostahselaV2Input');
    if (inputField) {
      inputField.addEventListener('input', () => {
        const cursorPos = inputField.selectionStart || 0;
        const oldValue = inputField.value;
        const newValue = formatLetterInput(oldValue);

        if (oldValue !== newValue) {
          inputField.value = newValue;
          const diff = newValue.split(' ').length - oldValue.split(' ').length;
          const nextPos = Math.max(0, Math.min(cursorPos + diff, newValue.length));
          try { inputField.setSelectionRange(nextPos, nextPos); } catch (error) {}
        }
      });

      inputField.addEventListener('paste', (event) => {
        event.preventDefault();
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');
        const formatted = formatLetterInput(pastedText);
        const start = inputField.selectionStart || 0;
        const end = inputField.selectionEnd || start;
        const currentValue = inputField.value;
        inputField.value = formatLetterInput(currentValue.slice(0, start) + formatted + currentValue.slice(end));
        const nextPos = Math.min(start + formatted.length, inputField.value.length);
        try { inputField.setSelectionRange(nextPos, nextPos); } catch (error) {}
      });
    }

    const anchor = MostahselaV2.runAnchorTest();
    if (!anchor.passed) console.warn('Mostahsela V2 anchor test failed.');

    document.getElementById('mostahselaV2ModeSwitcher').addEventListener('click', (event) => {
      const button = event.target.closest('[data-v2-mode]');
      if (!button) return;
      document.querySelectorAll('[data-v2-mode]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      toggleCircleSection();
    });
    document.getElementById('mostahselaV2DepthSwitcher').addEventListener('click', (event) => {
      const button = event.target.closest('[data-v2-depth]');
      if (!button) return;
      document.querySelectorAll('[data-v2-depth]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
    document.getElementById('mostahselaV2RunBtn').addEventListener('click', calculate);
    document.getElementById('mostahselaV2CopyBtn').addEventListener('click', copyResult);
    document.getElementById('mostahselaV2ShareBtn').addEventListener('click', shareResult);
    document.getElementById('mostahselaV2SaveBtn').addEventListener('click', saveToHistory);
    toggleCircleSection();
  }

  return { initUI, init, calculate, restoreRecord };
})();

