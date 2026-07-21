/**
 * lessonManager.js
 * Gestiona la página leccion.html:
 *  1. Lee el parámetro ?semana=X de la URL.
 *  2. Hace un fetch al archivo public/md/semanaX.md.
 *  3. Parsea el Markdown con Marked.js y lo inyecta en el DOM.
 *  4. Configura los botones de paginación (Anterior / Siguiente).
 *  5. Carga el navbar via includeComponents.
 */

const TOTAL_SEMANAS_DEFAULT = 15;

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar navbar
  await loadNavbarComponent();
  setupNavbarScroll();
  initLeccion();
});

async function loadNavbarComponent() {
  const container = document.querySelector('[data-component="navbar"]');
  if (!container) return;
  try {
    const res = await fetch('components/navbar.html');
    if (!res.ok) return;
    container.innerHTML = (await res.text()).replace(/\r/g, '').trim();
  } catch (e) {
    console.warn('[lessonManager] No se pudo cargar el navbar:', e.message);
  }
}

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = document.getElementById('navbar-toggle');
  const navLinks = document.getElementById('navbar-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
    });
  }
}

async function initLeccion() {
  const contentEl = document.getElementById('leccion-content');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const weekLabel = document.getElementById('leccion-week-label');
  const progressEl = document.getElementById('leccion-progress');

  // 1. Leer el parámetro de semana desde la URL
  const params = new URLSearchParams(window.location.search);
  let semana = parseInt(params.get('semana'), 10);

  // Validar y sanitizar
  const totalSemanas = getTotalSemanas();
  if (isNaN(semana) || semana < 1 || semana > totalSemanas) {
    semana = 1;
  }

  // Actualizar etiqueta de semana
  if (weekLabel) weekLabel.textContent = `Semana ${semana}`;
  if (progressEl) progressEl.textContent = `${semana} / ${totalSemanas}`;
  document.title = `Semana ${semana} | Bitácora de Clases — Vasco Qori`;

  // 2. Configurar botones de paginación
  if (btnAnterior) {
    if (semana <= 1) {
      btnAnterior.disabled = true;
      btnAnterior.classList.add('disabled');
    } else {
      btnAnterior.addEventListener('click', () => {
        window.location.search = `?semana=${semana - 1}`;
      });
    }
  }

  if (btnSiguiente) {
    if (semana >= totalSemanas) {
      btnSiguiente.disabled = true;
      btnSiguiente.classList.add('disabled');
    } else {
      btnSiguiente.addEventListener('click', () => {
        window.location.search = `?semana=${semana + 1}`;
      });
    }
  }

  // 3. Fetch del archivo Markdown
  if (!contentEl) return;
  try {
    const response = await fetch(`public/md/semana${semana}.md`);
    if (!response.ok) throw new Error(`El archivo semana${semana}.md no está disponible.`);

    const markdownText = await response.text();

    // 4. Verificar que Marked.js esté disponible y parsear
    if (typeof window.marked === 'undefined') {
      throw new Error('La librería Marked.js no se cargó correctamente.');
    }

    // Configurar Marked para seguridad básica
    window.marked.setOptions({
      breaks: true,
      gfm: true,
    });

    contentEl.innerHTML = window.marked.parse(markdownText);

    // 5. Aplicar highlight a los bloques de código si Highlight.js está disponible
    if (typeof window.hljs !== 'undefined') {
      contentEl.querySelectorAll('pre code').forEach(block => {
        window.hljs.highlightElement(block);
      });
    }

  } catch (error) {
    console.error(`[lessonManager] ${error.message}`);
    contentEl.innerHTML = `
      <div class="leccion-error" role="alert">
        <h2>Contenido no disponible</h2>
        <p>No se pudieron cargar los apuntes de la semana ${semana}.</p>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem;">${error.message}</p>
        <a href="index.html">← Volver al Portafolio</a>
      </div>`;
  }
}

/**
 * Devuelve el total de semanas disponibles.
 * Puede actualizarse si hay semanas extras guardadas en localStorage via el CRUD.
 */
function getTotalSemanas() {
  // Incluir semanas dinámicas del CRUD si existen
  const dynamic = JSON.parse(localStorage.getItem('portfolio.sesiones') || '[]');
  const maxDynamic = dynamic.reduce((max, s) => {
    const n = parseInt(s.semana, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return Math.max(TOTAL_SEMANAS_DEFAULT, maxDynamic);
}
