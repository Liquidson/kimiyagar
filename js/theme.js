"use strict";

const Theme = (() => {
  function apply(m) { document.body.classList.toggle('theme-light', m === 'light'); try { localStorage.setItem('kimiya-theme', m) } catch (e) {} }
  function init() { let m = 'dark'; try { m = localStorage.getItem('kimiya-theme') || 'dark' } catch (e) {} apply(m); }
  function toggle() { const isLight = document.body.classList.contains('theme-light'); apply(isLight ? 'dark' : 'light'); Toast.show(isLight ? 'تم تاریک' : 'تم روشن'); }
  return { init, toggle };
})();
