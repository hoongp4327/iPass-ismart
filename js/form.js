/* =========================================================
   FORM ĐĂNG KÝ TƯ VẤN — validation + gửi Google Sheets
   Cùng cơ chế với Global Achievers và Young Explorers.
   ========================================================= */

(function () {
  'use strict';

  var form = document.getElementById('ipassForm');
  if (!form) return;

  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  var statusBox = form.querySelector('.cta__status');
  var submitBtn = form.querySelector('.cta__submit');
  var REF_STORAGE_KEY = 'ismartIpassReferralCode';
  var REF_PATTERN = /^[a-z0-9_-]{2,40}$/;
  var PHONE_RE = /^(?:\+?84|0)\d{8,10}$/;

  function captureReferralCode() {
    var incomingRef = (new URLSearchParams(window.location.search).get('ref') || '')
      .trim()
      .toLowerCase();

    try {
      var savedRef = (window.localStorage.getItem(REF_STORAGE_KEY) || '')
        .trim()
        .toLowerCase();

      if (savedRef === 'direct') savedRef = '';

      // First-touch: chỉ lưu mã giới thiệu hợp lệ đầu tiên.
      if (!REF_PATTERN.test(savedRef) && REF_PATTERN.test(incomingRef)) {
        window.localStorage.setItem(REF_STORAGE_KEY, incomingRef);
        savedRef = incomingRef;
      }

      return REF_PATTERN.test(savedRef) ? savedRef : 'direct';
    } catch (error) {
      return REF_PATTERN.test(incomingRef) ? incomingRef : 'direct';
    }
  }

  form.elements.refCode.value = captureReferralCode();

  function setError(field, message) {
    var input = field.querySelector('.cta__input, .cta__select, .cta__textarea');
    var slot = field.querySelector('.cta__error');

    if (slot) slot.textContent = message || '';
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    return !message;
  }

  function validate() {
    var ok = true;
    var nameField = form.querySelector('[data-field="name"]');
    var phoneField = form.querySelector('[data-field="phone"]');
    var name = nameField.querySelector('input').value.trim();
    var phone = phoneField.querySelector('input').value.replace(/[^\d+]/g, '');

    ok = setError(
      nameField,
      name.length < 2 ? 'Vui lòng nhập họ tên phụ huynh.' : ''
    ) && ok;

    ok = setError(
      phoneField,
      !phone
        ? 'Vui lòng nhập số điện thoại.'
        : (!PHONE_RE.test(phone) ? 'Số điện thoại chưa đúng định dạng (VD: 0901234567).' : '')
    ) && ok;

    return ok;
  }

  function clearStatus() {
    statusBox.className = 'cta__status';
    statusBox.textContent = '';
  }

  function say(kind, message) {
    statusBox.className = 'cta__status cta__status--' + kind;
    statusBox.textContent = message;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearStatus();

    if (!validate()) {
      say('err', 'Vui lòng kiểm tra lại các ô còn thiếu hoặc chưa đúng.');
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/[a-z0-9_-]+\/exec(?:\?.*)?$/i.test(endpoint)) {
      say('err', 'Form đang chờ cấu hình đường dẫn Google Apps Script /exec.');
      return;
    }

    var originalButtonHtml = submitBtn.innerHTML;
    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () {
      controller.abort();
    }, 15000);

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.textContent = 'Đang gửi thông tin...';

    var formData = new FormData(form);
    formData.set('refCode', captureReferralCode());
    formData.append('pageUrl', window.location.href);
    formData.append('submittedAt', new Date().toISOString());

    fetch(endpoint, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      signal: controller.signal
    })
      .then(function () {
        form.reset();
        form.elements.refCode.value = captureReferralCode();
        say('ok', 'Đã gửi thông tin thành công. iPass sẽ liên hệ với ba mẹ trong thời gian sớm nhất.');
      })
      .catch(function (error) {
        say(
          'err',
          error.name === 'AbortError'
            ? 'Kết nối đang chậm. Ba mẹ vui lòng thử gửi lại.'
            : 'Gửi chưa thành công. Ba mẹ vui lòng kiểm tra kết nối và thử lại.'
        );
      })
      .finally(function () {
        window.clearTimeout(timeoutId);
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.innerHTML = originalButtonHtml;
      });
  });

  // Khi người dùng sửa ô lỗi, xoá cảnh báo của riêng ô đó.
  form.addEventListener('input', function (event) {
    var field = event.target.closest('[data-field]');
    if (field && event.target.getAttribute('aria-invalid') === 'true') {
      setError(field, '');
    }
  });
})();
