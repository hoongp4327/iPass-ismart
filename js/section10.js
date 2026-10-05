/* =========================================================
   SECTION 10 — DẢI CHÂN DUNG GIÁO VIÊN

   Việc lướt do CSS scroll-snap lo; file này chỉ thêm chấm trang và
   2 nút mũi tên. Markup trong index.html để trống khối .teachers__nav,
   nên không có JS thì dải vẫn vuốt tay được bình thường.

   "Trang" ở đây = một màn thẻ, tính theo số thẻ vừa khít vùng nhìn
   (4 ở desktop, 3 ở tablet, ~1.75 ở mobile) nên không khoá cứng con số.
   ========================================================= */

(function () {
  'use strict';

  var wrap = document.querySelector('.teachers');
  if (!wrap) return;

  var viewport = wrap.querySelector('.teachers__viewport');
  var track    = wrap.querySelector('.teachers__track');
  var nav      = wrap.querySelector('.teachers__nav');
  var items    = track ? Array.prototype.slice.call(track.children) : [];

  if (!viewport || !track || !nav || items.length < 2) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var prevBtn, nextBtn, dotsWrap;
  var dots = [];
  var pageCount = 0;

  /* ---------------------------------------------------------
     Đo đạc
     --------------------------------------------------------- */

  /* bước nhảy 1 thẻ = bề rộng thẻ + khoảng cách giữa 2 thẻ */
  function step() {
    var a = items[0].getBoundingClientRect();
    var b = items[1].getBoundingClientRect();
    return Math.round(b.left - a.left) || Math.round(a.width);
  }

  /* số thẻ lọt trọn trong vùng nhìn — làm tròn xuống, tối thiểu 1 */
  function perPage() {
    var n = Math.floor((viewport.clientWidth + 1) / step());
    return Math.max(1, n);
  }

  function maxScroll() {
    return viewport.scrollWidth - viewport.clientWidth;
  }

  function currentPage() {
    var size = perPage() * step();
    if (size <= 0) return 0;
    /* Trang cuối thường hụt vài thẻ nên phép chia làm tròn chưa tới số
       trang cuối — chạm đáy thì gán thẳng, không để chấm đứng lệch. */
    if (viewport.scrollLeft >= maxScroll() - 2) return pageCount - 1;
    return Math.min(pageCount - 1, Math.round(viewport.scrollLeft / size));
  }

  /* ---------------------------------------------------------
     Dựng nút
     --------------------------------------------------------- */

  function button(cls, label, text) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.setAttribute('aria-label', label);
    b.textContent = text;
    return b;
  }

  function buildNav() {
    nav.innerHTML = '';
    dots = [];

    prevBtn = button('teachers__arrow', 'Xem các giáo viên trước đó', '←');
    nextBtn = button('teachers__arrow', 'Xem thêm giáo viên', '→');

    dotsWrap = document.createElement('div');
    dotsWrap.className = 'teachers__dots';

    pageCount = Math.ceil(items.length / perPage());

    for (var i = 0; i < pageCount; i++) {
      var dot = button('teachers__dot', 'Tới nhóm thẻ ' + (i + 1), '');
      dot.dataset.page = String(i);
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }

    nav.appendChild(prevBtn);
    nav.appendChild(dotsWrap);
    nav.appendChild(nextBtn);

    prevBtn.addEventListener('click', function () { nudge(-1); });
    nextBtn.addEventListener('click', function () { nudge(1); });
    dotsWrap.addEventListener('click', function (e) {
      var dot = e.target.closest('.teachers__dot');
      if (dot) goToPage(parseInt(dot.dataset.page, 10));
    });
  }

  /* ---------------------------------------------------------
     Di chuyển
     --------------------------------------------------------- */

  function scrollTo(left) {
    viewport.scrollTo({
      left: Math.max(0, Math.min(left, maxScroll())),
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }

  function nudge(dir) {
    scrollTo(viewport.scrollLeft + dir * perPage() * step());
  }

  function goToPage(i) {
    scrollTo(i * perPage() * step());
  }

  /* ---------------------------------------------------------
     Đồng bộ trạng thái
     --------------------------------------------------------- */

  function sync() {
    var page = currentPage();

    dots.forEach(function (dot, i) {
      var on = i === page;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-current', on ? 'true' : 'false');
    });

    /* trừ hao 2px cho sai số làm tròn của scrollLeft */
    prevBtn.disabled = viewport.scrollLeft <= 2;
    nextBtn.disabled = viewport.scrollLeft >= maxScroll() - 2;
  }

  /* ---------------------------------------------------------
     Khởi tạo
     --------------------------------------------------------- */

  buildNav();
  sync();

  var ticking = false;
  viewport.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      sync();
      ticking = false;
    });
  }, { passive: true });

  /* Số thẻ mỗi trang đổi theo bề ngang vùng nhìn. Theo dõi chính vùng
     nhìn chứ không nghe 'resize' của window: bề ngang còn đổi khi ảnh
     tải xong hay font thay bản dự phòng, lúc đó window không resize. */
  var rebuildTimer;
  function scheduleRebuild() {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(function () {
      buildNav();
      sync();
    }, 150);
  }

  if (window.ResizeObserver) {
    new ResizeObserver(scheduleRebuild).observe(viewport);
  } else {
    window.addEventListener('resize', scheduleRebuild);
  }
})();
