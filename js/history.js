"use strict";

const History = (() => {
  const KEY = 'kimiya-history';
  let items = [];

  function load() { try { items = JSON.parse(localStorage.getItem(KEY) || '[]').map(normalizeRecord).filter(Boolean) } catch (e) { items = [] } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch (e) {} }

  // ─── Backward Compatibility: Migrate legacy method records ───
  function normalizeRecord(r) {
    if (!r) return null;

    const type = r.type || (r.method ? 'method' : r.mode ? 'mostahsela' : r.tool ? 'calculation-tool' : '');

    if (type === 'method') {
      const p = r.payload || {};
      return {
        ...r,
        id: r.id,
        type: 'method',
        title: r.title || `روش ${p.method || r.method || ''}`,
        createdAt: r.createdAt || new Date().toISOString(),
        input: r.input ?? p.question ?? r.question ?? '',
        output: r.output ?? p.reading ?? r.reading ?? '—',
        note: typeof r.note === 'string' ? r.note : '',
        meta: r.meta || {},
        payload: {
          ...p,
          method: p.method || r.method || r.meta?.method || '1x1',
          question: p.question ?? r.question ?? r.input ?? '',
          reading: p.reading ?? r.reading ?? r.output ?? '—',
          letters: Array.isArray(p.letters) ? p.letters : (Array.isArray(r.letters) ? r.letters : []),
          stepsHTML: p.stepsHTML ?? r.stepsHTML ?? '',
          squareColors: p.squareColors || r.squareColors || {},
          fullText: p.fullText ?? r.fullText ?? '',
        }
      };
    }

    if (type === 'mostahsela') {
      const p = r.payload || {};
      const volume = Number(p.volume || r.volume || r.meta?.volume || 1) === 2 ? 2 : 1;
      return {
        ...r,
        type: 'mostahsela',
        title: r.title || `مستحصله — ${p.modeName || r.modeName || p.mode || r.mode || ''}`,
        createdAt: r.createdAt || new Date().toISOString(),
        input: r.input ?? p.input ?? '',
        output: r.output ?? p.finalRow ?? r.finalRow ?? '',
        note: typeof r.note === 'string' ? r.note : '',
        meta: { ...(r.meta || {}), volume },
        payload: {
          ...p,
          volume,
          input: p.input ?? r.input ?? '',
          mode: p.mode || r.mode || r.meta?.mode || '',
          modeName: p.modeName || r.modeName || r.meta?.modeName || '',
          customCircle: p.customCircle ?? r.customCircle ?? '',
          config: p.config || r.config || {},
          finalRow: p.finalRow ?? r.finalRow ?? r.output ?? '',
          summary: p.summary || r.summary || {},
          steps: p.steps || r.steps || [],
          remainingQueue: p.remainingQueue || r.remainingQueue || [],
        }
      };
    }

    if (type === 'calculation-tool') {
      const p = r.payload || {};
      const volume = Number(p.volume || r.volume || r.meta?.volume || 1) === 2 ? 2 : 1;
      return {
        ...r,
        type: 'calculation-tool',
        title: r.title || `ابزار: ${p.toolName || r.toolName || p.tool || r.tool || ''}`,
        createdAt: r.createdAt || new Date().toISOString(),
        input: r.input ?? p.inputSummary ?? p.input ?? '',
        output: r.output ?? p.outputSummary ?? p.output ?? '',
        note: typeof r.note === 'string' ? r.note : '',
        meta: { ...(r.meta || {}), volume },
        payload: {
          ...p,
          volume,
          tool: p.tool || r.tool || r.meta?.toolId || '',
          toolName: p.toolName || r.toolName || r.meta?.toolName || '',
          input: p.input ?? r.input ?? '',
          inputSummary: p.inputSummary ?? r.input ?? '',
          output: p.output ?? r.output ?? '',
          outputSummary: p.outputSummary ?? r.output ?? '',
          result: p.result || r.result || null,
        }
      };
    }

    return {
      ...r,
      id: r.id ?? Date.now(),
      type: r.type || 'unknown',
      title: r.title || 'بدون نام',
      createdAt: r.createdAt || new Date().toISOString(),
      input: r.input ?? '',
      output: r.output ?? '',
      note: typeof r.note === 'string' ? r.note : '',
      meta: r.meta || {},
      payload: r.payload || {},
    };
  }

  function push(r) {
    if (!r || r.id === undefined || r.id === null) return;
    load();

    // Normalize if needed
    if (!r.type) {
      if (r.method) r.type = 'method';
      else if (r.mode) r.type = 'mostahsela';
      else if (r.tool) r.type = 'calculation-tool';
    }

    // Ensure required fields
    if (!r.createdAt) r.createdAt = new Date().toISOString();
    if (r.title === undefined) r.title = 'بدون نام';
    if (r.input === undefined) r.input = '';
    if (r.output === undefined) r.output = '';

    const normalized = normalizeRecord(r);
    const existingIndex = items.findIndex(x => String(x.id) === String(normalized.id));
    if (existingIndex >= 0) items.splice(existingIndex, 1);
    items.unshift(normalized);
    if (items.length > 50) items = items.slice(0, 50);
    save();
    render();
  }

  function updateItem(id, patch) {
    load();
    const it = items.find(x => String(x.id) === String(id));
    if (it) Object.assign(it, patch);
    save();
  }

  function clearAll() {
    if (!confirm('پاک کردن کل تاریخچه؟')) return;
    items = [];
    save();
    render();
    Toast.show('تاریخچه پاک شد');
  }

  // ─── Type-specific renderers ───
  function renderMethodItem(it) {
    const p = it.payload || {};
    const question = Core.escapeHTML(p.question || '');
    const reading = Core.escapeHTML(p.reading || '—');
    const letterCount = (p.letters || []).length;
    return `<div class="history-item" data-history-id="${it.id}"><div class="history-q">${question}</div><div class="history-r">${reading}</div><div class="history-meta">روش ${p.method} · ${letterCount} حرف</div></div>`;
  }

  function renderMostahselaItem(it) {
    const p = it.payload || {};
    const input = Core.escapeHTML(p.input || '');
    const finalRow = Core.escapeHTML(p.finalRow || '—');
    const modeName = Core.escapeHTML(p.modeName || p.mode || '');
    const volumeLabel = Number(p.volume || it.meta?.volume || 1) === 2 ? 'جلد دوم' : 'جلد اول';
    return `<div class="history-item" data-history-id="${it.id}"><div class="history-q">مستحصله ${volumeLabel} — ${modeName}</div><div class="history-r">${input} ← ${finalRow}</div><div class="history-meta">${volumeLabel} · پذیرفته: ${p.summary?.accepted || 0} · تغییر: ${p.summary?.changed || 0}</div></div>`;
  }

  function renderToolItem(it) {
    const p = it.payload || {};
    const toolName = Core.escapeHTML(p.toolName || p.tool || '');
    const inputSummary = Core.escapeHTML((p.inputSummary || p.input || '').substring(0, 30));
    const outputSummary = Core.escapeHTML((p.outputSummary || p.output || '').substring(0, 30));
    const volumeLabel = Number(p.volume || it.meta?.volume || 1) === 2 ? 'جلد دوم' : 'جلد اول';
    return `<div class="history-item" data-history-id="${it.id}"><div class="history-q">ابزار ${volumeLabel}: ${toolName}</div><div class="history-r">${inputSummary} ← ${outputSummary}</div><div class="history-meta">ابزار محاسبه · ${volumeLabel}</div></div>`;
  }

  function itemHTML(it) {
    it = normalizeRecord(it);
    if (!it) return '';

    const type = it.type || 'method';
    if (type === 'method') return renderMethodItem(it);
    if (type === 'mostahsela') return renderMostahselaItem(it);
    if (type === 'calculation-tool') return renderToolItem(it);

    // Fallback
    return `<div class="history-item" data-history-id="${it.id}"><div class="history-q">${Core.escapeHTML(it.title || '')}</div><div class="history-r">${Core.escapeHTML(it.output || '—')}</div><div class="history-meta">${it.type}</div></div>`;
  }

  function attachHistoryListeners(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.removeEventListener('click', handleHistoryClick);
    container.addEventListener('click', handleHistoryClick);
  }

  function handleHistoryClick(event) {
    const item = event.target.closest('[data-history-id]');
    if (!item) return;
    const id = parseInt(item.dataset.historyId, 10);
    if (isNaN(id)) return;
    History.open(id);
  }

  function render() {
    load();
    const html = items.length ? items.map(itemHTML).join('') : '<div class="small" style="text-align:center;padding:20px;opacity:.6">تاریخچه‌ای موجود نیست</div>';
    ['historyList','historyListAside'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
      attachHistoryListeners(id);
    });
  }

  function renderNotes() {
    load();
    const withNotes = items.filter(i => i.note);
    const html = withNotes.length ? withNotes.map(itemHTML).join('') : '<div class="small" style="text-align:center;padding:20px;opacity:.6">یادداشتی موجود نیست</div>';
    const el = document.getElementById('notesItems');
    if (el) {
      el.innerHTML = html;
      attachHistoryListeners('notesItems');
    }
  }

  // ─── Type-specific openers ───
  function openMethodRecord(it) {
    const p = it.payload || {};
    App.setCurrentMethod(p.method);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    document.getElementById('appBottomNav').style.display = 'flex';
    document.getElementById('question').value = p.question || '';
    Steps.setHTML(p.stepsHTML || '');
    UI.renderSquares(p.letters || []);
    document.getElementById('finalReading').textContent = p.reading || '—';
    document.getElementById('finalNote').innerHTML = `تعداد حروف: <b style="color:var(--gold)">${(p.letters||[]).length}</b>`;
    document.getElementById('resultNote').value = it.note || '';
    document.getElementById('results').style.display = 'block';
    App.setLastResult(it);
    Pages.close('historyPage');
    Pages.close('notesModal');
    Toast.show('نتیجه بازیابی شد');
  }

  function openMostahselaRecord(it) {
    const p = it.payload || {};
    const volume = Number(p.volume || it.meta?.volume || 1) === 2 ? 2 : 1;
    Pages.open('mostahselaPage');
    VolumePagesController.activateMostahsela(volume);

    if (volume === 2) {
      MostahselaV2ToolController.restoreRecord(it);
      Pages.close('historyPage');
      Pages.close('notesModal');
      Toast.show('نتیجه جلد دوم بازیابی شد');
      return;
    }

    // Restore form state
    if (p.input) document.getElementById('mostahselaInput').value = p.input;
    if (p.mode) {
      document.querySelectorAll('.mostahsela-mode-btn').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`[data-mode="${p.mode}"]`);
      if (btn) btn.classList.add('active');
    }
    if (p.customCircle) document.getElementById('mostahselaCircle').value = p.customCircle;

    // Restore test config
    if (p.config) {
      if (p.config.tanaqoz) {
        document.getElementById('testTanaqoz').checked = p.config.tanaqoz.active;
        document.getElementById('testTanaqozNum').value = p.config.tanaqoz.num || 3;
      }
      if (p.config.hamavai) {
        document.getElementById('testHamavai').checked = p.config.hamavai.active;
        document.getElementById('testHamavaiNum').value = p.config.hamavai.num || 2;
      }
      if (p.config.takrar) {
        document.getElementById('testTakrar').checked = p.config.takrar.active;
        document.getElementById('testTakrarNum').value = p.config.takrar.num || 5;
      }
    }

    // Restore results
    if (p.finalRow) {
      document.getElementById('mostahselaFinalRow').textContent = p.finalRow;
      if (p.summary) {
        document.getElementById('mostahselaAccepted').textContent = p.summary.accepted || 0;
        document.getElementById('mostahselaChanged').textContent = p.summary.changed || 0;
        document.getElementById('mostahselaRemoved').textContent = p.summary.removed || 0;
      }
      if (p.steps) {
        const stepsList = document.getElementById('mostahselaStepsList');
        if (stepsList) {
          stepsList.innerHTML = '';
          p.steps.forEach((step, idx) => {
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
                  if (t.tanaqoz.checked && t.tanaqoz.checked.length > 0) {
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
        }
      }
      if (p.remainingQueue && p.remainingQueue.length > 0) {
        const qDiv = document.createElement('div');
        qDiv.className = 'mostahsela-queue-card';
        qDiv.innerHTML = `<div style="font-weight:600;margin-bottom:6px">حروف باقی‌مانده در صف:</div><div style="font-family:'Amiri',serif;font-size:16px;color:var(--gold);letter-spacing:2px">${p.remainingQueue.join(' ')}</div>`;
        const stepsList = document.getElementById('mostahselaStepsList');
        if (stepsList) stepsList.appendChild(qDiv);
      }
      document.getElementById('mostahselaResults').style.display = 'block';
    }

    document.getElementById('mostahselaNote').value = it.note || '';
    Pages.close('historyPage');
    Pages.close('notesModal');
    Toast.show('نتیجه بازیابی شد');
  }

  function openToolRecord(it) {
    const p = it.payload || {};
    const volume = Number(p.volume || it.meta?.volume || 1) === 2 ? 2 : 1;
    Pages.open('calculationToolsPage');
    VolumePagesController.activateTools(volume);
    const controller = volume === 2 ? CalculationToolsV2Controller : CalculationToolsController;
    controller.switchTool(p.tool);
    controller.restoreResult(p);
    Pages.close('historyPage');
    Pages.close('notesModal');
    Toast.show(volume === 2 ? 'نتیجه ابزار جلد دوم بازیابی شد' : 'نتیجه بازیابی شد');
  }

  function open(id) {
    load();
    const it = items.find(x => x.id === id);
    if (!it) return;

    it = normalizeRecord(it);
    const type = it.type || 'method';

    if (type === 'method') openMethodRecord(it);
    else if (type === 'mostahsela') openMostahselaRecord(it);
    else if (type === 'calculation-tool') openToolRecord(it);
  }

  return { push, updateItem, clearAll, render, renderNotes, open };
})();
