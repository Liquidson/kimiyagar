"use strict";

/* ═══════════════════════════════════════════════════
   ابزار مستحصله - کنترلر و رندرر
   کیمیاگری با حروف — نسخه ۱
   وابستگی: Mostahsela, History, Toast, Theme
   ═══════════════════════════════════════════════════ */

const MostahselaToolController = (() => {
  let _lastResult = null;

  const MODE_NAMES = {
    'abjad-up': 'ترقی ابجدی',
    'abjad-down': 'تنزل ابجدی',
    'circle-up': 'ترقی دایره دلخواه',
    'circle-down': 'تنزل دایره دلخواه',
    'deletion': 'روش حذفی',
    'queue': 'روش صفی',
  };

  function initUI() {
    const html = `
      <div class="mostahsela-tool-wrapper" id="mostahselaToolWrapper">
        <!-- ورودی حروف -->
        <div class="card mostahsela-input-card">
          <div class="sec-title" style="margin-bottom:12px">رشته حروف</div>
          <label style="display:block;margin-bottom:8px;color:var(--ink-dim);font-size:14px">حروف را جدا شده با فاصله وارد کنید:</label>
          <textarea id="mostahselaInput" class="mostahsela-textarea" placeholder="مثال: ا ب ج د"></textarea>
          <div id="mostahselaInputError" class="validation-error" style="display:none;margin-top:8px">لطفاً حروفی وارد کنید</div>
        </div>

        <!-- انتخاب روش -->
        <div class="card mostahsela-modes-card">
          <div class="sec-title" style="margin-bottom:16px">انتخاب روش</div>
          <div class="mostahsela-mode-grid" id="mostahselaModeSwitcher">
            <button class="mostahsela-mode-btn active" data-mode="abjad-up">
              <span class="mode-name">ترقی ابجدی</span>
              <span class="mode-label">حرکت رو به جلو در ابجد</span>
            </button>
            <button class="mostahsela-mode-btn" data-mode="abjad-down">
              <span class="mode-name">تنزل ابجدی</span>
              <span class="mode-label">حرکت رو به عقب در ابجد</span>
            </button>
            <button class="mostahsela-mode-btn" data-mode="circle-up">
              <span class="mode-name">ترقی دایره</span>
              <span class="mode-label">دایره دلخواه — رو به جلو</span>
            </button>
            <button class="mostahsela-mode-btn" data-mode="circle-down">
              <span class="mode-name">تنزل دایره</span>
              <span class="mode-label">دایره دلخواه — رو به عقب</span>
            </button>
            <button class="mostahsela-mode-btn" data-mode="deletion">
              <span class="mode-name">حذفی</span>
              <span class="mode-label">حذف حروف مردود</span>
            </button>
            <button class="mostahsela-mode-btn" data-mode="queue">
              <span class="mode-name">صفی</span>
              <span class="mode-label">صف انتظار برای مردودها</span>
            </button>
          </div>
        </div>

        <!-- دایره دلخواه -->
        <div class="card mostahsela-circle-card" id="mostahselaCircleSection" style="display:none">
          <div class="sec-title" style="margin-bottom:12px">دایره دلخواه</div>
          <p class="small" style="margin-bottom:10px;color:var(--ink-dim)">برای روش‌های دایره‌ای، دایره مرجع را وارد کنید:</p>
          <textarea id="mostahselaCircle" class="mostahsela-textarea" placeholder="مثال: ا ب ج د ه و ز ح..."></textarea>
          <div id="mostahselaCircleError" class="validation-error" style="display:none;margin-top:8px"></div>
        </div>

        <!-- آزمون‌ها -->
        <div class="card mostahsela-tests-card">
          <div class="sec-title" style="margin-bottom:16px">آزمون‌ها</div>
          <div class="mostahsela-test-grid">
            <div class="mostahsela-test-item">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <label style="cursor:pointer;display:flex;align-items:center;gap:8px;flex:1">
                  <div class="toggle-switch">
                    <input type="checkbox" id="testTanaqoz" checked class="toggle-checkbox">
                    <span class="toggle-slider"></span>
                  </div>
                  <span style="font-weight:600">تناقض آوایی</span>
                </label>
              </div>
              <p class="small" style="color:var(--ink-dim);margin-bottom:8px;line-height:1.5">بررسی تناقض‌های آوایی حروف</p>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="small" style="color:var(--ink-dim)">آخرین</span>
                <input type="number" id="testTanaqozNum" value="3" min="1" max="28" class="mostahsela-number-input">
                <span class="small" style="color:var(--ink-dim)">حرف</span>
              </div>
            </div>

            <div class="mostahsela-test-item">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <label style="cursor:pointer;display:flex;align-items:center;gap:8px;flex:1">
                  <div class="toggle-switch">
                    <input type="checkbox" id="testHamavai" checked class="toggle-checkbox">
                    <span class="toggle-slider"></span>
                  </div>
                  <span style="font-weight:600">هم‌آوایی</span>
                </label>
              </div>
              <p class="small" style="color:var(--ink-dim);margin-bottom:8px;line-height:1.5">بررسی هم‌آوایی حروف</p>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="small" style="color:var(--ink-dim)">آخرین</span>
                <input type="number" id="testHamavaiNum" value="2" min="1" max="28" class="mostahsela-number-input">
                <span class="small" style="color:var(--ink-dim)">حرف</span>
              </div>
            </div>

            <div class="mostahsela-test-item">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <label style="cursor:pointer;display:flex;align-items:center;gap:8px;flex:1">
                  <div class="toggle-switch">
                    <input type="checkbox" id="testTakrar" checked class="toggle-checkbox">
                    <span class="toggle-slider"></span>
                  </div>
                  <span style="font-weight:600">تکرار</span>
                </label>
              </div>
              <p class="small" style="color:var(--ink-dim);margin-bottom:8px;line-height:1.5">بررسی تکرار حروف</p>
              <div style="display:flex;align-items:center;gap:6px">
                <span class="small" style="color:var(--ink-dim)">آخرین</span>
                <input type="number" id="testTakrarNum" value="5" min="1" max="28" class="mostahsela-number-input">
                <span class="small" style="color:var(--ink-dim)">حرف</span>
              </div>
            </div>
          </div>
          <div id="mostahselaTestError" class="validation-error" style="display:none;margin-top:12px">حداقل یک آزمون را فعال کنید</div>
        </div>

        <!-- دکمه اجرا -->
        <button class="calc-btn mostahsela-run-btn" id="mostahselaRunBtn">✦ محاسبه مستحصله ✦</button>

        <!-- نتایج -->
        <div id="mostahselaResults" style="display:none">
          <div class="divider"><span>✦</span></div>

          <div class="card mostahsela-result-card">
            <div class="sec-title" style="margin-bottom:16px">نتیجه نهایی</div>
            <div class="mostahsela-final-row" id="mostahselaFinalRow">—</div>

            <div class="mostahsela-summary-row">
              <div class="mostahsela-summary-chip">
                <div class="chip-label">پذیرفته شده</div>
                <div class="chip-value" id="mostahselaAccepted">0</div>
              </div>
              <div class="mostahsela-summary-chip">
                <div class="chip-label">تغییر یافته</div>
                <div class="chip-value" id="mostahselaChanged">0</div>
              </div>
              <div class="mostahsela-summary-chip">
                <div class="chip-label">حذف شده / صف</div>
                <div class="chip-value" id="mostahselaRemoved">0</div>
              </div>
            </div>
          </div>

          <!-- مراحل -->
          <div class="card mostahsela-steps-card">
            <div class="sec-title" style="margin-bottom:12px">مراحل محاسبه</div>
            <div id="mostahselaStepsList" class="mostahsela-steps-list"></div>
          </div>

          <!-- یادداشت -->
          <div class="card">
            <div class="sec-title" style="margin-bottom:8px">یادداشت</div>
            <textarea id="mostahselaNote" class="mostahsela-textarea" placeholder="یادداشت بر روی این نتیجه..."></textarea>
          </div>

          <!-- اقدامات -->
          <div class="mostahsela-actions">
            <button class="tool-btn" id="mostahselaCopyBtn">📋 کپی</button>
            <button class="tool-btn" id="mostahselaShareBtn">🔗 اشتراک</button>
            <button class="tool-btn" id="mostahselaSaveBtn">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;
    return html;
  }

  function renderResults(result) {
    const { finalRow, summary, steps, mode, remainingQueue } = result;

    document.getElementById('mostahselaFinalRow').textContent = finalRow || '—';
    document.getElementById('mostahselaAccepted').textContent = summary.accepted;
    document.getElementById('mostahselaChanged').textContent = summary.changed;
    document.getElementById('mostahselaRemoved').textContent = summary.removed;

    const stepsList = document.getElementById('mostahselaStepsList');
    stepsList.innerHTML = '';

    steps.forEach((step, idx) => {
      const div = document.createElement('div');
      div.className = 'mostahsela-step-entry';

      let badgeClass = 'accepted', badgeText = 'پذیرفته شد';
      if (step.type === 'first') badgeText = 'اول رشته';
      else if (step.outcome === 'changed') { badgeClass = 'changed'; badgeText = 'تغییر یافت'; }
      else if (step.outcome === 'deleted') { badgeClass = 'deleted'; badgeText = 'حذف شد'; }
      else if (step.outcome === 'failed') { badgeClass = 'deleted'; badgeText = 'ناممتحن'; }
      else if (step.outcome === 'queued') { badgeClass = 'queued'; badgeText = 'وارد صف شد'; }
      else if (step.type === 'queue-accept') badgeText = 'از صف پذیرفته شد';
      else if (step.type === 'out-of-circle') { badgeClass = 'deleted'; badgeText = 'خارج از دایره'; }

      const finalChar = step.final || '—';
      const finalClass = step.outcome === 'accepted' ? 'unchanged' : step.outcome === 'changed' ? 'accepted' : 'rejected';

      let bodyHTML = '';
      if (step.type === 'first') {
        bodyHTML = `<div class="step-detail">اولین حرف رشته — بدون آزمون پذیرفته می‌شود</div>`;
      } else if (step.type === 'out-of-circle') {
        bodyHTML = `<div class="step-detail fail">این حرف در دایره دلخواه وجود ندارد</div>`;
      } else {
        if (step.snapshotBefore) {
          bodyHTML += `<div class="step-detail-row"><span class="label">مستحصلات قبل:</span><span class="value">${step.snapshotBefore.join(' ')}</span></div>`;
        }
        if (step.tests) {
          const t = step.tests;
          if (!t.tanaqoz.skipped) {
            bodyHTML += `<div class="step-detail-row"><span class="label">تناقض:</span><span class="value ${t.tanaqoz.pass ? 'pass' : 'fail'}">${t.tanaqoz.pass ? '✓ قبول' : '✗ مردود'} — ${t.tanaqoz.reason}</span></div>`;
            if (t.tanaqoz.checked.length > 0) {
              bodyHTML += `<div class="step-detail-row"><span class="label">بررسی شده:</span><span class="value">${t.tanaqoz.checked.join(' ')}</span></div>`;
            }
          }
          if (!t.hamavai.skipped) {
            bodyHTML += `<div class="step-detail-row"><span class="label">هم‌آوا:</span><span class="value ${t.hamavai.pass ? 'pass' : 'fail'}">${t.hamavai.pass ? '✓ قبول' : '✗ مردود'} — ${t.hamavai.reason}</span></div>`;
          }
          if (!t.takrar.skipped) {
            bodyHTML += `<div class="step-detail-row"><span class="label">تکرار:</span><span class="value ${t.takrar.pass ? 'pass' : 'fail'}">${t.takrar.pass ? '✓ قبول' : '✗ مردود'} — ${t.takrar.reason}</span></div>`;
          }
        }
        if (step.path && step.path.length > 1) {
          bodyHTML += `<div class="step-detail-row"><span class="label">مسیر:</span><span class="path">${step.path.join(' ← ')}</span></div>`;
        }
      }

      div.innerHTML = `
        <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="step-num">${idx + 1}</div>
          <span class="step-original">${step.original}</span>
          ${step.original !== finalChar && finalChar !== '—' ? `<span style="color:var(--gold-dim)">←</span><span class="step-final ${finalClass}">${finalChar}</span>` : `<span class="step-final ${finalClass}">${finalChar}</span>`}
          <span class="step-badge ${badgeClass}">${badgeText}</span>
          <span class="step-chevron">›</span>
        </div>
        <div class="step-body">${bodyHTML}</div>
      `;
      stepsList.appendChild(div);
    });

    if (remainingQueue && remainingQueue.length > 0) {
      const qDiv = document.createElement('div');
      qDiv.className = 'mostahsela-queue-card';
      qDiv.innerHTML = `<div style="font-weight:600;margin-bottom:6px">حروف باقی‌مانده در صف:</div><div style="font-family:'Amiri',serif;font-size:16px;color:var(--gold);letter-spacing:2px">${remainingQueue.join(' ')}</div>`;
      stepsList.appendChild(qDiv);
    }

    document.getElementById('mostahselaResults').style.display = 'block';
  }

  function getConfig() {
    return {
      tanaqoz: {
        active: document.getElementById('testTanaqoz').checked,
        num: parseInt(document.getElementById('testTanaqozNum').value) || 3,
      },
      hamavai: {
        active: document.getElementById('testHamavai').checked,
        num: parseInt(document.getElementById('testHamavaiNum').value) || 2,
      },
      takrar: {
        active: document.getElementById('testTakrar').checked,
        num: parseInt(document.getElementById('testTakrarNum').value) || 5,
      },
    };
  }

  function getMode() {
    const active = document.querySelector('.mostahsela-mode-btn.active');
    return active ? active.dataset.mode : 'abjad-up';
  }

  function validate() {
    const input = document.getElementById('mostahselaInput').value.trim();
    const mode = getMode();
    const circle = document.getElementById('mostahselaCircle').value.trim();
    const config = getConfig();

    document.getElementById('mostahselaInputError').style.display = 'none';
    document.getElementById('mostahselaCircleError').style.display = 'none';
    document.getElementById('mostahselaTestError').style.display = 'none';

    if (!input) {
      document.getElementById('mostahselaInputError').style.display = 'block';
      return false;
    }

    if (!config.tanaqoz.active && !config.hamavai.active && !config.takrar.active) {
      document.getElementById('mostahselaTestError').style.display = 'block';
      return false;
    }

    if ((mode === 'circle-up' || mode === 'circle-down') && !circle) {
      document.getElementById('mostahselaCircleError').textContent = 'دایره دلخواه را وارد کنید';
      document.getElementById('mostahselaCircleError').style.display = 'block';
      return false;
    }

    return true;
  }

  function calculate() {
    if (!validate()) return;

    const input = document.getElementById('mostahselaInput').value.trim();
    const mode = getMode();
    const circle = document.getElementById('mostahselaCircle').value.trim();
    const config = getConfig();

    try {
      const result = Mostahsela.calculateMostahsela({
        letters: input,
        mode: mode,
        customCircle: circle || '',
        config: config,
      });

      _lastResult = {
        id: Date.now(),
        type: 'mostahsela',
        title: `مستحصله — ${MODE_NAMES[mode]}`,
        createdAt: new Date().toISOString(),
        input: input,
        output: result.finalRow,
        note: '',
        meta: { mode: mode, modeName: MODE_NAMES[mode] },
        payload: {
          input: input,
          mode: mode,
          modeName: MODE_NAMES[mode],
          customCircle: circle,
          config: config,
          finalRow: result.finalRow,
          summary: result.summary,
          steps: result.steps,
          remainingQueue: result.remainingQueue,
        }
      };

      renderResults(result);
      Toast.show('محاسبه انجام شد ✓');
    } catch (err) {
      Toast.show('خطا در محاسبه: ' + err.message);
      console.error(err);
    }
  }

  function copyResult() {
    if (!_lastResult) {
      Toast.show('ابتدا محاسبه را انجام دهید');
      return;
    }
    const text = `روش: ${_lastResult.modeName}\nحروف ورودی: ${_lastResult.input}\nخروجی: ${_lastResult.finalRow}\nپذیرفته: ${_lastResult.summary.accepted}، تغییر: ${_lastResult.summary.changed}، حذف شده: ${_lastResult.summary.removed}`;
    navigator.clipboard.writeText(text).then(() => {
      Toast.show('کپی شد ✓');
    }).catch(() => {
      Toast.show('خطا در کپی');
    });
  }

  function shareResult() {
    copyResult();
  }

  function saveToHistory() {
    if (!_lastResult) {
      Toast.show('ابتدا محاسبه را انجام دهید');
      return;
    }
    _lastResult.note = document.getElementById('mostahselaNote').value.trim();
    History.push(_lastResult);
    Toast.show('در تاریخچه ذخیره شد ✓');
  }

  function toggleCircleSection() {
    const mode = getMode();
    const section = document.getElementById('mostahselaCircleSection');
    if (mode === 'circle-up' || mode === 'circle-down') {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  }

  function formatLetterInput(text) {
    if (!text) return '';
    // Remove whitespace and split into individual characters, then rejoin with spaces
    const cleaned = text.replace(/\s+/g, '');
    if (!cleaned) return '';
    const chars = Array.from(cleaned);
    return chars.join(' ');
  }

  function init() {
    const wrapper = document.getElementById('mostahselaToolWrapper');
    if (!wrapper) return;

    const inputField = document.getElementById('mostahselaInput');

    // Auto-spacing for letter input
    inputField.addEventListener('input', () => {
      const cursorPos = inputField.selectionStart;
      const oldValue = inputField.value;
      const newValue = formatLetterInput(oldValue);

      if (oldValue !== newValue) {
        inputField.value = newValue;
        // Adjust cursor position for the new formatting
        const diff = (newValue.split(' ').length - oldValue.split(' ').length);
        inputField.selectionStart = Math.max(0, Math.min(cursorPos + diff, newValue.length));
        inputField.selectionEnd = inputField.selectionStart;
      }
    });

    inputField.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const formatted = formatLetterInput(pastedText);

      const start = inputField.selectionStart;
      const end = inputField.selectionEnd;
      const currentValue = inputField.value;

      const newValue = currentValue.slice(0, start) + formatted + currentValue.slice(end);
      inputField.value = formatLetterInput(newValue);

      const newCursorPos = start + formatted.length;
      inputField.selectionStart = newCursorPos;
      inputField.selectionEnd = newCursorPos;
    });

    document.getElementById('mostahselaModeSwitcher').addEventListener('click', (e) => {
      if (e.target.classList.contains('mostahsela-mode-btn')) {
        document.querySelectorAll('.mostahsela-mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        toggleCircleSection();
      }
    });

    document.getElementById('mostahselaRunBtn').addEventListener('click', calculate);
    document.getElementById('mostahselaCopyBtn').addEventListener('click', copyResult);
    document.getElementById('mostahselaShareBtn').addEventListener('click', shareResult);
    document.getElementById('mostahselaSaveBtn').addEventListener('click', saveToHistory);

    toggleCircleSection();
  }

  return { initUI, init, calculate };
})();
