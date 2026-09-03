/* =========================================================
   iPASS — Hệ thống chuyển động dùng chung cho toàn trang
   GSAP 3 + ScrollTrigger (nạp qua CDN trong index.html)

   Toàn bộ section dùng CHUNG một bộ token timing/easing khai
   báo ở MOTION bên dưới — sửa ở đây là đổi cảm giác cả trang.

   Tính cách chuyển động: "Energetic" tiết chế —
   vào nhanh, hãm mượt (power3.out) cho khối nội dung;
   nảy nhẹ (back.out) chỉ dành cho điểm nhấn: số, huy hiệu,
   mascot. Không dùng linear cho chuyển động không gian.

   Ba lớp chuyển động (thiếu lớp nào là animation bị "phẳng"):
     1. Chính   — khối nội dung trôi lên + hiện dần
     2. Phụ     — số/huy hiệu/icon nảy trễ sau khối cha
     3. Nền     — mascot dập dềnh, texture trôi theo cuộn

   Trạng thái ẩn ban đầu do JS đặt (gsap.set), KHÔNG đặt trong
   CSS — để nếu JS lỗi hoặc chưa chạy thì nội dung vẫn hiện đủ.
   ========================================================= */

(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     TOKEN — bảng thời lượng / easing / độ trễ dùng chung
     --------------------------------------------------------- */

  var MOTION = {
    dur: {
      quick: 0.28,   // hover, phản hồi nhỏ
      base:  0.55,   // khối nội dung, thẻ
      slow:  0.9     // mảng lớn, tiêu đề trang trọng
    },
    ease: {
      out:  'power3.out',      // easing chủ đạo (~80% animation)
      soft: 'power2.out',      // dịu hơn, cho chữ dài
      pop:  'back.out(1.6)',   // nảy nhẹ — chỉ cho điểm nhấn
      loop: 'sine.inOut'       // vòng lặp nền, liền mạch
    },
    stagger: {
      tight: 0.06,   // item trong 1 danh sách
      base:  0.08,   // lưới thẻ (4 thẻ × 0.08 = 0.24s)
      loose: 0.12    // khối lớn, có chủ đích kịch tính
    },
    /* khoảng dịch chuyển khi xuất hiện — giữ nhỏ, dưới 1/3 màn hình */
    shift: { y: 32, x: 40 },
    /* mốc kích hoạt: phần tử vào 82% chiều cao khung nhìn */
    start: 'top 82%'
  };

  /* ---------------------------------------------------------
     Hàm dựng — mỗi hàm nhận selector, tự bỏ qua nếu không có
     --------------------------------------------------------- */

  function $(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* Hiện dần + trôi lên. dir: 'up' | 'left' | 'right' */
  function reveal(sel, opts) {
    var els = $(sel);
    if (!els.length) return;
    opts = opts || {};

    var from = { opacity: 0 };
    var dir = opts.dir || 'up';
    if (dir === 'up')    from.y = MOTION.shift.y;
    if (dir === 'left')  from.x = -MOTION.shift.x;
    if (dir === 'right') from.x = MOTION.shift.x;
    if (dir === 'scale') { from.scale = 0.92; from.y = MOTION.shift.y * 0.5; }

    els.forEach(function (el) {
      gsap.set(el, from);
      gsap.to(el, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: opts.duration || MOTION.dur.base,
        delay: opts.delay || 0,
        ease: opts.ease || MOTION.ease.out,
        scrollTrigger: { trigger: opts.trigger || el, start: MOTION.start, once: true }
      });
    });
  }

  /* Lưới thẻ: các item lần lượt hiện.

     Gom item theo phần tử CHA rồi tạo 1 tween có stagger cho mỗi nhóm,
     lấy chính phần tử cha làm trigger. Cách này chắc ăn hơn
     ScrollTrigger.batch: tween được gắn thẳng vào ScrollTrigger nên
     luôn chạy đúng khi cuộn qua, kể cả khi cuộn rất nhanh hoặc nhảy
     thẳng tới giữa trang bằng liên kết neo.                          */
  function revealStagger(sel, opts) {
    var els = $(sel);
    if (!els.length) return;
    opts = opts || {};

    /* nhóm theo cha để mỗi lưới có nhịp stagger riêng */
    var groups = [];
    els.forEach(function (el) {
      var parent = el.parentElement;
      var g = groups.filter(function (x) { return x.parent === parent; })[0];
      if (!g) { g = { parent: parent, items: [] }; groups.push(g); }
      g.items.push(el);
    });

    groups.forEach(function (g) {
      gsap.set(g.items, { opacity: 0, y: MOTION.shift.y });
      gsap.to(g.items, {
        opacity: 1, y: 0,
        duration: opts.duration || MOTION.dur.base,
        ease: opts.ease || MOTION.ease.out,
        stagger: opts.stagger || MOTION.stagger.base,
        scrollTrigger: { trigger: g.parent, start: MOTION.start, once: true }
      });
    });
  }

  /* Điểm nhấn nảy nhẹ: số thứ tự, huy hiệu, chữ cái trong vòng tròn

     opts.keep — các thuộc tính transform mà CSS đã đặt sẵn (vd xoay
     nghiêng, dịch dọc). GSAP ghi đè toàn bộ transform nên phải khai
     báo lại ở đây, nếu không phần tử sẽ bị mất góc xoay/độ lệch.   */
  function pop(sel, opts) {
    var els = $(sel);
    if (!els.length) return;
    opts = opts || {};

    var keep = opts.keep || {};

    els.forEach(function (el) {
      var from = { opacity: 0, scale: 0.7 };
      var to   = { opacity: 1, scale: 1 };
      for (var k in keep) { from[k] = keep[k]; to[k] = keep[k]; }

      gsap.set(el, from);
      gsap.to(el, Object.assign(to, {
        duration: opts.duration || MOTION.dur.base,
        delay: opts.delay || 0.12,          // trễ sau khối cha → tạo lớp phụ
        ease: MOTION.ease.pop,
        scrollTrigger: { trigger: opts.trigger || el, start: MOTION.start, once: true }
      }));
    });
  }

  /* Đếm số tăng dần — giữ nguyên phần chữ quanh số (vd "70 Phút") */
  function countUp(sel) {
    $(sel).forEach(function (el) {
      var match = el.textContent.match(/(\d+)/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var tpl = el.textContent;
      var obj = { v: 0 };

      gsap.to(obj, {
        v: target,
        duration: MOTION.dur.slow,
        ease: MOTION.ease.soft,
        scrollTrigger: { trigger: el, start: MOTION.start, once: true },
        onUpdate: function () {
          el.textContent = tpl.replace(/\d+/, Math.round(obj.v));
        }
      });
    });
  }

  /* Lớp nền: dập dềnh liên tục, biên độ nhỏ để không gây nhiễu */
  function float(sel, opts) {
    var els = $(sel);
    if (!els.length) return;
    opts = opts || {};
    els.forEach(function (el, i) {
      gsap.to(el, {
        y: opts.amount || -10,
        duration: opts.duration || 3.2,
        ease: MOTION.ease.loop,
        repeat: -1,
        yoyo: true,
        delay: i * 0.35
      });
    });
  }

  /* Lớp nền: trôi nhẹ theo độ cuộn (parallax) */
  function parallax(sel, amount) {
    var els = $(sel);
    if (!els.length) return;
    els.forEach(function (el) {
      gsap.to(el, {
        yPercent: amount || -8,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  /* Vẽ dần đường nối (dùng cho đường nét đứt nối các chặng) */
  function grow(sel, axis) {
    var els = $(sel);
    if (!els.length) return;
    els.forEach(function (el) {
      gsap.set(el, { scaleX: axis === 'y' ? 1 : 0, scaleY: axis === 'y' ? 0 : 1, transformOrigin: 'left center' });
      gsap.to(el, {
        scaleX: 1, scaleY: 1,
        duration: MOTION.dur.slow,
        ease: MOTION.ease.soft,
        scrollTrigger: { trigger: el.closest('section') || el, start: MOTION.start, once: true }
      });
    });
  }

  /* ---------------------------------------------------------
     Chỉ dựng animation khi người dùng KHÔNG yêu cầu giảm
     chuyển động. Nhánh reduce để trống → nội dung hiện tĩnh.
     --------------------------------------------------------- */

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {

    /* ---- SECTION 01 · HERO ---- */
    reveal('.hero__brand', { dir: 'up', duration: MOTION.dur.base });
    reveal('.hero__logo',  { dir: 'up', delay: 0.1, duration: MOTION.dur.slow });
    reveal('.hero__card',  { dir: 'up', delay: 0.2 });
    reveal('.hero__tagline', { dir: 'up', delay: 0.3 });
    revealStagger('.hero__actions .btn', { stagger: MOTION.stagger.tight });
    /* huy hiệu điểm số đã có animation CSS riêng — không đụng vào */

    /* ---- SECTION 02 · NỖI LO ---- */
    reveal('.s2__eyebrow', { dir: 'up' });
    reveal('.s2__title',   { dir: 'up', delay: 0.08 });
    reveal('.s2__visual',  { dir: 'left' });
    reveal('.s2__card',    { dir: 'right', delay: 0.12 });
    revealStagger('.s2__tag', { stagger: MOTION.stagger.base });

    /* ---- SECTION 03 · LỘ TRÌNH TOÀN DIỆN ---- */
    reveal('.s3__eyebrow', { dir: 'up' });
    reveal('.s3__title',   { dir: 'up', delay: 0.08 });
    reveal('.s3__desc',    { dir: 'up', delay: 0.16 });
    revealStagger('.s3__card-item', { stagger: MOTION.stagger.base });
    float('.s3__mascot');
    parallax('.s3__card-bg', -6);

    /* ---- SECTION 05 · ACES ---- */
    reveal('.aces__eyebrow',  { dir: 'up' });
    reveal('.aces__title',    { dir: 'up', delay: 0.08 });
    reveal('.aces__subtitle', { dir: 'up', delay: 0.14 });
    reveal('.aces__desc',     { dir: 'up', delay: 0.2 });
    reveal('.aces__center',   { dir: 'scale', delay: 0.1 });
    revealStagger('.aces__card', { stagger: MOTION.stagger.loose });
    reveal('.aces__bar', { dir: 'up' });
    float('.aces__mascot', { amount: -8, duration: 3.6 });

    /* ---- SECTION 06 · iPASS 2P ---- */
    reveal('.plan__photo',   { dir: 'left' });
    reveal('.plan__heading', { dir: 'right' });
    reveal('.plan__pill',    { dir: 'right', delay: 0.12 });
    revealStagger('.plan__time-item', { stagger: MOTION.stagger.base });
    revealStagger('.plan__card', { stagger: MOTION.stagger.loose });
    reveal('.plan__tagline', { dir: 'up' });
    countUp('.plan__time-value');
    pop('.plan__card-tag');
    float('.plan__mascot', { amount: -7, duration: 3 });

    /* ---- SECTION 07 · PHƯƠNG PHÁP ---- */
    reveal('.s7__title', { dir: 'up' });
    reveal('.s7__flow',  { dir: 'up', delay: 0.1 });
    revealStagger('.s7__card', { stagger: MOTION.stagger.loose });
    pop('.s7__num');

    /* ---- SECTION 08 · SPEAK UP DAY ---- */
    reveal('.s8__eyebrow', { dir: 'up' });
    reveal('.s8__title',   { dir: 'up', delay: 0.08 });
    revealStagger('.s8__desc', { stagger: MOTION.stagger.tight });
    reveal('.s8__card',  { dir: 'left' });
    reveal('.s8__photo', { dir: 'right', delay: 0.1 });
    revealStagger('.s8__list li', { stagger: MOTION.stagger.tight });
    pop('.s8__trophy', { delay: 0.25 });
    pop('.s8__tag',    { delay: 0.35 });

    /* ---- SECTION 09 · KHÉP TRANG ---- */
    reveal('.s9__title', { dir: 'up' });
    revealStagger('.s9__card', { stagger: MOTION.stagger.base });
    pop('.s9__hub', { delay: 0.2, keep: { yPercent: 5.4 } });
    grow('.s9__dash');
    float('.s9__robot', { amount: -8, duration: 3.4 });
    float('.s9__pen',   { amount: -6, duration: 3.8 });

    /* ---- SECTION 10 · ĐỘI NGŨ GIÁO VIÊN ---- */
    reveal('.team__eyebrow', { dir: 'up' });
    reveal('.team__title',   { dir: 'up', delay: 0.08 });
    reveal('.team__desc',    { dir: 'up', delay: 0.16 });
    revealStagger('.team__card', { stagger: MOTION.stagger.base });
    pop('.team__number');

    /* ---- SECTION 11 · ĐĂNG KÝ TƯ VẤN ---- */
    reveal('.cta__eyebrow', { dir: 'up' });
    reveal('.cta__title',   { dir: 'up', delay: 0.08 });
    revealStagger('.cta__benefits li', { stagger: MOTION.stagger.tight });
    revealStagger('.cta__contact', { stagger: MOTION.stagger.base });
    reveal('.cta__card', { dir: 'right', delay: 0.1 });

    /* ---- FOOTER ---- */
    revealStagger('.site-footer__top > *', { stagger: MOTION.stagger.base });

    /* Ảnh và font nạp xong mới biết chiều cao thật của trang →
       tính lại mốc kích hoạt, tránh animation nổ sai vị trí. */
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

  });

})();
