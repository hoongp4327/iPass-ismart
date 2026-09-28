/* =========================================================
   TRANG CHI TIẾT CHƯƠNG TRÌNH — dựng ruột trang từ dữ liệu

   Mỗi trang chuong-trinh/ipass-{n}/index.html chỉ là vỏ rỗng:
   phần <head> (title, mô tả, OG) viết tay cho từng lớp, còn
   nội dung do file này dựng từ window.IPASS_COURSES.

   Nhờ vậy nội dung 7 khoá vẫn chỉ có MỘT nguồn duy nhất là
   data/ipass-courses.js — sửa khoá học không phải mở 7 file
   HTML. Lớp nào thì đọc ở <body data-grade="n">.
   ========================================================= */

(function () {
  'use strict';

  var main = document.querySelector('.cp');
  if (!main) return;

  var DATA = window.IPASS_COURSES;
  if (!DATA || !DATA.levels) return;   /* thiếu file data thì thôi, không phá trang */

  var grade = parseInt(document.body.dataset.grade, 10);

  /* tìm khoá + cấp tương ứng với lớp của trang */
  var level = null, course = null;
  DATA.levels.forEach(function (lv) {
    lv.courses.forEach(function (c) {
      if (c.grade === grade) { level = lv; course = c; }
    });
  });
  if (!course) return;

  var c = DATA.common;

  /* ---------------------------------------------------------
     Tiện ích
     --------------------------------------------------------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function container(parent) {
    var box = el('div', 'cp-container');
    parent.appendChild(box);
    return box;
  }

  /* "Tiểu học" → "Tiếng Anh Tiểu học" */
  function levelEyebrow() {
    return 'Tiếng Anh ' + level.name;
  }

  /* khoá nào cũng có slogan dạng "vế nhấn – phần giải thích";
     tách ở gạch ngang đầu tiên để in đậm vế nhấn */
  function splitSlogan(text) {
    var i = text.indexOf('–');
    if (i === -1) return { lead: '', rest: text };
    return {
      lead: text.slice(0, i).trim(),
      rest: text.slice(i + 1).trim()
    };
  }

  /* link về trang landing, kèm ?lop=n để form chọn sẵn lớp */
  function homeUrl(hash) {
    return '../../?lop=' + grade + (hash || '');
  }

  function ctaButton() {
    var a = el('a', 'cp-cta');
    a.href = homeUrl('#dang-ky');
    a.appendChild(el('span', null, c.cta));
    a.appendChild(el('span', 'cp-cta__arrow', '→'));
    return a;
  }

  function sectionTitle(icon, text) {
    var h = el('h2', 'cp-sec__title');
    h.appendChild(el('span', 'cp-sec__icon', icon));
    h.appendChild(el('span', null, text));
    return h;
  }

  /* ---------------------------------------------------------
     HERO
     --------------------------------------------------------- */

  function buildHero() {
    var sec  = el('section', 'cp-hero');
    var box  = container(sec);
    var grid = el('div', 'cp-hero__inner');
    var copy = el('div', 'cp-hero__copy');

    copy.appendChild(el('p', 'cp-eyebrow', levelEyebrow()));

    var h1 = el('h1', 'cp-title');
    h1.appendChild(el('span', 'cp-title__brand', 'iPASS '));
    h1.appendChild(el('span', 'cp-title__num', String(grade)));
    copy.appendChild(h1);

    /* titleSuffix có dạng " – Tiếng Anh nâng điểm số" */
    copy.appendChild(el('p', 'cp-subtitle', c.titleSuffix.replace(/^\s*–\s*/, '')));

    var badge = el('p', 'cp-badge');
    badge.appendChild(el('span', null, 'Đầu ra tham chiếu:'));
    badge.appendChild(el('strong', null, level.target));
    badge.appendChild(el('span', null, '|'));
    badge.appendChild(el('span', null, 'CEFR'));
    copy.appendChild(badge);

    var parts = splitSlogan(course.slogan);
    var tag = el('p', 'cp-tagline');
    if (parts.lead) {
      tag.appendChild(el('span', 'cp-tagline__lead', parts.lead));
      tag.appendChild(el('span', null, ' – '));
    }
    tag.appendChild(el('span', null, parts.rest));
    copy.appendChild(tag);

    copy.appendChild(ctaButton());
    grid.appendChild(copy);

    /* icon tròn — dùng lại đúng 2 icon cấp học của section 04 */
    var art = el('span', 'cp-hero__art');
    var img = document.createElement('img');
    img.src = '../../assets/section4/icon-' +
              (level.id === 'thcs' ? 'trunghoc' : 'tieuhoc') + '.png';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    art.appendChild(img);
    grid.appendChild(art);

    box.appendChild(grid);
    return sec;
  }

  /* ---------------------------------------------------------
     CON SẼ HỌC GÌ?
     --------------------------------------------------------- */

  function buildTopics() {
    var sec = el('section', 'cp-sec');
    var box = container(sec);

    box.appendChild(sectionTitle('📖', c.blocks.topics.label));

    var list = el('ul', 'cp-topics');
    course.topics.forEach(function (t) {
      var li = el('li', 'cp-topic');
      li.appendChild(el('span', 'cp-topic__icon', t.icon));
      li.appendChild(el('span', 'cp-topic__text', t.text));
      list.appendChild(li);
    });
    box.appendChild(list);

    return sec;
  }

  /* ---------------------------------------------------------
     CON NHẬN ĐƯỢC GÌ?
     --------------------------------------------------------- */

  function buildBenefits() {
    var sec = el('section', 'cp-sec cp-sec--tint');
    var box = container(sec);

    box.appendChild(sectionTitle('⭐', c.blocks.benefits.label));

    var list = el('ul', 'cp-benefits');
    course.benefits.forEach(function (text, i) {
      var tone = c.benefitTones[i] || c.benefitTones[c.benefitTones.length - 1];
      var li = el('li', 'cp-benefit');
      li.appendChild(el('span', 'cp-benefit__dot cp-benefit__dot--' + tone, String(i + 1)));
      li.appendChild(el('span', 'cp-benefit__text', text));
      list.appendChild(li);
    });
    box.appendChild(list);

    return sec;
  }

  /* ---------------------------------------------------------
     PHÙ HỢP VỚI
     --------------------------------------------------------- */

  function buildFit() {
    var sec = el('section', 'cp-sec');
    var box = container(sec);

    var card = el('div', 'cp-fit');
    card.appendChild(el('span', 'cp-fit__icon', '👥'));

    var body = el('div', 'cp-fit__body');
    body.appendChild(el('h2', 'cp-fit__title', c.blocks.fit.label));
    body.appendChild(el('p', 'cp-fit__text', course.fit));
    card.appendChild(body);

    box.appendChild(card);
    return sec;
  }

  /* ---------------------------------------------------------
     KHỐI CHỐT
     --------------------------------------------------------- */

  function buildFinal() {
    var sec = el('section', 'cp-final');
    var box = container(sec);

    box.appendChild(el('h2', 'cp-final__title', 'Sẵn sàng cho chặng tiếp theo của con?'));
    box.appendChild(ctaButton());

    var back = el('a', 'cp-final__back', 'Quay lại lộ trình học');
    back.href = '../../#roadmap';
    box.appendChild(back);

    return sec;
  }

  /* ---------------------------------------------------------
     CHUYỂN NHANH SANG LỚP KHÁC
     --------------------------------------------------------- */

  function buildSiblings() {
    var sec = el('nav', 'cp-siblings');
    sec.setAttribute('aria-label', 'Các chương trình iPASS khác');
    var box = container(sec);

    box.appendChild(el('p', 'cp-siblings__title', 'Xem chương trình lớp khác'));

    var row = el('div', 'cp-siblings__row');
    DATA.levels.forEach(function (lv) {
      lv.courses.forEach(function (other) {
        var a = el('a', 'cp-sibling');
        a.href = '../ipass-' + other.grade + '/';
        a.appendChild(el('span', null, 'iPASS'));
        a.appendChild(el('b', null, String(other.grade)));
        if (other.grade === grade) {
          a.setAttribute('aria-current', 'page');
          /* đang ở chính trang này thì không cho bấm nữa */
          a.addEventListener('click', function (e) { e.preventDefault(); });
        }
        row.appendChild(a);
      });
    });
    box.appendChild(row);

    return sec;
  }

  /* ---------------------------------------------------------
     Ráp trang
     --------------------------------------------------------- */

  main.innerHTML = '';
  main.appendChild(buildHero());
  main.appendChild(buildTopics());
  main.appendChild(buildBenefits());
  main.appendChild(buildFit());
  main.appendChild(buildFinal());
  main.appendChild(buildSiblings());

  /* đường "Quay lại" ở thanh trên cũng trỏ đúng section 04 */
  var topBack = document.querySelector('.cp-back');
  if (topBack) topBack.href = '../../#roadmap';
})();
