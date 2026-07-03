"use strict";

const Pages = (() => {
  function getCanvas() {
    return document.getElementById('bgCanvas');
  }

  function moveCanvasToActiveLayer() {
    const canvas = getCanvas();
    if (!canvas) return;

    const openPages = Array.from(document.querySelectorAll('.inner-page.show'));
    const activePage = openPages[openPages.length - 1];

    if (activePage) {
      if (canvas.parentElement !== activePage) activePage.prepend(canvas);
      canvas.dataset.layer = 'inner-page';
      return;
    }

    if (canvas.parentElement !== document.body) document.body.prepend(canvas);
    delete canvas.dataset.layer;
  }

  function open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('show');
    if (el.classList.contains('inner-page')) moveCanvasToActiveLayer();
  }

  function close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('show');
    if (el.classList.contains('inner-page')) moveCanvasToActiveLayer();
  }

  return { open, close };
})();
