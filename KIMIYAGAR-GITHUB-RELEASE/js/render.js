"use strict";

/* ═══════════════════════════════════════════════════
   render.js — سازنده‌های HTML + مدیریت مراحل (Steps)
   کیمیاگری با حروف — نسخه ۱  (ماژولار)
   وابستگی: Core, Registry
   ═══════════════════════════════════════════════════ */

const Render = (() => {
  function chips(l) {
    if (!l || !l.length) return '<span class="small">—</span>';
    return '<div class="letter-row">'
      + l.map(ch => `<div class="letter-chip ${Core.letterType(ch)}"><span class="ch">${ch}</span></div>`).join('')
      + '</div>';
  }
  function chipsWithNum(l) {
    if (!l || !l.length) return '<span class="small">—</span>';
    return '<div class="letter-row">'
      + l.map((ch,i) => `<div class="letter-chip ${Core.letterType(ch)}"><span class="ch">${ch}</span><span class="tp">${i+1}</span></div>`).join('')
      + '</div>';
  }
  function chipsEmtezaj(m) {
    return '<div class="letter-row">'
      + m.map((x,i) => `<div class="letter-chip ${x.src}" style="${(i+1)%4===0?'border-color:var(--gold-dim)':''}"><span class="ch">${x.ch}</span><span class="tp">${i+1}</span></div>`).join('')
      + '</div>';
  }
  function chipsEmtehan(log) {
    return '<div class="letter-row">'
      + log.map(it => `<div class="letter-chip" style="border-bottom:2px solid ${it.kept?'#4a7a4a':'#7a2a2a'}" title="${it.reason}"><span class="ch">${it.ch}</span><span class="tp">${it.kept?'✓':'✗'}</span></div>`).join('')
      + '</div>';
  }

  /* tool card HTML */
  function toolCard(tool, idx) {
    const borderStyle = idx%2===0 ? 'border-left:none;' : '';

    // Active tool
    if (tool.enabled) {
      return `<div class="tool-card active-card" style="${borderStyle}" data-tool-id="${tool.id}">
        <div class="tool-card-ico">${tool.icon}</div>
        <div class="tool-card-name">${tool.name}</div>
        <div class="tool-card-desc">${tool.desc}</div>
      </div>`;
    }

    // Disabled tool (coming soon)
    const modelBadge = tool.model
      ? `<div style="margin-top:6px;display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border:1px solid rgba(201,168,76,.3);border-radius:3px;background:rgba(201,168,76,.06)">
           <span style="font-size:10px;color:var(--gold-dim)">مدل</span>
           <span style="font-size:11px;color:var(--gold);font-family:'Cinzel',serif">${tool.model.replace('.',`<span style="color:var(--gold-dim)">.</span>`)}</span>
         </div>` : '';
    return `<div class="tool-card tool-locked" style="${borderStyle}" data-tool-id="${tool.id}">
      <div class="tool-card-ico">${tool.icon}</div>
      <div class="tool-card-name">${tool.name}</div>
      <div class="tool-card-desc">${tool.desc}</div>
      ${modelBadge}
      <div style="margin-top:6px"><span class="badge">به‌زودی</span></div>
    </div>`;
  }

  /* Build start-screen grids from registry */
  function buildMethodGrids() {
    const g1 = document.getElementById('methodGridV1');
    const g2 = document.getElementById('methodGridV2');
    if (g1) g1.innerHTML = Registry.getMethodsByVolume(1).map(m => methodCard(m)).join('');
    if (g2) g2.innerHTML = Registry.getMethodsByVolume(2).map(m => methodCard(m)).join('');
    // tools on home
    const tg = document.getElementById('toolsGridHome');
    if (tg) tg.innerHTML = Registry.tools.map((t,i) => toolCard(t,i)).join('');
    // tools page
    const tp = document.getElementById('toolsGridPage');
    if (tp) tp.innerHTML = Registry.tools.map((t,i) => {
      const borderStyle = i%2===0 ? 'border-left:none;border-top:none;' : 'border-top:none;';
      return toolCard(t,i).replace(`style="${i%2===0?'border-left:none;':''}"`, `style="${borderStyle}"`);
    }).join('');
  }
  function methodCard(m) {
    if (m.enabled) {
      return `<div class="method-card active-card" data-method-id="${m.id}">
        <div class="method-card-code">${m.code}</div>
        <div class="method-card-name">${m.name}</div>
      </div>`;
    }
    return `<div class="method-card">
      <span class="method-card-lock">🔒</span>
      <div class="method-card-code">${m.code}</div>
      <div class="method-card-name">${m.name}</div>
      <span class="badge" style="font-size:9px">به‌زودی</span>
    </div>`;
  }

  return { chips, chipsWithNum, chipsEmtezaj, chipsEmtehan, buildMethodGrids };
})();


const Steps = (() => {
  let _n = 0;
  const container = () => document.getElementById('stepsContainer');

  function reset() { _n = 0; container().innerHTML = ''; }
  function add(title, content) {
    _n++;
    const el = document.createElement('div');
    el.className = 'step-card';
    el.id = 'step-' + _n;
    el.innerHTML = `<div class="step-header" onclick="Steps.toggle(${_n})">
      <div class="step-num">${_n}</div>
      <div class="step-title">${title}</div>
      <div class="step-arrow">◀</div>
    </div>
    <div class="step-content">${content}</div>`;
    container().appendChild(el);
    return _n;
  }
  function toggle(n) { document.getElementById('step-'+n)?.classList.toggle('active'); }
  function activateLast() { document.getElementById('step-'+_n)?.classList.add('active'); }
  function setProgress(p) { document.getElementById('progressFill').style.width = p + '%'; }
  function getCurrent() { return _n; }
  function getHTML() { return container().innerHTML; }
  function setHTML(html) { container().innerHTML = html; }

  return { reset, add, toggle, activateLast, setProgress, getCurrent, getHTML, setHTML };
})();
