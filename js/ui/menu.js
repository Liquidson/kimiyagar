"use strict";

const Menu = (() => {
  function toggle() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebarOverlay').classList.toggle('show');
    document.getElementById('hamburgerBtn').classList.toggle('open');
  }
  function close() {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('sidebarOverlay').classList.remove('show');
    document.getElementById('hamburgerBtn').classList.remove('open');
  }
  return { toggle, close };
})();
