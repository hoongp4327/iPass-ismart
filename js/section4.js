/* =========================================================
   SECTION 04 — LỘ TRÌNH HỌC TẬP

   Bấm 1 trong 2 thẻ cấp học → panel bên dưới đổi sang cấp đó và
   nền khung mờ chuyển theo. Trong panel có hàng chip chọn lớp;
   đổi chip thì đổi nội dung khoá.

   Nội dung lấy từ window.IPASS_COURSES (data/ipass-courses.js).

   Ghi chú lịch sử: bản trước section này bị ghim (sticky) và dùng
   độ cuộn để mờ chuyển giữa 2 thẻ — nghĩa là 2 thẻ KHÔNG bao giờ
   hiện cùng lúc. Bản này cho 2 thẻ nằm cạnh nhau làm nút chọn, nên
   hiệu ứng đổi nền chuyển từ "theo độ cuộn" sang "theo thẻ đang
   chọn". Biến --tbg vẫn giữ nguyên tên, chỉ còn nhận 0 hoặc 1.
   ========================================================= */

(function () {
  'use strict';

  var section = document.querySelector('.rm');
  if (!section) return;

  var DATA = window.IPASS_COURSES;
  if (!DATA || !DATA.levels) return;      /* thiếu file data thì thôi, không phá trang */

  var stage      = section.querySelector('.rm__stage');
  var panel      = section.querySelector('.rm__detail');
  var gradesWrap = section.querySelector('.rm__grades');
  var courseWrap = section.querySelector('.rm__course');
  var levelBtns  = Array.prototype.slice.call(section.querySelectorAll('.rm__card'));

  if (!panel || !gradesWrap || !courseWrap || !levelBtns.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* trạng thái hiện tại */
  var state = { levelId: DATA.levels[0].id, grade: DATA.levels[0].courses[0].grade };

  /* ---------------------------------------------------------
     Tiện ích
     --------------------------------------------------------- */

  function findLevel(id) {
    for (var i = 0; i < DATA.levels.length; i++) {
      if (DATA.levels[i].id === id) return DATA.levels[i];
    }
    return DATA.levels[0];
  }

  function findCourse(level, grade) {
    for (var i = 0; i < level.courses.length; i++) {
      if (level.courses[i].grade === grade) return level.courses[i];
    }
    return level.courses[0];
  }

  /* lớp nào thuộc cấp nào — dùng khi đọc deep link ?lop=n */
  function levelOfGrade(grade) {
    for (var i = 0; i < DATA.levels.length; i++) {
      for (var j = 0; j < DATA.levels[i].courses.length; j++) {
        if (DATA.levels[i].courses[j].grade === grade) return DATA.levels[i];
      }
    }
    return null;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------------------------------------------------------
     Dựng hàng chip chọn lớp
     --------------------------------------------------------- */

  function renderGrades(level) {
    gradesWrap.innerHTML = '';

    level.courses.forEach(function (course) {
      var selected = course.grade === state.grade;

      var chip = el('button', 'rm__grade' + (selected ? ' is-active' : ''));
      chip.type = 'button';
      chip.setAttribute('role', 'tab');
      chip.setAttribute('aria-selected', selected ? 'true' : 'false');
      chip.setAttribute('aria-controls', 'rm-panel');
      chip.id = 'rm-grade-' + course.grade;
      /* chỉ chip đang chọn nằm trong luồng Tab; các chip khác đi bằng ← → */
      chip.tabIndex = selected ? 0 : -1;
      chip.dataset.grade = String(course.grade);

      chip.appendChild(el('span', 'rm__grade-word', 'iPASS'));
      chip.appendChild(el('span', 'rm__grade-num', String(course.grade)));

      gradesWrap.appendChild(chip);
    });

    courseWrap.setAttribute('aria-labelledby', 'rm-grade-' + state.grade);
  }

  /* ---------------------------------------------------------
     Dựng nội dung một khoá
     --------------------------------------------------------- */

  function blockHead(tone, label) {
    var head = el('p', 'rm__block-label rm__block-label--' + tone);
    head.appendChild(el('span', 'rm__block-icon', iconFor(tone)));
    head.appendChild(el('span', null, label));
    return head;
  }

  /* icon của 3 nhãn khối — để riêng cho dễ thay bằng SVG sau này */
  function iconFor(tone) {
    if (tone === 'topics')   return '📖';
    if (tone === 'benefits') return '⭐';
    return '👥';
  }

  function renderCourse(course) {
    var c = DATA.common;
    var frag = document.createDocumentFragment();

    /* --- tên khoá + slogan --- */
    var head = el('header', 'rm__course-head');
    head.appendChild(el('h3', 'rm__course-title', course.title + c.titleSuffix));
    head.appendChild(el('p', 'rm__course-slogan', course.slogan));
    frag.appendChild(head);

    /* --- Con sẽ học gì? --- */
    var secTopics = el('div', 'rm__group');
    secTopics.appendChild(blockHead(c.blocks.topics.tone, c.blocks.topics.label));
    var topicList = el('ul', 'rm__topics');
    course.topics.forEach(function (t) {
      var li = el('li', 'rm__topic');
      li.appendChild(el('span', 'rm__topic-icon', t.icon));
      li.appendChild(el('span', 'rm__topic-text', t.text));
      topicList.appendChild(li);
    });
    secTopics.appendChild(topicList);
    frag.appendChild(secTopics);

    /* --- Con nhận được gì? --- */
    var secBenefits = el('div', 'rm__group');
    secBenefits.appendChild(blockHead(c.blocks.benefits.tone, c.blocks.benefits.label));
    var benefitList = el('ul', 'rm__benefits');
    course.benefits.forEach(function (text, i) {
      var tone = c.benefitTones[i] || c.benefitTones[c.benefitTones.length - 1];
      var li = el('li', 'rm__benefit');
      li.appendChild(el('span', 'rm__benefit-dot rm__benefit-dot--' + tone));
      li.appendChild(el('span', 'rm__benefit-text', text));
      benefitList.appendChild(li);
    });
    secBenefits.appendChild(benefitList);
    frag.appendChild(secBenefits);

    /* --- Phù hợp với --- */
    var secFit = el('div', 'rm__group');
    secFit.appendChild(blockHead(c.blocks.fit.tone, c.blocks.fit.label));
    secFit.appendChild(el('p', 'rm__fit', course.fit));
    frag.appendChild(secFit);

    /* --- CTA: cuộn tới form + chọn sẵn lớp --- */
    var cta = el('button', 'rm__cta');
    cta.type = 'button';
    cta.appendChild(el('span', null, c.cta));
    cta.appendChild(el('span', 'rm__cta-arrow', '→'));
    cta.addEventListener('click', function () { goToForm(course.grade); });
    frag.appendChild(cta);

    courseWrap.innerHTML = '';
    courseWrap.appendChild(frag);
  }

  /* ---------------------------------------------------------
     CTA → cuộn tới form đăng ký và chọn sẵn lớp
     --------------------------------------------------------- */

  function goToForm(grade) {
    var form   = document.querySelector('#dang-ky');
    var select = document.querySelector('#f-grade');

    if (select) {
      select.value = String(grade);
      /* báo cho js/form.js biết giá trị đã đổi */
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (form) {
      form.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }

  /* ---------------------------------------------------------
     Đồng bộ URL — deep link ?lop=n
     --------------------------------------------------------- */

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.set('lop', String(state.grade));
    url.hash = 'roadmap';
    window.history.replaceState(null, '', url.toString());
  }

  /* đọc ?lop=n từ cả query lẫn hash dạng "#roadmap?lop=6" */
  function gradeFromUrl() {
    var raw = new URL(window.location.href).searchParams.get('lop');

    if (!raw) {
      var h = window.location.hash;
      var q = h.indexOf('?');
      if (q > -1) {
        raw = new URLSearchParams(h.slice(q + 1)).get('lop');
      }
    }

    var n = parseInt(raw, 10);
    return isNaN(n) ? null : n;
  }

  /* ---------------------------------------------------------
     Vẽ lại panel
     --------------------------------------------------------- */

  function paint(animate) {
    var level  = findLevel(state.levelId);
    var course = findCourse(level, state.grade);

    /* trạng thái 2 thẻ cấp học */
    levelBtns.forEach(function (btn) {
      var on = btn.dataset.level === state.levelId;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });

    /* nền khung: 0 = tiểu học · 1 = trung học */
    stage.style.setProperty('--tbg', state.levelId === 'thcs' ? '1' : '0');

    renderGrades(level);

    if (animate && !reduceMotion.matches) {
      courseWrap.classList.add('is-swapping');
      /* đợi hết transition mờ-đi rồi mới thay ruột */
      window.setTimeout(function () {
        renderCourse(course);
        courseWrap.classList.remove('is-swapping');
      }, 160);
    } else {
      renderCourse(course);
    }
  }

  /* ---------------------------------------------------------
     Sự kiện
     --------------------------------------------------------- */

  /* bấm thẻ cấp học */
  levelBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.level;
      if (id === state.levelId) return;          /* bấm lại thẻ đang mở → không đóng */

      var level = findLevel(id);
      state.levelId = id;
      state.grade   = level.courses[0].grade;    /* đổi cấp → về lớp đầu tiên */

      paint(true);
      syncUrl();
      revealPanel();
    });
  });

  /* bấm chip chọn lớp */
  gradesWrap.addEventListener('click', function (e) {
    var chip = e.target.closest('.rm__grade');
    if (!chip) return;

    var grade = parseInt(chip.dataset.grade, 10);
    if (grade === state.grade) return;

    state.grade = grade;
    paint(true);
    syncUrl();
  });

  /* điều hướng chip bằng bàn phím: ← → Home End */
  gradesWrap.addEventListener('keydown', function (e) {
    var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (keys.indexOf(e.key) === -1) return;

    var chips = Array.prototype.slice.call(gradesWrap.querySelectorAll('.rm__grade'));
    var i = chips.indexOf(document.activeElement);
    if (i === -1) return;

    e.preventDefault();

    var next = i;
    if (e.key === 'ArrowLeft')  next = (i - 1 + chips.length) % chips.length;
    if (e.key === 'ArrowRight') next = (i + 1) % chips.length;
    if (e.key === 'Home')       next = 0;
    if (e.key === 'End')        next = chips.length - 1;

    state.grade = parseInt(chips[next].dataset.grade, 10);
    paint(true);
    syncUrl();
    /* renderGrades() đã dựng lại chip nên phải lấy lại phần tử rồi focus */
    var fresh = gradesWrap.querySelector('#rm-grade-' + state.grade);
    if (fresh) fresh.focus();
  });

  /* panel nằm ngoài màn hình thì kéo vào, trừ chiều cao thanh nav */
  function revealPanel() {
    var r = panel.getBoundingClientRect();
    if (r.top >= 80 && r.bottom <= window.innerHeight) return;

    var nav = document.querySelector('.nav');
    var offset = nav ? nav.offsetHeight + 12 : 84;

    window.scrollTo({
      top: r.top + window.scrollY - offset,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }

  /* ---------------------------------------------------------
     Khởi tạo
     --------------------------------------------------------- */

  var urlGrade = gradeFromUrl();
  if (urlGrade != null) {
    var lv = levelOfGrade(urlGrade);
    if (lv) {
      state.levelId = lv.id;
      state.grade   = urlGrade;
    }
  }

  paint(false);
})();
