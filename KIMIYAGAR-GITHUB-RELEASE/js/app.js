"use strict";

/* ═══════════════════════════════════════════════════
   app.js — هسته مرکزی، calculate، routing
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: همه ماژول‌ها
   ═══════════════════════════════════════════════════ */

const App = (() => {
  let _currentMethod = '1x1';   // id روش فعال
  let _lastResult = null;

  const METHOD_TITLES = {
    '1x1': 'استخراج با امتزاج حروف سه‌گانه',
    '1x2': 'استخراج با حروف سه‌گانه از مداخل',
    '1x3': 'استخراج با تکسیر استنطاقات',
  };
  const METHOD_RUNNERS = {
    '1x1': Method1.run,
    '1x2': Method2.run,
    '1x3': Method3.run,
  };

  function updateMethodUI(methodId) {
    const m = Registry.getMethod(methodId);
    if (!m) return;
    document.getElementById('methodBadgeText').textContent = `روش ${m.code}`;
    document.getElementById('appSubtitle').textContent = METHOD_TITLES[methodId] || '';
  }

  function setCurrentMethod(id) {
    _currentMethod = id;
    updateMethodUI(id);
  }

  function getCurrentMethod() { return _currentMethod; }

  function setLastResult(r) { _lastResult = r; }

  function goHome() {
    document.getElementById('appSection').style.display = 'none';
    document.getElementById('startScreen').style.display = '';
    document.getElementById('appBottomNav').style.display = 'none';
    ['toolsPage','historyPage','faqPage','contactPage','questionRulesPage','mostahselaPage','calculationToolsPage'].forEach(id => Pages.close(id));
    document.getElementById('notesModal').classList.remove('show');
    document.getElementById('aboutModal').classList.remove('show');
  }

  function calculate() {
    try {
      const q = Core.normalizeText(document.getElementById('question').value);
      const y = parseInt(document.getElementById('year').value);
      const m = document.getElementById('month').value;
      if (!q) { alert('لطفاً سوال را وارد کنید.'); return; }
      if (isNaN(y) || y < 1300 || y > 1600) { alert('سال معتبر وارد کنید.'); return; }
      const now = new Date();
      const j = Core.toJalali(now.getFullYear(), now.getMonth()+1, now.getDate());
      const h = now.getHours(), min = now.getMinutes();
      Steps.reset();
      document.getElementById('results').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('progressBar').style.display = 'block';
      Steps.setProgress(0);
      setTimeout(() => {
        try {
          const runner = METHOD_RUNNERS[_currentMethod];
          if (!runner) { Toast.show('این روش هنوز پیاده‌سازی نشده'); return; }
          const result = runner(q, y, m, j.jd, h, min);
          if (!result) { document.getElementById('spinner').style.display='none'; return; }
          const { finalLetters, reading, full } = result;
          UI.renderSquares(finalLetters);
          document.getElementById('finalReading').textContent = reading || '—';
          document.getElementById('finalNote').innerHTML =
            `تعداد حروف مستحصله: <b style="color:var(--gold)">${finalLetters.length}</b>`;
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('results').style.display = 'block';
          _lastResult = {
            id: Date.now(),
            type: 'method',
            method: _currentMethod,
            title: `روش ${_currentMethod}`,
            createdAt: new Date().toISOString(),
            input: q,
            output: reading || '—',
            note: '',
            meta: { year:y, month:m, day:j.jd, hour:h, minute:min },
            payload: {
              method: _currentMethod,
              question: q,
              fullText: full,
              reading: reading || '—',
              letters: finalLetters,
              stepsHTML: Steps.getHTML(),
              squareColors: {}
            }
          };
          History.render();
          setTimeout(() => document.getElementById('results').scrollIntoView({ behavior:'smooth' }), 120);
        } catch(err) {
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('progressBar').style.display = 'none';
          Toast.show('خطا در محاسبه');
          console.error(err);
        }
      }, 80);
    } catch(err) { Toast.show('خطا در شروع محاسبه'); console.error(err); }
  }

  function saveResult() {
    if (!_lastResult) { Toast.show('ابتدا نتیجه استخراج کنید'); return; }
    _lastResult.note = document.getElementById('resultNote').value.trim();
    _lastResult.stepsHTML = Steps.getHTML();
    _lastResult.squareColors = UI.getSquareColors();
    History.push(_lastResult);
    Toast.show('نتیجه ذخیره شد');
  }

  function saveNote() {
    if (!_lastResult) { Toast.show('ابتدا نتیجه استخراج کنید'); return; }
    _lastResult.note = document.getElementById('resultNote').value.trim();
    History.updateItem(_lastResult.id, {
      note: _lastResult.note,
      stepsHTML: Steps.getHTML(),
      squareColors: UI.getSquareColors()
    });
    Toast.show('یادداشت ذخیره شد');
  }

  function saveColors() {
    if (!_lastResult) { Toast.show('ابتدا نتیجه استخراج کنید'); return; }
    const colors = UI.getSquareColors();
    _lastResult.squareColors = colors;
    History.updateItem(_lastResult.id, { squareColors: colors });
    Toast.show('رنگ‌های کادر ذخیره شدند');
  }

  function getLastResult() { return _lastResult; }

  return { calculate, goHome, setCurrentMethod, getCurrentMethod, setLastResult, getLastResult, saveResult, saveNote, saveColors };
})();


(function boot() {
  /* ── Build UI from registry ── */
  Render.buildMethodGrids();

  /* ── Method card click ── */
  document.getElementById('methodGridV1').addEventListener('click', e => {
    const card = e.target.closest('[data-method-id]');
    if (!card) return;
    const id = card.dataset.methodId;
    const m = Registry.getMethod(id);
    if (!m || !m.enabled) return;
    App.setCurrentMethod(id);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    document.getElementById('appBottomNav').style.display = 'flex';
    Toast.show(`روش ${m.code} فعال شد`);
  });
  document.getElementById('methodGridV2').addEventListener('click', e => {
    const card = e.target.closest('[data-method-id]');
    if (!card) return;
    const id = card.dataset.methodId;
    const m = Registry.getMethod(id);
    if (!m || !m.enabled) return;
    App.setCurrentMethod(id);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    document.getElementById('appBottomNav').style.display = 'flex';
    Toast.show(`روش ${m.code} فعال شد`);
  });

  /* ── Tool card click handlers ── */
  function handleToolClick(e) {
    const card = e.target.closest('[data-tool-id]');
    if (!card) return;
    const toolId = card.dataset.toolId;
    const tool = Registry.tools.find(t => t.id === toolId);
    if (!tool || !tool.enabled) return;
    if (toolId === 'mostahsela') {
      VolumePagesController.activateMostahsela(1);
      Pages.open('mostahselaPage');
      Toast.show('محاسبه مستحصله');
    } else if (toolId === 'toolset') {
      VolumePagesController.activateTools(1);
      Pages.open('calculationToolsPage');
      Toast.show('ابزار محاسبه');
    }
  }
  const toolsGridHome = document.getElementById('toolsGridHome');
  if (toolsGridHome) toolsGridHome.addEventListener('click', handleToolClick);
  const toolsGridPage = document.getElementById('toolsGridPage');
  if (toolsGridPage) toolsGridPage.addEventListener('click', handleToolClick);

  /* ── Volume-aware tool pages ── */
  VolumePagesController.mountMostahsela(document.getElementById('mostahselaPageBody'));
  VolumePagesController.mountTools(document.getElementById('calculationToolsPageBody'));

  /* ── Menu ── */
  document.getElementById('hamburgerBtn').addEventListener('click', e => { e.stopPropagation(); Menu.toggle(); });
  document.getElementById('menuBackdrop').addEventListener('click', Menu.close);
  document.getElementById('sidebarCloseBtn').addEventListener('click', Menu.close);
  document.getElementById('sidebarOverlay').addEventListener('click', Menu.close);
  document.addEventListener('click', e => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('show') && !sidebar.contains(e.target) && !document.getElementById('hamburgerBtn').contains(e.target)) Menu.close();
  });

  /* ── Sidebar items ── */
  document.getElementById('toggleThemeItem').addEventListener('click', () => { Theme.toggle(); Menu.close(); });
  document.getElementById('homeItem').addEventListener('click', () => { App.goHome(); Menu.close(); Toast.show('صفحه اصلی'); });
  document.getElementById('toolsPageItem').addEventListener('click', () => { Pages.open('toolsPage'); Menu.close(); });
  document.getElementById('historyPageItem').addEventListener('click', () => { History.render(); Pages.open('historyPage'); Menu.close(); });
  document.getElementById('clearHistoryItem').addEventListener('click', () => { History.clearAll(); Menu.close(); });
  document.getElementById('notesItem').addEventListener('click', () => { History.renderNotes(); Pages.open('notesModal'); Menu.close(); });
  document.getElementById('aboutItem').addEventListener('click', () => { Pages.open('aboutModal'); Menu.close(); });
  document.getElementById('faqItem').addEventListener('click', () => { Pages.open('faqPage'); Menu.close(); });
  document.getElementById('contactItem').addEventListener('click', () => { Pages.open('contactPage'); Menu.close(); });

  /* ── Back buttons ── */
  document.getElementById('backFromToolsBtn').addEventListener('click', () => Pages.close('toolsPage'));
  document.getElementById('backFromToolsBtn2').addEventListener('click', () => Pages.close('toolsPage'));
  document.getElementById('backFromHistoryBtn').addEventListener('click', () => Pages.close('historyPage'));
  document.getElementById('backFromHistoryBtn2').addEventListener('click', () => Pages.close('historyPage'));
  document.getElementById('backFromFaqBtn').addEventListener('click', () => Pages.close('faqPage'));
  document.getElementById('backFromContactBtn').addEventListener('click', () => Pages.close('contactPage'));
  document.getElementById('backFromRulesBtn').addEventListener('click', () => Pages.close('questionRulesPage'));

  /* ── Modal close ── */
  document.getElementById('closeNotesBtn').addEventListener('click', () => Pages.close('notesModal'));
  document.getElementById('notesModal').addEventListener('click', e => { if (e.target.id === 'notesModal') Pages.close('notesModal'); });
  document.getElementById('closeAboutBtn').addEventListener('click', () => Pages.close('aboutModal'));
  document.getElementById('aboutModal').addEventListener('click', e => { if (e.target.id === 'aboutModal') Pages.close('aboutModal'); });

  /* ── About tabs ── */
  document.querySelectorAll('.about-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.about-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.about-section').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('about-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  /* ── Question Rules ── */
  document.getElementById('questionRulesBtn').addEventListener('click', () => Pages.open('questionRulesPage'));

  /* ── Result buttons ── */
  document.getElementById('saveColorsBtn').addEventListener('click', App.saveColors);
  document.getElementById('saveResultBtn').addEventListener('click', App.saveResult);
  document.getElementById('saveNoteBtn').addEventListener('click', App.saveNote);
  document.getElementById('copyBtn').addEventListener('click', () => Share.copyResult(App.getLastResult()));
  document.getElementById('shareBtn').addEventListener('click', () => Share.shareResult(App.getLastResult()));
  document.getElementById('resetAllColorsBtn').addEventListener('click', UI.resetAllColors);

  /* ── Question validation — no digits ── */
  document.getElementById('question').addEventListener('input', function() {
    const clean = this.value.replace(/[0-9۰-۹٠-٩]/g, '');
    if (clean !== this.value) { this.value = clean; Toast.show('در سوال باید اعداد را به حروف بنویسید'); }
  });

  /* ── Init date ── */
  const now = new Date();
  const j = Core.toJalali(now.getFullYear(), now.getMonth()+1, now.getDate());
  document.getElementById('year').value = j.jy;
  document.getElementById('month').value = Core.MONTH_NAMES[j.jm-1];

  /* ── Start modules ── */
  Theme.init();
  History.render();
  Clock.start();
  Canvas.init();

  /* ── PWA Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
