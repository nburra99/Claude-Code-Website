/* ============================================================
   Meridian Tutoring — script.js
   Vanilla JS. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileNav.hidden = open;
    });

    // Close after tapping a link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        mobileNav.hidden = true;
      });
    });

    // Reset on resize back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .subject-card, .step, .tutor-card, .price-card, .quote, .faq details, .book-form, .book-copy'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- FAQ: only one open at a time ---------- */
  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Booking form validation ---------- */
  var form = document.getElementById('bookForm');
  var success = document.getElementById('formSuccess');

  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var setError = function (name, message) {
      var field = form.querySelector('[name="' + name + '"]');
      var slot = form.querySelector('.field-error[data-for="' + name + '"]');
      if (!field) return;
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('has-error', Boolean(message));
      if (slot) slot.textContent = message || '';
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    };

    var validate = function () {
      var errors = 0;

      var name = form.parentName.value.trim();
      if (name.length < 2) { setError('parentName', 'Please enter your name.'); errors++; }
      else setError('parentName', '');

      var email = form.email.value.trim();
      if (!email) { setError('email', 'Please enter your email.'); errors++; }
      else if (!emailRe.test(email)) { setError('email', 'That email doesn\u2019t look right.'); errors++; }
      else setError('email', '');

      if (!form.subject.value) { setError('subject', 'Pick a subject.'); errors++; }
      else setError('subject', '');

      if (!form.grade.value) { setError('grade', 'Pick a grade.'); errors++; }
      else setError('grade', '');

      return errors;
    };

    // Clear an error as soon as the student fixes the field
    ['parentName', 'email', 'subject', 'grade'].forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      var evt = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(evt, function () {
        var slot = form.querySelector('.field-error[data-for="' + name + '"]');
        var wrap = field.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) {
          wrap.classList.remove('has-error');
          if (slot) slot.textContent = '';
          field.removeAttribute('aria-invalid');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var errors = validate();
      if (errors > 0) {
        var firstBad = form.querySelector('.field.has-error input, .field.has-error select');
        if (firstBad) firstBad.focus();
        if (success) success.hidden = true;
        return;
      }

      var btn = document.getElementById('submitBtn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending\u2026';
      }

      // Demo only: no backend wired up.
      window.setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Request free trial';
        }
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
      }, 700);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Smooth anchor fallback for older browsers ---------- */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo(0, target.getBoundingClientRect().top + window.pageYOffset - 88);
      });
    });
  }
})();
