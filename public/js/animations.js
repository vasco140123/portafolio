/**
 * animations.js
 * Inicializa todas las animaciones del portafolio, cursor, y genera el timeline.
 */

// ─── Generación de Sesiones Estáticas ─────────────────────────────────────────
(function generateStaticSessions() {
  const timeline = document.getElementById('timeline-estatico');
  if (!timeline) return;

  const semanasInfo = [
    { num: 1, topic: "Configuración Inicial: Servidor y Entorno (PHP, VS Code)", date: "06 - 10 abr", tags: ["XAMPP Base", "VS Code", "Intro PHP"] },
    { num: 2, topic: "Lógica Backend: Tipos, Control y Funciones", date: "13 - 17 abr", tags: ["PHP Core", "Algoritmia"] },
    { num: 3, topic: "Paradigma de Objetos: Encapsulamiento y Polimorfismo", date: "20 - 24 abr", tags: ["POO PHP", "Abstracción"] },
    { num: 4, topic: "Persistencia: Bases de Datos y Seguridad PDO", date: "27 abr - 01 may", tags: ["MySQL Server", "PDO", "SQLi Defenses"] },
    { num: 5, topic: "Arquitectura de Software: Patrón Modelo-Vista-Controlador", date: "04 - 08 may", tags: ["MVC Design", "Routing", "Despliegue"] },
    { num: 6, topic: "Gestión de Dependencias (Composer) y Endpoints API", date: "11 - 15 may", tags: ["Composer", "REST API", "JSON Format"] },
    { num: 7, topic: "Inmersión en Laravel: Rutas, Vistas y Eloquent", date: "18 - 22 may", tags: ["Laravel Framework", "Blade", "Modelado"] },
    { num: 8, topic: "Proyecto Consolidado: Evaluación Parcial", date: "25 - 29 may", tags: ["Evaluación", "Integración"] },
    { num: 9, topic: "Ecosistemas Backend: PHP frente a Java (Tomcat)", date: "02 - 06 jun", tags: ["Apache", "Java Web", "Comparativa"] },
    { num: 10, topic: "Transición a Python: Sintaxis y Paradigma", date: "09 - 13 jun", tags: ["Python 3", "Colecciones"] },
    { num: 11, topic: "Framework Django: Arquitectura MTV y ORM", date: "16 - 20 jun", tags: ["Django Base", "MTV Pattern", "ORM"] },
    { num: 12, topic: "Seguridad y Gestión: Formularios y Middlewares", date: "23 - 27 jun", tags: ["Django Forms", "Sesiones", "Middlewares"] },
    { num: 13, topic: "Construcción de APIs con Django REST Framework", date: "30 jun - 04 jul", tags: ["DRF", "Web API", "CORS/Auth"] },
    { num: 14, topic: "Despliegue Avanzado: Contenedores y Kubernetes", date: "07 - 11 jul", tags: ["Docker", "Orquestación", "Microservices"] },
    { num: 15, topic: "Cierre de Ciclo: Presentación de Proyectos RSU", date: "14 - 18 jul", tags: ["Proyecto RSU", "Sustentación"] }
  ];

  let html = '';
  semanasInfo.forEach(s => {
    const numStr = s.num < 10 ? `0${s.num}` : `${s.num}`;
    const tagsHTML = s.tags.map(t => `<span class="sesion-tag">${t}</span>`).join('');
    
    html += `
      <a href="leccion.html?semana=${s.num}" class="sesion-card" data-number="S${numStr}">
        <div class="sesion-header">
          <h3 class="sesion-title">Semana ${s.num}: ${s.topic}</h3>
          <span class="sesion-date">${s.date}</span>
        </div>
        <div class="sesion-tags">
          ${tagsHTML}
        </div>
      </a>
    `;
  });

  timeline.innerHTML = html;
})();

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
window.addEventListener('components-loaded', initAnimations);
document.addEventListener('DOMContentLoaded', () => { setTimeout(initAnimations, 600); });

let animationsInitialized = false;

function initAnimations() {
  if (animationsInitialized) return;
  
  // Respetar la preferencia del usuario por menor movimiento (Mobile Performance)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('[data-reveal]', { opacity: 1 }); // Revelar todo instantáneamente
    animationsInitialized = true;
    return;
  }
  
  animationsInitialized = true;
  initGSAP();
  initTyped();
  initVanillaTilt();
}

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
        stagger: 0.12, /* Stagger exacto requerido */
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
