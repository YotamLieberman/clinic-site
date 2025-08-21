/* ======================================================
   script.js – פונקציות בסיס לאתר הדוגמה
   ====================================================== */

/* ---------- 1) הדגשת קישור פעיל בניווט ---------- */
(function setActiveNavLink() {
  const links = document.querySelectorAll('.nav-links a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.setAttribute('aria-current', 'page');
  });
})();

/* ---------- 2) גלילה חלקה לעוגנים פנימיים ---------- */
(function smoothAnchors() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('a[href^="#"]');
    if (!t) return;
    const id = t.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });
})();

/* ---------- 3) טיפול בטופס צור קשר ---------- */
(function handleContactForm() {
  const form = document.querySelector('form.form');
  if (!form) return;

  // צור אזור הודעות אם לא קיים
  let notice = document.querySelector('.form-notice');
  if (!notice) {
    notice = document.createElement('div');
    notice.className = 'form-notice';
    notice.style.margin = '16px 0 0';
    form.parentNode.insertBefore(notice, form.nextSibling);
  }

  const phoneRegex = /^0\d([- ]?\d){7,8}$/; // תבנית ישראלית בסיסית (גמישה)

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // איסוף שדות
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email'); // אופציונלי
    const message = form.querySelector('#message');

    // איפוס מצבים
    [name, phone, email, message].forEach(el => el && clearFieldState(el));
    setNotice('', '');

    // בדיקות בסיס
    let hasError = false;

    if (!name || !name.value.trim()) {
      setFieldError(name, 'נא למלא שם מלא');
      hasError = true;
    }
    if (!phone || !phone.value.trim()) {
      setFieldError(phone, 'נא למלא מספר טלפון');
      hasError = true;
    } else if (!phoneRegex.test(phone.value.trim())) {
      setFieldError(phone, 'מספר הטלפון אינו תקין');
      hasError = true;
    }
    if (email && email.value.trim()) {
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        setFieldError(email, 'כתובת אימייל לא תקינה');
        hasError = true;
      }
    }
    if (message && !message.value.trim()) {
      setFieldError(message, 'נא לכתוב הודעה קצרה');
      hasError = true;
    }

    if (hasError) {
      setNotice('יש שגיאות בטופס. תקן/ני וסמן/י שוב לשליחה.', 'error');
      return;
    }

    // סימולציית שליחה (כי אין שרת צד-אחורי)
    simulateSend()
      .then(() => {
        form.reset();
        setNotice('ההודעה נשלחה בהצלחה! נחזור אליך בהקדם 🙌', 'success');
      })
      .catch(() => {
        setNotice('אירעה תקלה בשליחה. נסו שוב בעוד רגע.', 'error');
      });
  });

  // עזיבת שדה – מסיר שגיאה ברגע שממלאים
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.matches('input, textarea, select')) {
      clearFieldState(el);
    }
  });

  function setFieldError(input, msg) {
    if (!input) return;
    input.classList.add('field-error');
    input.setAttribute('aria-invalid', 'true');

    let hint = input.parentElement.querySelector('.field-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'field-hint';
      hint.style.color = '#b91c1c';
      hint.style.fontSize = '.9rem';
      hint.style.marginTop = '6px';
      input.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
  }

  function clearFieldState(input) {
    input.classList.remove('field-error');
    input.removeAttribute('aria-invalid');
    const hint = input.parentElement.querySelector('.field-hint');
    if (hint) hint.textContent = '';
  }

  function setNotice(text, type) {
    notice.textContent = text;
    notice.style.padding = text ? '12px 14px' : '0';
    notice.style.borderRadius = '12px';
    notice.style.border = '1px solid transparent';
    notice.style.background = type === 'success' ? '#ecfeff' : type === 'error' ? '#fff1f2' : 'transparent';
    notice.style.color = type === 'success' ? '#075985' : type === 'error' ? '#7f1d1d' : 'inherit';
    notice.style.borderColor = type === 'success' ? '#bae6fd' : type === 'error' ? '#fecdd3' : 'transparent';
  }

  function simulateSend() {
    // כאן אפשר לשלב שירות חיצוני (Formspree/Netlify Forms) במקום סימולציה
    return new Promise((resolve, reject) => {
      setNotice('שולח…', '');
      setTimeout(() => {
        // 90% הצלחה
        Math.random() < 0.9 ? resolve() : reject();
      }, 800);
    });
  }
})();

/* ---------- 4) עיצוב קטן לשדות שגיאה (fallback אם CSS לא כולל) ---------- */
(function injectMinimalErrorStyles() {
  const css = `
    .field-error { border-color: #fecaca !important; box-shadow: 0 0 0 3px rgba(248,113,113,.15) !important; }
  `;
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
})();
