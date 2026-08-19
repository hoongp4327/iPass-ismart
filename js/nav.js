/* =========================================================
   THANH ĐIỀU HƯỚNG
     · cuộn qua hero  → gắn class .is-stuck (đổi sang nền trắng)
     · mobile         → nút mở / đóng menu xổ
     · đang ở section nào thì liên kết tương ứng sáng lên
   ========================================================= */

(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  if (!nav) return;

  var toggle = nav.querySelector('.nav__toggle');
  var links  = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));

  /* --- đổi nền khi cuộn ------------------------------------------------ */

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      nav.classList.toggle('is-stuck', window.scrollY > 40);
      markActive();
    });
  }

  /* --- menu mobile ----------------------------------------------------- */

  function closeMenu() {
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* bấm vào liên kết thì đóng menu lại cho khỏi che nội dung */
  links.forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* bấm ra ngoài hoặc bấm Esc cũng đóng */
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* --- làm nổi liên kết của section đang xem --------------------------- */

  var targets = links
    .map(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return null;
      var el = document.querySelector(id);
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function markActive() {
    if (!targets.length) return;
    /* section nào có mép trên nằm gần vạch 1/3 màn hình nhất thì coi là đang xem */
    var line = window.scrollY + window.innerHeight / 3;
    var current = null;

    targets.forEach(function (t) {
      var top = t.el.getBoundingClientRect().top + window.scrollY;
      if (top <= line) current = t;
    });

    targets.forEach(function (t) {
      t.link.classList.toggle('is-active', t === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', closeMenu);
  onScroll();
})();
