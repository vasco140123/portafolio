/**
 * pillnav.js
 * PillNav — port vanilla JS del componente React de React Bits.
 * Requiere GSAP (ya cargado en el portafolio).
 */
(function () {
  'use strict';

  // ── Config ──
  var ease = 'power3.easeOut';
  var baseColor = '#050810';
  var pillColor = '#8b5cf6';
  var hoveredPillTextColor = '#ffffff';
  var pillTextColor = '#ffffff';

  // ── State ──
  var circleRefs = [];
  var tlRefs = [];
  var activeTweenRefs = [];
  var isMobileMenuOpen = false;

  // ── Init ──
  function initPillNav() {
    if (typeof gsap === 'undefined') {
      console.warn('[PillNav] GSAP no disponible');
      return;
    }

    var container = document.querySelector('.pill-nav-container');
    if (!container) return;

    var pills = container.querySelectorAll('.pill');
    var circles = container.querySelectorAll('.hover-circle');
    var hamburger = container.querySelector('.mobile-menu-button');
    var mobileMenu = container.querySelector('.mobile-menu-popover');
    var navItems = container.querySelector('.pill-nav-items');
    var logo = container.querySelector('.pill-logo');

    // Store refs
    circleRefs = Array.from(circles);

    // Layout circles
    layoutCircles();

    // Initial load animation
    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, { scale: 1, duration: 0.6, ease: ease });
    }
    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease: ease });
    }

    // Hamburger click
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        toggleMobileMenu();
      });
    }

    // Hover events on pills
    pills.forEach(function (pill, i) {
      pill.addEventListener('mouseenter', function () { handleEnter(i); });
      pill.addEventListener('mouseleave', function () { handleLeave(i); });
    });

    // Mobile menu links — close on click
    var mobileLinks = container.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        isMobileMenuOpen = false;
        if (mobileMenu) {
          gsap.to(mobileMenu, {
            opacity: 0, y: 10, duration: 0.2, ease: ease,
            onComplete: function () { gsap.set(mobileMenu, { visibility: 'hidden' }); }
          });
        }
      });
    });

    // Resize handler
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(layoutCircles, 100);
    });

    // Logo hover — rotate
    if (logo) {
      logo.addEventListener('mouseenter', function () {
        var img = logo.querySelector('img') || logo.querySelector('span');
        if (img) {
          gsap.to(img, { rotation: 360, duration: 0.4, ease: ease, overwrite: 'auto' });
        }
      });
    }
  }

  function layoutCircles() {
    circleRefs.forEach(function (circle) {
      if (!circle || !circle.parentElement) return;
      var pill = circle.parentElement;
      var rect = pill.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      var R = ((w * w) / 4 + h * h) / (2 * h);
      var D = Math.ceil(2 * R) + 2;
      var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      var originY = D - delta;

      circle.style.width = D + 'px';
      circle.style.height = D + 'px';
      circle.style.bottom = '-' + delta + 'px';

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: '50% ' + originY + 'px'
      });

      var label = pill.querySelector('.pill-label');
      var white = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      var index = circleRefs.indexOf(circle);
      if (index === -1) return;

      tlRefs[index] && tlRefs[index].kill();
      var tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: ease, overwrite: 'auto' }, 0);
      if (label) {
        tl.to(label, { y: -(h + 8), duration: 2, ease: ease, overwrite: 'auto' }, 0);
      }
      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 2, ease: ease, overwrite: 'auto' }, 0);
      }

      tlRefs[index] = tl;
    });
  }

  function handleEnter(i) {
    var tl = tlRefs[i];
    if (!tl) return;
    activeTweenRefs[i] && activeTweenRefs[i].kill();
    activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3, ease: ease, overwrite: 'auto'
    });
  }

  function handleLeave(i) {
    var tl = tlRefs[i];
    if (!tl) return;
    activeTweenRefs[i] && activeTweenRefs[i].kill();
    activeTweenRefs[i] = tl.tweenTo(0, {
      duration: 0.2, ease: ease, overwrite: 'auto'
    });
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    var container = document.querySelector('.pill-nav-container');
    var hamburger = container.querySelector('.mobile-menu-button');
    var mobileMenu = container.querySelector('.mobile-menu-popover');

    if (hamburger) {
      var lines = hamburger.querySelectorAll('.hamburger-line');
      if (isMobileMenuOpen) {
        gsap.to(lines[0], { rotation: 45, y: 4, duration: 0.3, ease: ease });
        gsap.to(lines[1], { rotation: -45, y: -4, duration: 0.3, ease: ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: ease });
      }
    }

    if (mobileMenu) {
      if (isMobileMenuOpen) {
        gsap.set(mobileMenu, { visibility: 'visible' });
        gsap.fromTo(mobileMenu,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: ease, transformOrigin: 'top center' }
        );
      } else {
        gsap.to(mobileMenu, {
          opacity: 0, y: 10, duration: 0.2, ease: ease, transformOrigin: 'top center',
          onComplete: function () { gsap.set(mobileMenu, { visibility: 'hidden' }); }
        });
      }
    }
  }

  // ── Expose init for component loader ──
  window.initPillNav = initPillNav;
})();
