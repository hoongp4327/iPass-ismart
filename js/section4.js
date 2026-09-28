/* =========================================================
   SECTION 04 — LỘ TRÌNH HỌC TẬP

   Section này giờ chỉ là cửa vào: 2 thẻ cấp học nằm cạnh nhau,
   mỗi thẻ có hàng link iPASS 3–9 dẫn sang trang chi tiết
   (chuong-trinh/ipass-n/) — điều hướng là việc của thẻ <a>,
   không cần JS.

   Việc duy nhất còn lại ở đây: mờ chuyển ảnh nền của khung từ
   ảnh tiểu học sang ảnh trung học theo độ cuộn, đúng như bản
   thiết kế gốc. Biến --tbg giữ nguyên tên (0 → 1).
   ========================================================= */

(function () {
  'use strict';

  var section = document.querySelector('.rm');
  if (!section) return;

  var stage = section.querySelector('.rm__stage');
  if (!stage) return;

  /* không có GSAP (CDN hỏng) thì cứ để nền tiểu học, trang vẫn dùng được */
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* matchMedia lo luôn phần prefers-reduced-motion: nhánh reduce
     không tạo trigger nào, nền đứng yên ở ảnh tiểu học */
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    gsap.to(stage, {
      '--tbg': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        end:   'bottom 58%',
        scrub: 0.6
      }
    });
  });
})();
