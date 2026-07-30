/**
 * animations.js
 * Inicializa todas las animaciones del portafolio, cursor, y genera el timeline.
 */

// ─── Loader ───────────────────────────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.querySelector('.loader-bar-fill');
  if (!loader) return;

  if (bar) {
    bar.style.width = '0%';
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 15;
      if (pct >= 100) { pct = 100; clearInterval(interval); }
      bar.style.width = `${pct}%`;
    }, 90);
  }

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { loader.style.display = 'none'; }, 400);
    }
  }, 2400);
})();

// ─── Cursor personalizado ─────────────────────────────────────────────────────
(function initCursor() {
  if (window.innerWidth < 1024) return;
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    requestAnimationFrame(animate);
  }
  animate();

  const hoverTargets = 'a, button, [data-tilt], .project-card, .skill-card, .sesion-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('hovered');
  });
})();

// ─── Inicialización Post-Componentes ──────────────────────────────────────────
// Solo usar el evento components-loaded como señal principal
// El setTimeout de 600ms causaba race conditions cuando los componentes tardaban más
window.addEventListener('components-loaded', initAnimations);

let animationsInitialized = false;

function initAnimations() {
  if (animationsInitialized) return;
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('[data-reveal]', { opacity: 1 });
    animationsInitialized = true;
    return;
  }
  
  animationsInitialized = true;
  initGSAP();
  initTyped();
  initVanillaTilt();
}

// ─── Watchdog: recuperar elementos ocultos ────────────────────────────────────
// Si después de 4s algún [data-reveal] sigue con opacity 0, revelarlo
setTimeout(() => {
  const hidden = document.querySelectorAll('[data-reveal]');
  hidden.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.opacity === '0' || style.opacity === '') {
      el.style.opacity = '1';
      el.style.transition = 'opacity 0.5s ease';
    }
  });
}, 4000);

// ─── GSAP ScrollTrigger ───────────────────────────────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initRevealFallback();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const groups = document.querySelectorAll('section');
  groups.forEach(section => {
    const items = section.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    gsap.fromTo(items,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  const heroItems = document.querySelectorAll('.hero-content > *');
  if (heroItems.length) {
    gsap.fromTo(heroItems,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 2.5 }
    );
  }
  const heroVisual = document.querySelectorAll('.hero-visual');
  if (heroVisual.length) {
    gsap.fromTo(heroVisual,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.8 }
    );
  }
}

function initRevealFallback() {
  const items = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.visibility = 'visible';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
}

// ─── Re-init dinámico para contenido del CMS ─────────────────────────────────
// Cuando el CMS renderiza contenido nuevo, reiniciar tilt + watchers
window.addEventListener('portfolio-data-rendered', () => {
  if (typeof initVanillaTilt === 'function') initVanillaTilt();
  ScrollTrigger.refresh();
});

// ─── Typed.js ─────────────────────────────────────────────────────────────────
function initTyped() {
  const el = document.getElementById('typed-output');
  if (!el || typeof Typed === 'undefined') return;

  new Typed(el, {
    strings: [
      'Desarrollador Full Stack.',
      'Analista de Datos.',
      'Estudiante UNCP.',
      'Builder de Proyectos Reales.'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
  });
}

// ─── Vanilla-Tilt ─────────────────────────────────────────────────────────────
function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  VanillaTilt.init(cards, {
    max: 5,
    speed: 400,
    glare: true,
    'max-glare': 0.1,
    perspective: 1200,
  });
}
