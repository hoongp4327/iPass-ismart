/* =========================================================
   SECTION 04 — điều khiển hiệu ứng theo độ cuộn
   Section được ghim (sticky). Độ cuộn trong quãng "runway"
   được quy về p = 0 → 1, rồi tách thành 3 mốc:
     --tbg   : nền TIỂU HỌC  →  nền TRUNG HỌC
     --tfade : thẻ kem (TIỂU HỌC) mờ dần rồi biến mất
     --tcard : thẻ xanh (TRUNG HỌC) dâng từ dưới lên

   Nhịp được đẩy sớm và rút ngắn để chỉ cần cuộn một đoạn ngắn
   là nền đã đổi và thẻ đã hiện — quãng cuộn (--runway trong
   section4.css) cũng giảm còn chưa tới một nửa so với trước.
   tfade chạy hơi sớm hơn tcard: thẻ cũ nhạt đi trước, thẻ mới
   dâng lên sau, tránh hai thẻ chồng chữ lên nhau ở giữa chặng.
   ========================================================= */

(function () {
  'use strict';

  var section = document.querySelector('.rm');
  if (!section) return;

  var stage  = section.querySelector('.rm__stage');
  var cardA  = section.querySelector('.rm__card--a');
  var cardB  = section.querySelector('.rm__card--b');

  /* làm mềm 2 đầu đoạn chuyển, tránh giật khi bắt đầu / kết thúc */
  function smoothstep(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t * t * (3 - 2 * t);
  }

  /* quy đoạn [a,b] của p về 0→1 */
  function phase(p, a, b) {
    return smoothstep((p - a) / (b - a));
  }

  var lastB = null;
  var ticking = false;

  function render() {
    ticking = false;

    var rect  = section.getBoundingClientRect();
    var track = rect.height - stage.offsetHeight;   // quãng cuộn thực
    var p     = track <= 0 ? 0 : -rect.top / track;
    p = p < 0 ? 0 : p > 1 ? 1 : p;

    var tbg   = phase(p, 0.04, 0.34);   // nền đổi gần như ngay khi bắt đầu
    var tfade = phase(p, 0.16, 0.46);   // thẻ kem mờ đi
    var tcard = phase(p, 0.22, 0.56);   // thẻ xanh dâng lên, kết thúc sớm

    stage.style.setProperty('--tbg', tbg.toFixed(4));
    stage.style.setProperty('--tfade', tfade.toFixed(4));
    stage.style.setProperty('--tcard', tcard.toFixed(4));

    /* thẻ nào đang hiển thị thì thẻ đó được đọc bởi trình đọc màn hình */
    var showB = tcard > 0.5;
    if (showB !== lastB) {
      lastB = showB;
      cardA.setAttribute('aria-hidden', showB ? 'true' : 'false');
      cardB.setAttribute('aria-hidden', showB ? 'false' : 'true');
    }
  }

  function onScroll() {
    /* tab đang ẩn thì requestAnimationFrame không chạy —
       tính thẳng để trạng thái không bị treo ở giá trị cũ */
    if (document.hidden) { render(); return; }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', render);
  /* quay lại tab sau khi đã cuộn ở nơi khác → vẽ lại cho khớp */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) render();
  });
  window.addEventListener('pageshow', render);
  render();
})();
