/* =========================================================
   Twista Dela Aprillia — Portfolio Interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Theme Toggle (dark / light) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var STORAGE_KEY = 'twista-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode */ }
  }

  function getInitialTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* ignore */ }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(current);
    });
  }

  /* ---------- Navbar shadow on scroll ---------- */
  var navbar = document.getElementById('navbar');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 8) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll Spy (active nav link) ---------- */
  var sections = ['beranda', 'projek', 'keahlian', 'tentang'];
  var navAnchors = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('.nav-link')) : [];

  function setActiveLink(id) {
    navAnchors.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && navAnchors.length) {
    var visibleMap = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibleMap[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      var bestId = null;
      var bestRatio = 0;
      sections.forEach(function (id) {
        var ratio = visibleMap[id] || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId) setActiveLink(bestId);
    }, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: [0, 0.1, 0.5, 1]
    });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ---------- Smooth anchor offset fallback ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', id);
        }
      }
    });
  });

  /* ---------- Reveal on scroll (subtle) ---------- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.card, .project-card').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.22s, box-shadow 0.22s';
      revealObserver.observe(el);
    });
  }
})();
