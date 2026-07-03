"use strict";

const UI = (() => {
  let colors = {};
  function renderSquares(letters) {
    const c = document.getElementById('finalSquares');
    if (!c) return;
    colors = {};
    c.innerHTML = letters.map((ch,i) => `<div class="answer-square" data-i="${i}" onclick="UI.pick(${i})">${Core.escapeHTML(ch)}</div>`).join('');
  }
  function pick(i) { const inp = prompt('کد رنگ (مثلا #c9a84c):', '#c9a84c'); if (inp) { colors[i] = inp; const sq = document.querySelector(`.answer-square[data-i="${i}"]`); if (sq) sq.style.color = inp; } }
  function getSquareColors() { return colors; }
  function resetAllColors() { colors = {}; document.querySelectorAll('.answer-square').forEach(s => s.style.color = ''); Toast.show('رنگ‌ها بازنشانی شد'); }
  return { renderSquares, pick, getSquareColors, resetAllColors };
})();
