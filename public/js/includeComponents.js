/**
 * includeComponents.js
 * Carga cada componente HTML de forma asíncrona e inyecta su contenido
 * en el elemento contenedor que tenga el atributo data-component="nombre".
 */

document.addEventListener('DOMContentLoaded', () => {
  loadAllComponents().then(() => {
    // Una vez cargados todos los componentes, inicializar la SPA
    setupNavbar();
    setupSPARouter();
    window.dispatchEvent(new Event('components-loaded'));
  });
});

async function loadAllComponents() {
  const containers = document.querySelectorAll('[data-component]');
  for (const container of containers) {
    const name = container.getAttribute('data-component');
    try {
      const response = await fetch(`components/${name}.html`);
      if (!response.ok) throw new Error(`No se encontró components/${name}.html`);
      const html = await response.text();
      container.innerHTML = html.replace(/\r/g, '').trim();
    } catch (err) {
      console.error(`[ComponentLoader] ${err.message}`);
      container.innerHTML = `<p style="color:#f87171;padding:1rem;text-align:center;">
        Error cargando el componente "${name}"</p>`;
    }
  }
}

/**
 * Configura el comportamiento del Navbar:
 * - Clase "scrolled" al hacer scroll
 * - Hamburger toggle en mobile
 * - Marcado de link activo al hacer scroll entre secciones
 */
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbar-toggle');
  const navLinks = document.getElementById('navbar-links');
  if (!navbar) return;

  // Efecto scroll
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateProgressBar();
    updateActiveNavLink();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar al hacer click en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Progress bar de scroll
  updateProgressBar();
}

function updateProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = `${(scrollTop / docHeight) * 100}%`;
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#navbar-links a[href^="#"]');
  let currentId = '';
  sections.forEach(sec => {
    if (window.scrollY + 100 >= sec.offsetTop) currentId = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}

/**
 * SPA Router: alterna visibilidad entre el portafolio y el módulo de sesiones
 * cuando el usuario hace clic en el link de sesiones.
 */
function setupSPARouter() {
  // El router de sesiones está gestionado por crudManager.js y lessonManager.js
  // Este módulo solo maneja la navegación suave entre secciones del index
  const navLinks = document.querySelectorAll('#navbar-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
