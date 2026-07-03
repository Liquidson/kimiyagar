"use strict";

/* ═══════════════════════════════════════════════════
   tools/calculation-tools-controller.js — Calculation Tools UI Controller
   کیمیاگری با حروف — نسخه ۱
   Redesigned to match Mostahsela card-based layout
   وابستگی: CalculationTool*, History, Toast, Pages
   ═══════════════════════════════════════════════════ */

const CalculationToolsController = (() => {
  const U = CalculationToolsUtils;
  let _currentTool = 'madakhel';
  let _lastResult = null;

  const TOOLS = {
    madakhel: {
      id: 'madakhel',
      title: 'محاسبه‌گر مداخل',
      icon: '∑',
      desc: 'عدد کبیر، بلامرتبه، صغیر، تعداد حروف و نقاط'
    },
    order: {
      id: 'order',
      title: 'ترتیب‌دهی بر اساس دایره دلخواه',
      icon: '⊙',
      desc: 'مرتب‌سازی بر اساس یک دایره مرجع'
    },
    rotation: {
      id: 'rotation',
      title: 'گردش دایره‌ای',
      icon: '↻',
      desc: 'چرخش رشته بر روی دایره مرجع'
    },
    taksir_sadr: {
      id: 'taksir_sadr',
      title: 'تکسیر صدر و مؤخر',
      icon: '⇄',
      desc: 'الگوی: اول، آخر، دوم، یکی‌مانده‌به‌آخر...'
    },
    taksir_moakhar: {
      id: 'taksir_moakhar',
      title: 'تکسیر مؤخر و صدر',
      icon: '⇆',
      desc: 'الگوی: آخر، اول، یکی‌مانده‌به‌آخر، دوم...'
    },
    laqt_circular: {
      id: 'laqt_circular',
      title: 'لقط متصل',
      icon: '⋈',
      desc: 'شمارش منفصل دایره‌ای'
    },
    laqt_linear: {
      id: 'laqt_linear',
      title: 'لقط منقطع',
      icon: '⋯',
      desc: 'شمارش منفصل خطی'
    }
  };

  // ─── Auto-spacing formatter for letter inputs ───
  function autoSpaceLetters(input) {
    const normalized = input.trim().split('').filter(ch => ch !== ' ').join(' ');
    return normalized;
  }

  function attachAutoSpacing(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', (e) => {
      const before = e.target.selectionStart || 0;
      const oldVal = e.target.value;
      const newVal = autoSpaceLetters(oldVal);
      if (oldVal !== newVal) {
        e.target.value = newVal;
        const after = before + (newVal.length - oldVal.length);
        try { e.target.setSelectionRange(after, after); } catch (err) {}
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const spaced = autoSpaceLetters(pastedText);
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const oldVal = input.value;
      input.value = oldVal.substring(0, start) + spaced + oldVal.substring(end);
      const newPos = start + spaced.length;
      try { input.setSelectionRange(newPos, newPos); } catch (err) {}
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function initUI() {
    const toolButtonsHtml = Object.values(TOOLS).map(tool => `
      <button class="calc-tool-selector-btn ${tool.id === _currentTool ? 'active' : ''}"
              data-tool-id="${tool.id}"
              onclick="CalculationToolsController.switchTool('${tool.id}')">
        <div class="tool-selector-ico">${tool.icon}</div>
        <div class="tool-selector-name">${tool.title}</div>
        <div class="tool-selector-desc">${tool.desc}</div>
      </button>
    `).join('');

    const madakhelForm = `
      <div class="calc-tool-form-section" id="form-madakhel" style="display:block">
        <div class="sec-title" style="margin-bottom:12px">محاسبه‌گر مداخل</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">عدد کبیر، بلامرتبه، صغیر، تعداد حروف و نقاط را محاسبه کنید</p>
        <label>متن یا حروف را وارد کنید:</label>
        <textarea id="madakhel-input" class="calc-tool-textarea" placeholder="مثال: سامان یا س ا م ا ن"></textarea>
        <div class="validation-error" style="display:none" id="madakhel-error">لطفاً متن را وارد کنید</div>
        <button class="calc-btn" onclick="CalculationToolsController.runMadakhel()">✦ محاسبه ✦</button>
        <div id="madakhel-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">نتایج محاسبه</div>
          <div style="margin:10px 0"><span style="color:var(--gold-dim);font-size:12px">متن اصلی:</span> <span id="madakhel-original" style="color:var(--ink)"></span></div>
          <div style="margin:10px 0"><span style="color:var(--gold-dim);font-size:12px">متن استاندارد:</span> <span id="madakhel-standard" style="color:var(--ink)"></span></div>
          <table class="calc-tool-table" id="madakhel-table" style="margin:12px 0"></table>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;margin-top:12px">
            <div style="text-align:center;padding:10px;border:1px solid var(--border);border-radius:2px">
              <div style="font-size:11px;color:var(--gold-dim);margin-bottom:4px">عدد کبیر</div>
              <div style="font-size:18px;color:var(--gold);font-weight:600" id="madakhel-kabir">0</div>
            </div>
            <div style="text-align:center;padding:10px;border:1px solid var(--border);border-radius:2px">
              <div style="font-size:11px;color:var(--gold-dim);margin-bottom:4px">بلامرتبه</div>
              <div style="font-size:18px;color:var(--gold);font-weight:600" id="madakhel-bala">0</div>
            </div>
            <div style="text-align:center;padding:10px;border:1px solid var(--border);border-radius:2px">
              <div style="font-size:11px;color:var(--gold-dim);margin-bottom:4px">صغیر</div>
              <div style="font-size:18px;color:var(--gold);font-weight:600" id="madakhel-saghir">0</div>
            </div>
            <div style="text-align:center;padding:10px;border:1px solid var(--border);border-radius:2px">
              <div style="font-size:11px;color:var(--gold-dim);margin-bottom:4px">تعداد حروف</div>
              <div style="font-size:18px;color:var(--gold);font-weight:600" id="madakhel-count">0</div>
            </div>
            <div style="text-align:center;padding:10px;border:1px solid var(--border);border-radius:2px">
              <div style="font-size:11px;color:var(--gold-dim);margin-bottom:4px">تعداد نقاط</div>
              <div style="font-size:18px;color:var(--gold);font-weight:600" id="madakhel-dots">0</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const orderForm = `
      <div class="calc-tool-form-section" id="form-order" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">ترتیب‌دهی بر اساس دایره دلخواه</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">حروف ورودی را بر اساس ترتیب دایره مرجع مرتب کنید</p>
        <label>دایره مرجع:</label>
        <textarea id="order-circle" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه و..."></textarea>
        <label style="margin-top:12px">رشته ورودی:</label>
        <textarea id="order-input" class="calc-tool-textarea" placeholder="مثال: د ا ب ا"></textarea>
        <label style="margin-top:12px">حروف خارج از دایره:</label>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="order-mode" value="error" checked> خطا (متوقف)</label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="order-mode" value="keep"> نگاه داشته شود</label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="order-mode" value="remove"> حذف</label>
        </div>
        <div class="validation-error" style="display:none" id="order-error"></div>
        <button class="calc-btn" onclick="CalculationToolsController.runOrder()">✦ ترتیب دهی ✦</button>
        <div id="order-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">نتیجه نهایی</div>
          <div style="background:var(--panel);border:1px solid var(--border);padding:12px;border-radius:2px;margin-bottom:12px;direction:rtl;text-align:right;letter-spacing:.1em;color:var(--gold)">
            <div id="order-final">—</div>
          </div>
          <table class="calc-tool-table" id="order-table"></table>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const rotationForm = `
      <div class="calc-tool-form-section" id="form-rotation" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">گردش دایره‌ای</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">رشته را در دایره مرجع با ترقی یا تنزل چرخاندید</p>
        <label>دایره مرجع:</label>
        <textarea id="rotation-circle" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه و..."></textarea>
        <label style="margin-top:12px">رشته ورودی:</label>
        <textarea id="rotation-input" class="calc-tool-textarea" placeholder="مثال: د ا ب"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
          <div>
            <label>جهت:</label>
            <select id="rotation-dir" style="width:100%">
              <option value="up">رو به جلو</option>
              <option value="down">رو به عقب</option>
            </select>
          </div>
          <div>
            <label>تعداد سطرها:</label>
            <input type="number" id="rotation-steps" value="28" min="1" max="1000" style="width:100%">
          </div>
        </div>
        <label style="margin-top:12px">حروف خارج از دایره:</label>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="rotation-oob" value="error" checked> خطا (متوقف)</label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="rotation-oob" value="fixed"> ثابت</label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="rotation-oob" value="remove"> حذف</label>
        </div>
        <div class="validation-error" style="display:none" id="rotation-error"></div>
        <button class="calc-btn" onclick="CalculationToolsController.runRotation()">✦ اجرای گردش ✦</button>
        <div id="rotation-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">سطرهای گردش</div>
          <div id="rotation-rows" style="font-family:Amiri,serif;line-height:2;direction:rtl"></div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const taksirSadrForm = `
      <div class="calc-tool-form-section" id="form-taksir_sadr" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">تکسیر صدر و مؤخر</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">الگو: اول، آخر، دوم، یکی‌مانده‌به‌آخر، ... تا بازگشت به سطر اولیه</p>
        <label>رشته حروف:</label>
        <textarea id="taksir-sadr-input" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه"></textarea>
        <div class="validation-error" style="display:none" id="taksir-sadr-error">حروفی را وارد کنید</div>
        <button class="calc-btn" onclick="CalculationToolsController.runTaksirSadr()">✦ اجرای تکسیر ✦</button>
        <div id="taksir-sadr-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">سطرهای تکسیر</div>
          <div style="margin-bottom:12px"><span style="color:var(--gold-dim);font-size:12px">تعداد سطرها:</span> <span id="taksir-sadr-cycle" style="color:var(--gold);font-weight:600">0</span></div>
          <div id="taksir-sadr-rows" style="font-family:Amiri,serif;line-height:2;direction:rtl"></div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const taksirMoakharForm = `
      <div class="calc-tool-form-section" id="form-taksir_moakhar" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">تکسیر مؤخر و صدر</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">الگو: آخر، اول، یکی‌مانده‌به‌آخر، دوم، ... تا بازگشت به سطر اولیه</p>
        <label>رشته حروف:</label>
        <textarea id="taksir-moakhar-input" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه"></textarea>
        <div class="validation-error" style="display:none" id="taksir-moakhar-error">حروفی را وارد کنید</div>
        <button class="calc-btn" onclick="CalculationToolsController.runTaksirMoakhar()">✦ اجرای تکسیر ✦</button>
        <div id="taksir-moakhar-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">سطرهای تکسیر</div>
          <div style="margin-bottom:12px"><span style="color:var(--gold-dim);font-size:12px">تعداد سطرها:</span> <span id="taksir-moakhar-cycle" style="color:var(--gold);font-weight:600">0</span></div>
          <div id="taksir-moakhar-rows" style="font-family:Amiri,serif;line-height:2;direction:rtl"></div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const laqtCircularForm = `
      <div class="calc-tool-form-section" id="form-laqt_circular" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">لقط متصل</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">شمارش منفصل دایره‌ای: حذف هر Nامین حرف از دنباله دایره‌ای</p>
        <label>رشته حروف:</label>
        <textarea id="laqt-circular-input" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
          <div>
            <label>عدد شمارش:</label>
            <input type="number" id="laqt-circular-count" value="3" min="1" style="width:100%">
          </div>
          <div>
            <label>شروع از:</label>
            <input type="number" id="laqt-circular-start" value="1" min="1" style="width:100%">
          </div>
        </div>
        <div class="validation-error" style="display:none" id="laqt-circular-error"></div>
        <button class="calc-btn" onclick="CalculationToolsController.runLaqtCircular()">✦ اجرای شمارش ✦</button>
        <div id="laqt-circular-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">نتیجه نهایی</div>
          <div style="background:var(--panel);border:1px solid var(--border);padding:12px;border-radius:2px;margin-bottom:12px;direction:rtl;text-align:right;letter-spacing:.1em;color:var(--gold)">
            <div id="laqt-circular-final">—</div>
          </div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">مراحل استخراج</div>
          <div id="laqt-circular-steps" style="max-height:500px;overflow-y:auto"></div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    const laqtLinearForm = `
      <div class="calc-tool-form-section" id="form-laqt_linear" style="display:none">
        <div class="sec-title" style="margin-bottom:12px">لقط منقطع</div>
        <p style="font-size:13px;color:var(--ink-dim);margin-bottom:12px">شمارش منفصل خطی: انتخاب هر Nامین حرف از دنباله خطی</p>
        <label>رشته حروف:</label>
        <textarea id="laqt-linear-input" class="calc-tool-textarea" placeholder="مثال: ا ب ج د ه"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
          <div>
            <label>عدد شمارش:</label>
            <input type="number" id="laqt-linear-count" value="3" min="1" style="width:100%">
          </div>
          <div>
            <label>شروع از:</label>
            <input type="number" id="laqt-linear-start" value="1" min="1" style="width:100%">
          </div>
        </div>
        <label style="margin-top:12px">جهت:</label>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="laqt-linear-dir" value="rtl" checked> راست به چپ (پیش‌فرض)</label>
          <label style="flex:1;display:flex;align-items:center;gap:6px;margin:0"><input type="radio" name="laqt-linear-dir" value="ltr"> چپ به راست</label>
        </div>
        <div class="validation-error" style="display:none" id="laqt-linear-error"></div>
        <button class="calc-btn" onclick="CalculationToolsController.runLaqtLinear()">✦ اجرای شمارش ✦</button>
        <div id="laqt-linear-results" style="display:none;margin-top:20px">
          <div class="divider"><span>✦</span></div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">نتیجه نهایی</div>
          <div style="background:var(--panel);border:1px solid var(--border);padding:12px;border-radius:2px;margin-bottom:12px;direction:rtl;text-align:right;letter-spacing:.1em;color:var(--gold)">
            <div id="laqt-linear-final">—</div>
          </div>
          <div class="sec-title" style="margin-bottom:12px;margin-top:16px">مراحل استخراج</div>
          <table class="calc-tool-table" id="laqt-linear-table"></table>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="tool-btn" onclick="CalculationToolsController.saveToHistory()" style="flex:1">💾 ذخیره در تاریخچه</button>
          </div>
        </div>
      </div>
    `;

    return `
<div class="calculation-tools-wrapper calc-tools-container">
  <!-- Tool Selector (like Mostahsela mode selector) -->
  <div class="card calc-tools-selector-card">
    <div class="sec-title" style="margin-bottom:16px">ابزار را انتخاب کنید</div>
    <div class="calc-tools-selector-grid">${toolButtonsHtml}</div>
  </div>

  <!-- Selected Tool Form Card -->
  <div class="card calc-tool-input-card">
    ${madakhelForm}
    ${orderForm}
    ${rotationForm}
    ${taksirSadrForm}
    ${taksirMoakharForm}
    ${laqtCircularForm}
    ${laqtLinearForm}
  </div>
</div>`;
  }

  function switchTool(toolId) {
    if (!TOOLS[toolId]) return;
    _currentTool = toolId;

    // Update tool selector buttons
    document.querySelectorAll('.calc-tool-selector-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.toolId === toolId);
    });

    // Update form sections
    document.querySelectorAll('.calc-tool-form-section').forEach(section => {
      section.style.display = section.id === `form-${toolId}` ? 'block' : 'none';
    });

    // Reset results for new tool
    document.querySelectorAll('[id$="-results"]').forEach(el => {
      el.style.display = 'none';
    });
  }

  function runMadakhel() {
    const input = document.getElementById('madakhel-input').value;
    const result = CalculationToolMadakhel.calculate(input);

    const errorEl = document.getElementById('madakhel-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'madakhel', result };

    document.getElementById('madakhel-original').textContent = result.original;
    document.getElementById('madakhel-standard').textContent = result.standardized.join(' ');
    document.getElementById('madakhel-kabir').textContent = U.toPersianDigits(result.kabir);
    document.getElementById('madakhel-bala').textContent = U.toPersianDigits(result.bala);
    document.getElementById('madakhel-saghir').textContent = U.toPersianDigits(result.saghir);
    document.getElementById('madakhel-count').textContent = U.toPersianDigits(result.count);
    document.getElementById('madakhel-dots').textContent = U.toPersianDigits(result.dots);

    let html = '<tr><th>اصلی</th><th>استاندارد</th><th>کبیر</th><th>بلامرتبه</th><th>نقطه</th></tr>';
    result.table.forEach(row => {
      html += `<tr><td class="col-letter">${row.original}</td><td class="col-letter">${row.standard}</td><td>${U.toPersianDigits(row.kabir)}</td><td>${U.toPersianDigits(row.bala)}</td><td>${U.toPersianDigits(row.dots)}</td></tr>`;
    });
    document.getElementById('madakhel-table').innerHTML = html;

    document.getElementById('madakhel-results').style.display = 'block';
  }

  function runOrder() {
    const circle = document.getElementById('order-circle').value;
    const input = document.getElementById('order-input').value;
    const mode = document.querySelector('input[name="order-mode"]:checked')?.value || 'error';

    const result = CalculationToolOrder.calculate(input, circle, mode);

    const errorEl = document.getElementById('order-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'order', result };

    document.getElementById('order-final').textContent = result.output.join(' ');

    let html = '<tr><th>حرف</th><th>جایگاه در دایره</th><th>تعداد در رشته</th></tr>';
    result.table.forEach(row => {
      html += `<tr><td class="col-letter">${row.letter}</td><td>${U.toPersianDigits(row.position)}</td><td>${U.toPersianDigits(row.count)}</td></tr>`;
    });
    document.getElementById('order-table').innerHTML = html;

    document.getElementById('order-results').style.display = 'block';
  }

  function runRotation() {
    const circle = document.getElementById('rotation-circle').value;
    const input = document.getElementById('rotation-input').value;
    const dir = document.getElementById('rotation-dir').value;
    const steps = parseInt(document.getElementById('rotation-steps').value) || 28;
    const oobMode = document.querySelector('input[name="rotation-oob"]:checked')?.value || 'error';

    const result = CalculationToolRotation.calculate(input, circle, dir, steps, oobMode);

    const errorEl = document.getElementById('rotation-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'rotation', result };

    let html = '';
    result.rows.forEach((row, i) => {
      const isFirst = i === 0;
      html += `<div class="row-line ${isFirst ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row.join(' ')}</span></div>`;
    });
    document.getElementById('rotation-rows').innerHTML = html;

    document.getElementById('rotation-results').style.display = 'block';
  }

  function runTaksirSadr() {
    const input = document.getElementById('taksir-sadr-input').value;
    const result = CalculationToolTaksirSadr.calculate(input);

    const errorEl = document.getElementById('taksir-sadr-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'taksir_sadr', result };

    document.getElementById('taksir-sadr-cycle').textContent = U.toPersianDigits(result.cycleCount);

    let html = '';
    result.rows.forEach((row, i) => {
      const isFirst = i === 0;
      const isLast = i === result.rows.length - 1;
      html += `<div class="row-line ${isFirst || isLast ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row}</span></div>`;
    });
    document.getElementById('taksir-sadr-rows').innerHTML = html;

    document.getElementById('taksir-sadr-results').style.display = 'block';
  }

  function runTaksirMoakhar() {
    const input = document.getElementById('taksir-moakhar-input').value;
    const result = CalculationToolTaksirMoakhar.calculate(input);

    const errorEl = document.getElementById('taksir-moakhar-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'taksir_moakhar', result };

    document.getElementById('taksir-moakhar-cycle').textContent = U.toPersianDigits(result.cycleCount);

    let html = '';
    result.rows.forEach((row, i) => {
      const isFirst = i === 0;
      const isLast = i === result.rows.length - 1;
      html += `<div class="row-line ${isFirst || isLast ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row}</span></div>`;
    });
    document.getElementById('taksir-moakhar-rows').innerHTML = html;

    document.getElementById('taksir-moakhar-results').style.display = 'block';
  }

  function runLaqtCircular() {
    const input = document.getElementById('laqt-circular-input').value;
    const count = document.getElementById('laqt-circular-count').value;
    const start = document.getElementById('laqt-circular-start').value;

    const result = CalculationToolLaqtCircular.calculate(input, count, start);

    const errorEl = document.getElementById('laqt-circular-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'laqt_circular', result };

    document.getElementById('laqt-circular-final').textContent = result.output.join(' ');

    let html = '';
    result.steps.forEach((step, idx) => {
      html += `<div class="step-entry" style="margin-bottom:12px;padding:10px;border:1px solid var(--border);border-radius:2px">
        <div style="margin-bottom:8px"><span style="color:var(--gold-dim);font-size:12px">مرحله ${U.toPersianDigits(step.stepNum)}</span></div>
        <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">سطر قبل:</span> <span style="color:var(--ink)">${step.before.join(' ')}</span></div>
        <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">شروع از:</span> <span style="color:var(--ink)">${step.startLetter}</span></div>
        <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">مسیر:</span> <span style="color:var(--ink)">${step.countPath.join(' ← ')}</span></div>
        <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">انتخاب:</span> <span style="color:var(--gold);font-weight:600">${step.selected}</span></div>
        <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">خروجی:</span> <span style="color:var(--ink)">${step.output.join(' ')}</span></div>
      </div>`;
    });
    document.getElementById('laqt-circular-steps').innerHTML = html;

    document.getElementById('laqt-circular-results').style.display = 'block';
  }

  function runLaqtLinear() {
    const input = document.getElementById('laqt-linear-input').value;
    const count = document.getElementById('laqt-linear-count').value;
    const start = document.getElementById('laqt-linear-start').value;
    const dir = document.querySelector('input[name="laqt-linear-dir"]:checked')?.value || 'rtl';

    const result = CalculationToolLaqtLinear.calculate(input, count, start, dir);

    const errorEl = document.getElementById('laqt-linear-error');
    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    _lastResult = { tool: 'laqt_linear', result };

    document.getElementById('laqt-linear-final').textContent = result.output.join(' ');

    let html = '<tr><th>مرحله</th><th>شماره حرف</th><th>حرف</th></tr>';
    result.steps.forEach((step, idx) => {
      html += `<tr><td>${U.toPersianDigits(idx + 1)}</td><td>${U.toPersianDigits(step.pos)}</td><td class="col-letter">${step.letter}</td></tr>`;
    });
    document.getElementById('laqt-linear-table').innerHTML = html;

    document.getElementById('laqt-linear-results').style.display = 'block';
  }

  function saveToHistory() {
    if (!_lastResult) {
      Toast.show('ابتدا محاسبه را انجام دهید');
      return;
    }
    const tool = _lastResult.tool;
    const result = _lastResult.result;
    const toolInfo = TOOLS[tool] || { title: tool };

    // Build normalized history record
    const historyRecord = {
      id: Date.now(),
      type: 'calculation-tool',
      title: `ابزار: ${toolInfo.title}`,
      createdAt: new Date().toISOString(),
      input: getToolInputSummary(tool, result),
      output: getToolOutputSummary(tool, result),
      note: '',
      meta: { toolId: tool, toolName: toolInfo.title },
      payload: {
        tool: tool,
        toolName: toolInfo.title,
        input: getToolInputSummary(tool, result),
        inputSummary: getToolInputSummary(tool, result),
        output: getToolOutputSummary(tool, result),
        outputSummary: getToolOutputSummary(tool, result),
        result: result
      }
    };

    History.push(historyRecord);
    Toast.show('در تاریخچه ذخیره شد ✓');
  }

  function getToolInputSummary(tool, result) {
    if (!result) return '';
    switch(tool) {
      case 'madakhel': return result.original || '';
      case 'order': return result.original || '';
      case 'rotation': return result.original || '';
      case 'taksir_sadr': return result.original || '';
      case 'taksir_moakhar': return result.original || '';
      case 'laqt_circular': return result.original || '';
      case 'laqt_linear': return result.original || '';
      default: return '';
    }
  }

  function getToolOutputSummary(tool, result) {
    if (!result) return '';
    switch(tool) {
      case 'madakhel': return result.kabir + ' · ' + result.bala;
      case 'order': return result.output.slice(0, 5).join(' ') + (result.output.length > 5 ? '...' : '');
      case 'rotation': return result.rows[0]?.join(' ') || '';
      case 'taksir_sadr': return result.rows[result.rows.length-1] || '';
      case 'taksir_moakhar': return result.rows[result.rows.length-1] || '';
      case 'laqt_circular': return result.output.join(' ');
      case 'laqt_linear': return result.output.join(' ');
      default: return '';
    }
  }

  function restoreResult(payload) {
    if (!payload || !payload.tool) return;
    const tool = payload.tool;
    const result = payload.result;

    if (!result) return;

    // Switch to tool if not already there
    if (_currentTool !== tool) switchTool(tool);

    // Restore tool-specific UI based on result
    switch(tool) {
      case 'madakhel':
        document.getElementById('madakhel-original').textContent = result.original;
        document.getElementById('madakhel-standard').textContent = result.standardized.join(' ');
        document.getElementById('madakhel-kabir').textContent = U.toPersianDigits(result.kabir);
        document.getElementById('madakhel-bala').textContent = U.toPersianDigits(result.bala);
        document.getElementById('madakhel-saghir').textContent = U.toPersianDigits(result.saghir);
        document.getElementById('madakhel-count').textContent = U.toPersianDigits(result.count);
        document.getElementById('madakhel-dots').textContent = U.toPersianDigits(result.dots);

        let html = '<tr><th>اصلی</th><th>استاندارد</th><th>کبیر</th><th>بلامرتبه</th><th>نقطه</th></tr>';
        result.table.forEach(row => {
          html += `<tr><td class="col-letter">${row.original}</td><td class="col-letter">${row.standard}</td><td>${U.toPersianDigits(row.kabir)}</td><td>${U.toPersianDigits(row.bala)}</td><td>${U.toPersianDigits(row.dots)}</td></tr>`;
        });
        document.getElementById('madakhel-table').innerHTML = html;
        document.getElementById('madakhel-results').style.display = 'block';
        break;

      case 'order':
        document.getElementById('order-final').textContent = result.output.join(' ');
        html = '<tr><th>حرف</th><th>جایگاه در دایره</th><th>تعداد در رشته</th></tr>';
        result.table.forEach(row => {
          html += `<tr><td class="col-letter">${row.letter}</td><td>${U.toPersianDigits(row.position)}</td><td>${U.toPersianDigits(row.count)}</td></tr>`;
        });
        document.getElementById('order-table').innerHTML = html;
        document.getElementById('order-results').style.display = 'block';
        break;

      case 'rotation':
        html = '';
        result.rows.forEach((row, i) => {
          const isFirst = i === 0;
          html += `<div class="row-line ${isFirst ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row.join(' ')}</span></div>`;
        });
        document.getElementById('rotation-rows').innerHTML = html;
        document.getElementById('rotation-results').style.display = 'block';
        break;

      case 'taksir_sadr':
        document.getElementById('taksir-sadr-cycle').textContent = U.toPersianDigits(result.cycleCount);
        html = '';
        result.rows.forEach((row, i) => {
          const isFirst = i === 0;
          const isLast = i === result.rows.length - 1;
          html += `<div class="row-line ${isFirst || isLast ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row}</span></div>`;
        });
        document.getElementById('taksir-sadr-rows').innerHTML = html;
        document.getElementById('taksir-sadr-results').style.display = 'block';
        break;

      case 'taksir_moakhar':
        document.getElementById('taksir-moakhar-cycle').textContent = U.toPersianDigits(result.cycleCount);
        html = '';
        result.rows.forEach((row, i) => {
          const isFirst = i === 0;
          const isLast = i === result.rows.length - 1;
          html += `<div class="row-line ${isFirst || isLast ? 'highlight' : ''}"><span class="row-idx">سطر ${U.toPersianDigits(i)}</span><span class="row-letters">${row}</span></div>`;
        });
        document.getElementById('taksir-moakhar-rows').innerHTML = html;
        document.getElementById('taksir-moakhar-results').style.display = 'block';
        break;

      case 'laqt_circular':
        document.getElementById('laqt-circular-final').textContent = result.output.join(' ');
        html = '';
        result.steps.forEach((step, idx) => {
          html += `<div class="step-entry" style="margin-bottom:12px;padding:10px;border:1px solid var(--border);border-radius:2px">
            <div style="margin-bottom:8px"><span style="color:var(--gold-dim);font-size:12px">مرحله ${U.toPersianDigits(step.stepNum)}</span></div>
            <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">سطر قبل:</span> <span style="color:var(--ink)">${step.before.join(' ')}</span></div>
            <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">شروع از:</span> <span style="color:var(--ink)">${step.startLetter}</span></div>
            <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">مسیر:</span> <span style="color:var(--ink)">${step.countPath.join(' ← ')}</span></div>
            <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">انتخاب:</span> <span style="color:var(--gold);font-weight:600">${step.selected}</span></div>
            <div style="margin:4px 0"><span style="color:var(--ink-dim);font-size:11px">خروجی:</span> <span style="color:var(--ink)">${step.output.join(' ')}</span></div>
          </div>`;
        });
        document.getElementById('laqt-circular-steps').innerHTML = html;
        document.getElementById('laqt-circular-results').style.display = 'block';
        break;

      case 'laqt_linear':
        document.getElementById('laqt-linear-final').textContent = result.output.join(' ');
        html = '<tr><th>مرحله</th><th>شماره حرف</th><th>حرف</th></tr>';
        result.steps.forEach((step, idx) => {
          html += `<tr><td>${U.toPersianDigits(idx + 1)}</td><td>${U.toPersianDigits(step.pos)}</td><td class="col-letter">${step.letter}</td></tr>`;
        });
        document.getElementById('laqt-linear-table').innerHTML = html;
        document.getElementById('laqt-linear-results').style.display = 'block';
        break;
    }
  }

  function init() {
    // Attach auto-spacing to letter inputs
    const letterInputs = ['madakhel-input', 'order-circle', 'order-input', 'rotation-circle', 'rotation-input',
      'taksir-sadr-input', 'taksir-moakhar-input', 'laqt-circular-input', 'laqt-linear-input'];
    letterInputs.forEach(id => attachAutoSpacing(id));
  }

  return {
    initUI,
    init,
    switchTool,
    runMadakhel,
    runOrder,
    runRotation,
    runTaksirSadr,
    runTaksirMoakhar,
    runLaqtCircular,
    runLaqtLinear,
    saveToHistory,
    restoreResult
  };
})();
