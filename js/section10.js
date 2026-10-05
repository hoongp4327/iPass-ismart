/* =========================================================
   SECTION 10 — DẢI CHÂN DUNG GIÁO VIÊN TỰ TRÔI

   Danh sách được nhân đôi rồi đẩy scrollLeft từng khung hình, nên
   dải chạy vòng không có điểm nối: tới mép thì nhảy về mốc tương
   đương một vòng bên kia, mắt không thấy vì nội dung hai bên giống hệt.

   Vẫn dùng vùng cuộn thật (overflow-x) chứ không phải transform, nhờ
   vậy người dùng vuốt tay hay lăn chuột ngang vẫn được. Dải dừng khi
   đưa chuột vào, khi chạm, khi có phần tử trong dải nhận focus bàn
   phím, và không chạy khi máy bật chế độ giảm chuyển động.

   Hướng chạy: thẻ trôi từ TRÁI sang PHẢI, tức scrollLeft giảm dần.
   ========================================================= */

(function () {
  'use strict';

  var wrap = document.querySelector('.teachers');
  if (!wrap) return;

  var viewport = wrap.querySelector('.teachers__viewport');
  var track    = wrap.querySelector('.teachers__track');
  if (!viewport || !track) return;

  var originals = Array.prototype.slice.call(track.children);
  if (originals.length < 2) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* giữ nguyên 10 thẻ, không nhân đôi, không chạy — vẫn vuốt tay được */
  if (reduceMotion.matches) return;

  var SPEED = 40;            /* px mỗi giây — một vòng 10 thẻ hết ~75 giây */
  var RESUME_DELAY = 1200;   /* rời chuột bao lâu thì chạy tiếp */

  /* ---------------------------------------------------------
     Nhân đôi danh sách cho vòng chạy liền mạch
     --------------------------------------------------------- */

  function cloneTrack() {
    originals.forEach(function (item) {
      var copy = item.cloneNode(true);
      /* bản sao chỉ để mắt nhìn — giấu khỏi trình đọc màn hình, không
         thì mỗi giáo viên bị đọc hai lần */
      copy.setAttribute('aria-hidden', 'true');
      copy.dataset.clone = 'true';
      track.appendChild(copy);
    });
  }

  /* bề rộng một vòng = tổng bề rộng bản gốc, tính cả khoảng cách sau nó */
  function loopWidth() {
    var first = originals[0].getBoundingClientRect();
    var last  = originals[originals.length - 1].getBoundingClientRect();
    var gap   = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return (last.right - first.left) + gap;
  }

  /* ---------------------------------------------------------
     Vòng chạy
     --------------------------------------------------------- */

  var paused = false;
  var resumeTimer = null;
  var lastTime = 0;

  function tick(now) {
    window.requestAnimationFrame(tick);

    if (!lastTime) { lastTime = now; return; }
    var dt = (now - lastTime) / 1000;
    lastTime = now;

    if (paused) return;
    /* khoảng nhảy quá lớn (vừa chuyển tab về) thì bỏ qua một nhịp
       thay vì giật một phát dài */
    if (dt <= 0 || dt > 0.1) return;

    var span = loopWidth();
    if (span <= 0) return;

    var next = viewport.scrollLeft - SPEED * dt;
    if (next <= 0) next += span;   /* chạm mép trái → vòng lại */

    viewport.scrollLeft = next;
  }

  function pause() {
    paused = true;
    window.clearTimeout(resumeTimer);
  }

  function resumeLater() {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function () {
      paused = false;
      lastTime = 0;
    }, RESUME_DELAY);
  }

  /* ---------------------------------------------------------
     Khởi động
     --------------------------------------------------------- */

  function start() {
    cloneTrack();

    /* đứng ở đầu bản sao: còn chỗ trôi sang phải ngay từ giây đầu,
       không phải đợi chạm mép mới vòng lại */
    viewport.scrollLeft = loopWidth();

    window.requestAnimationFrame(tick);

    wrap.addEventListener('mouseenter', pause);
    wrap.addEventListener('mouseleave', resumeLater);
    wrap.addEventListener('focusin', pause);
    wrap.addEventListener('focusout', resumeLater);

    viewport.addEventListener('pointerdown', pause);
    window.addEventListener('pointerup', resumeLater);

    /* tab ẩn thì rAF ngủ — về lại phải đặt lại mốc thời gian */
    document.addEventListener('visibilitychange', function () {
      lastTime = 0;
    });
  }

  /* đợi ảnh tải xong mới đo: ảnh chưa có kích thước thì vòng chạy sai */
  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start);
  }
})();
