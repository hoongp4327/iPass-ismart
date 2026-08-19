/* =========================================================
   SECTION 02 — tự mở thẻ "Hiểu bài nhưng vẫn mất điểm"

   Khi người dùng cuộn tới section, thẻ này tự bung ra nội dung
   đầy đủ để gợi ý rằng 3 thẻ đều bấm/trỏ vào được, rồi thu lại
   sau 3 giây. Chỉ chạy MỘT LẦN cho mỗi lần tải trang.

   Nếu người dùng tự trỏ chuột / chạm vào bất kỳ thẻ nào trong lúc
   đang tự mở thì huỷ luôn hẹn giờ, nhường quyền điều khiển lại cho
   họ — tránh cảnh thẻ tự đóng ngay khi đang đọc dở.
   ========================================================= */

(function () {
  'use strict';

  var TAG = '.s2__tag--3';        // thẻ "Hiểu bài nhưng vẫn mất điểm"
  var GIU = 3000;                 // giữ mở 3 giây

  var tag = document.querySelector(TAG);
  var section = document.querySelector('.s2');
  if (!tag || !section) return;

  /* tôn trọng thiết lập giảm chuyển động: không tự bung */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var daChay = false;
  var hen = null;

  function dong() {
    tag.classList.remove('is-open');
    hen = null;
  }

  function mo() {
    if (daChay) return;
    daChay = true;
    tag.classList.add('is-open');
    hen = setTimeout(dong, GIU);

    /* Chỉ gắn bộ chặn SAU khi đã bung.
       Nếu gắn ngay từ đầu thì một sự kiện pointerenter bất kỳ xảy ra
       trước lúc cuộn tới (con trỏ vô tình nằm sẵn trong vùng section)
       sẽ khoá luôn, khiến thẻ không bao giờ tự mở. */
    ['pointerenter', 'pointerdown', 'focusin'].forEach(function (ev) {
      section.addEventListener(ev, huyHenGio, { once: true });
    });
  }

  /* người dùng tự tương tác → bỏ hẹn giờ, trả quyền cho hover/focus */
  function huyHenGio() {
    if (hen) { clearTimeout(hen); dong(); }
  }

  /* IntersectionObserver: bung khi section lọt vào khung nhìn */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { mo(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(section);
  } else {
    /* trình duyệt cũ: cứ mở khi tải xong */
    window.addEventListener('load', mo);
  }
})();
