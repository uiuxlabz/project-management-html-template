/**
 * PROMAN - Main JavaScript
 * Project Management Template
 * No frameworks - Vanilla JS only
 */

(function () {
  'use strict';

  // =========================================================================
  // Mobile Navigation Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
      this.classList.toggle('active');

      // Animate hamburger to X
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a nav link
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // =========================================================================
  // Scroll-triggered Animations (Intersection Observer)
  // =========================================================================
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // =========================================================================
  // Smooth Scroll for Anchor Links
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header')
          ? document.querySelector('.header').offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // =========================================================================
  // Header Background on Scroll
  // =========================================================================
  var header = document.querySelector('.header');

  if (header) {
    function handleHeaderScroll() {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // =========================================================================
  // Contact Form Handling
  // =========================================================================
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather form data
      var formData = new FormData(contactForm);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        showFormMessage('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  function showFormMessage(message, type) {
    // Remove existing message
    var existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    var msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = message;
    msg.style.cssText =
      'padding: 16px 20px; border-radius: 8px; margin-top: 16px; font-size: 14px; font-weight: 500;';

    if (type === 'success') {
      msg.style.background = 'rgba(16, 185, 129, 0.1)';
      msg.style.color = '#10B981';
      msg.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    } else {
      msg.style.background = 'rgba(239, 68, 68, 0.1)';
      msg.style.color = '#EF4444';
      msg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }

    contactForm.appendChild(msg);

    setTimeout(function () {
      msg.remove();
    }, 5000);
  }

  // =========================================================================
  // Counter Animation for Stats
  // =========================================================================
  function animateCounter(element, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Add suffix back
        var suffix = element.dataset.suffix || '';
        var prefix = element.dataset.prefix || '';
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var statNumbers = document.querySelectorAll('.hero-stat-number');
  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var text = el.textContent;
            var number = parseInt(text.replace(/[^0-9]/g, ''), 10);
            var suffix = text.replace(/[0-9,]/g, '');
            var prefix = text.split(/[0-9]/)[0];

            el.dataset.suffix = suffix;
            el.dataset.prefix = prefix;

            animateCounter(el, number, 2000);
            statsObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  // =========================================================================
  // Active Page Highlight
  // =========================================================================
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // =========================================================================
  // Keyboard Accessibility
  // =========================================================================
  document.addEventListener('keydown', function (e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
      var spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      menuToggle.focus();
    }
  });

})();
