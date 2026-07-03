"use strict";

const Toast = (() => {
  let t;
  function show(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove('show'), 2200);
  }
  return { show };
})();
