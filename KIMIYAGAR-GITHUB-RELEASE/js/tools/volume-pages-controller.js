
"use strict";

/* ═══════════════════════════════════════════════════
   tools/volume-pages-controller.js — تفکیک صفحات ابزار به جلد اول/دوم
   فقط مسئول UI و اتصال Controllerها؛ بدون منطق محاسباتی
   ═══════════════════════════════════════════════════ */

const VolumePagesController = (() => {
  const state = { mostahsela: 1, tools: 1 };
  const mounted = { mostahsela: false, tools: false };

  function shell(kind, label) {
    return `
      <section class="volume-page-shell" data-volume-page="${kind}">
        <div class="volume-page-intro">
          <div class="sec-title">${label}</div>
          <p class="small">جلد موردنظر را انتخاب کنید. تغییر جلد، رفتار و داده‌های جلد دیگر را بازنویسی نمی‌کند.</p>
        </div>
        <div class="volume-switcher" role="tablist" aria-label="انتخاب جلد ${label}">
          <button type="button" class="volume-switch-btn active" data-volume-kind="${kind}" data-volume="1" role="tab" aria-selected="true">جلد اول</button>
          <button type="button" class="volume-switch-btn" data-volume-kind="${kind}" data-volume="2" role="tab" aria-selected="false">جلد دوم</button>
        </div>
        <div class="volume-panel" id="${kind}VolumeHost" role="tabpanel"></div>
      </section>`;
  }

  function setButtons(kind, volume) {
    document.querySelectorAll(`[data-volume-kind="${kind}"]`).forEach((button) => {
      const active = Number(button.dataset.volume) === volume;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
  }

  function renderMostahsela(volume) {
    const host = document.getElementById('mostahselaVolumeHost');
    if (!host) return;
    state.mostahsela = volume;
    setButtons('mostahsela', volume);
    if (volume === 2) {
      host.innerHTML = MostahselaV2ToolController.initUI();
      MostahselaV2ToolController.init();
    } else {
      host.innerHTML = MostahselaToolController.initUI();
      MostahselaToolController.init();
    }
  }

  function renderTools(volume) {
    const host = document.getElementById('toolsVolumeHost');
    if (!host) return;
    state.tools = volume;
    setButtons('tools', volume);
    if (volume === 2) {
      host.innerHTML = CalculationToolsV2Controller.initUI();
      CalculationToolsV2Controller.init();
    } else {
      host.innerHTML = CalculationToolsController.initUI();
      CalculationToolsController.init();
    }
  }

  function bindSwitcher(container, kind) {
    container.addEventListener('click', (event) => {
      const button = event.target.closest(`[data-volume-kind="${kind}"]`);
      if (!button) return;
      const volume = Number(button.dataset.volume);
      if (kind === 'mostahsela') renderMostahsela(volume);
      else renderTools(volume);
    });
    container.addEventListener('keydown', (event) => {
      const button = event.target.closest(`[data-volume-kind="${kind}"]`);
      if (!button || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const volume = Number(button.dataset.volume) === 1 ? 2 : 1;
      if (kind === 'mostahsela') renderMostahsela(volume);
      else renderTools(volume);
      container.querySelector(`[data-volume-kind="${kind}"][data-volume="${volume}"]`)?.focus();
    });
  }

  function mountMostahsela(container) {
    if (!container) return;
    container.innerHTML = shell('mostahsela', 'محاسبه مستحصله');
    bindSwitcher(container, 'mostahsela');
    mounted.mostahsela = true;
    renderMostahsela(state.mostahsela);
  }

  function mountTools(container) {
    if (!container) return;
    container.innerHTML = shell('tools', 'ابزار محاسبه');
    bindSwitcher(container, 'tools');
    mounted.tools = true;
    renderTools(state.tools);
  }

  function activateMostahsela(volume = 1) {
    if (!mounted.mostahsela) mountMostahsela(document.getElementById('mostahselaPageBody'));
    renderMostahsela(Number(volume) === 2 ? 2 : 1);
  }

  function activateTools(volume = 1) {
    if (!mounted.tools) mountTools(document.getElementById('calculationToolsPageBody'));
    renderTools(Number(volume) === 2 ? 2 : 1);
  }

  function getCurrentVolume(kind) {
    return state[kind] || 1;
  }

  return { mountMostahsela, mountTools, activateMostahsela, activateTools, getCurrentVolume };
})();

