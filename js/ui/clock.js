"use strict";

const Clock = (() => {
  function tick() {
    const now = new Date();
    const j = Core.toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const d = document.getElementById('clockDate'); if (d) d.textContent = `${j.jd} ${Core.MONTH_NAMES[j.jm-1]} ${j.jy}`;
    const t = document.getElementById('clockTime'); if (t) t.textContent = now.toLocaleTimeString('fa-IR');
  }
  function start() { tick(); setInterval(tick, 1000); }
  return { start };
})();
