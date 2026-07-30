/**
 * cmsManager.js
 * Gestión del CMS Local, GitHub API y Exportación JSON.
 */

const CMS_STORAGE_KEY = 'portfolio.cms.data';
let globalData = null;

window.addEventListener('components-loaded', initCMS);
document.addEventListener('DOMContentLoaded', () => { setTimeout(initCMS, 600); });

async function initCMS() {
  if (globalData) return; // Ya inicializado
  
  // 1. Cargar datos (Local Storage o data.json fallback)
  const localData = localStorage.getItem(CMS_STORAGE_KEY);
  if (localData) {
    globalData = JSON.parse(localData);
  } else {
    try {
      const res = await fetch('public/js/data.json');
      globalData = await res.json();
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(globalData));
    } catch (e) {
      console.error("No se pudo cargar data.json", e);
      return;
    }
  }

  renderPortfolioData();
  bindCMSEvents();
}

// ─── RENDERIZAR DATOS EN EL PORTAFOLIO ────────────────────────────────────────
function renderPortfolioData() {
  if (!globalData) return;

  // Render Bio
  const bioContainer = document.querySelector('.item-bio .about-text-card p');
  if (bioContainer && globalData.bio) {
    const ps = globalData.bio.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
    const card = document.querySelector('.item-bio .about-text-card');
    const h3 = card.querySelector('h3');
    const socials = card.querySelector('.about-socials');
    
    // Preservar Información Académica — buscar en el DOM actual o reconstruir
    let academic = card.querySelector('.about-academic');
    if (!academic) {
      // Si no se encontró (timing de carga), reconstruir el bloque completo
      academic = document.createElement('div');
      academic.className = 'about-academic';
      academic.innerHTML = `
        <h4>Información Académica</h4>
        <ul>
          <li><span>Asignatura:</span> Desarrollo de Aplicaciones Web (IS093A)</li>
          <li><span>Institución:</span> UNCP - Facultad de Ingeniería de Sistemas</li>
          <li><span>Docente Principal:</span> Dr. Jaime Suasnabar Terrel</li>
          <li><span>Jefe de Práctica:</span> Mg. Miguel Aguilar Coronación</li>
          <li><span>Ubicación Temporal:</span> Consolidado 2 (Ciclo IX)</li>
        </ul>
      `;
    }
    
    card.innerHTML = '';
    if(h3) card.appendChild(h3);
    card.insertAdjacentHTML('beforeend', ps);
    card.appendChild(academic);
    if(socials) card.appendChild(socials);
  }

  // Render Projects
  const projContainer = document.querySelector('.bento-grid');
  if (projContainer && globalData.projects) {
    projContainer.innerHTML = '';
    globalData.projects.forEach((proj, idx) => {
      const tags = proj.tags.map(t => t).join(', ');
      projContainer.innerHTML += `
        <div class="magic-bento-card magic-bento-card--border-glow" style="background-color:#120F17;--glow-color:163,230,53">
          <div class="magic-bento-card__header">
            <div class="magic-bento-card__label">${escapeHtml(tags)}</div>
          </div>
          <div class="magic-bento-card__content">
            <h2 class="magic-bento-card__title">${escapeHtml(proj.title)}</h2>
            <p class="magic-bento-card__description">${escapeHtml(proj.description)}</p>
            <div class="magic-bento-card__tech">Ver Codigo ↗</div>
          </div>
          <a href="${proj.repoUrl}" target="_blank" class="magic-bento-card__link" aria-label="${escapeHtml(proj.title)} GitHub"></a>
        </div>
      `;
    });
    // Re-init MagicBento on CMS-rendered cards
    window.dispatchEvent(new Event('portfolio-data-rendered'));
  }

  // Render Certifications (Bento)
  const certContainer = document.getElementById('certifications-grid');
  if (certContainer && globalData.certifications) {
    certContainer.innerHTML = '';
    globalData.certifications.forEach((cert) => {
      const onClickAttr = cert.url ? `onclick="window.open('${escapeHtml(cert.url)}', '_blank')"` : '';
      certContainer.innerHTML += `
        <div class="magic-bento-card magic-bento-card--border-glow" style="--glow-color:6,182,212" ${onClickAttr}>
          <div class="magic-bento-card__header">
            <div class="magic-bento-card__label">${cert.year} · ${escapeHtml(cert.platform)}</div>
          </div>
          <div class="magic-bento-card__content">
            <h2 class="magic-bento-card__title">${escapeHtml(cert.title)}</h2>
            ${cert.description ? `<p class="magic-bento-card__description">${escapeHtml(cert.description)}</p>` : ''}
          </div>
        </div>
      `;
    });
    // Re-init MagicBento on CMS-rendered cards
    window.dispatchEvent(new Event('portfolio-data-rendered'));
  }

  // Actualizar Stats
  const statProjects = document.querySelectorAll('.stat-value');
  if (statProjects.length >= 3) {
    // 0 = Ciclo (no cambia acá), 1 = Semanas, 2 = Proyectos Reales
    statProjects[2].textContent = globalData.projects ? globalData.projects.length + '+' : '0';
  }

  // Render Admin Lists
  renderAdminLists();

  // Refrescar GSAP y notificar a animations.js que el DOM cambió
  setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    window.dispatchEvent(new Event('portfolio-data-rendered'));
  }, 100);
}

function saveData() {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(globalData));
  renderPortfolioData();
  
  // Re-inicializar animaciones para los elementos nuevos
  if(typeof initVanillaTilt === 'function') initVanillaTilt();
}

// ─── ADMIN PANEL EVENTS ───────────────────────────────────────────────────────
function bindCMSEvents() {
  // Abrir Modal de Clave
  const btnOpen = document.getElementById('btn-open-cms');
  const authModal = document.getElementById('cms-auth-modal');
  const authForm = document.getElementById('cms-auth-form');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const overlay = document.getElementById('cms-dashboard');
  const btnCloseDashboard = document.getElementById('btn-close-dashboard');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      authModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (btnCloseAuth) {
    btnCloseAuth.addEventListener('click', () => {
      authModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd = document.getElementById('cms-password').value;
      if (pwd === 'uncp2025' || pwd === 'admin') { // Clave maestra
        authModal.classList.remove('open');
        overlay.classList.add('open');
        initAdminDashboard();
      } else {
        alert('Contraseña incorrecta');
      }
      document.getElementById('cms-password').value = '';
    });
  }

  if (btnCloseDashboard) {
    btnCloseDashboard.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Tabs Logic (PillNav style)
  document.querySelectorAll('.cms-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cms-pill').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Export JSON
  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const dataStr = JSON.stringify(globalData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Guardar Bio
  const btnSaveBio = document.getElementById('btn-save-bio');
  if (btnSaveBio) {
    btnSaveBio.addEventListener('click', () => {
      globalData.bio = document.getElementById('cms-bio-text').value;
      saveData();
      alert("Biografía actualizada");
    });
  }

  // GitHub Fetch
  const btnFetchGit = document.getElementById('btn-fetch-github');
  if (btnFetchGit) {
    btnFetchGit.addEventListener('click', fetchGitHubRepo);
  }

  // Add Cert
  const btnAddCert = document.getElementById('btn-add-cert');
  if (btnAddCert) {
    btnAddCert.addEventListener('click', addCert);
  }

}

function initAdminDashboard() {
  document.getElementById('cms-bio-text').value = globalData.bio || '';
  renderAdminLists();
  if (typeof window.initCmsPills === 'function') {
    setTimeout(window.initCmsPills, 100);
  }
}

function renderAdminLists() {
  // Proyectos
  const pList = document.getElementById('cms-projects-list');
  if (pList) {
    pList.innerHTML = globalData.projects.map(p => `
      <div class="cms-list-item">
        <div>
          <h5>${escapeHtml(p.title)}</h5>
          <p>${escapeHtml(p.description.substring(0, 50))}...</p>
        </div>
        <div class="cms-item-actions">
          <button onclick="removeProject('${p.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  }

  // Certs
  const cList = document.getElementById('cms-certs-list');
  if (cList) {
    cList.innerHTML = globalData.certifications.map(c => `
      <div class="cms-list-item">
        <div>
          <h5>${escapeHtml(c.title)}</h5>
          <p>${c.year} - ${escapeHtml(c.platform)}</p>
        </div>
        <div class="cms-item-actions">
          <button onclick="removeCert('${c.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  }
}

// ─── GITHUB API ───────────────────────────────────────────────────────────────
async function fetchGitHubRepo() {
  const urlInput = document.getElementById('cms-github-url').value.trim();
  const statusEl = document.getElementById('github-status');
  
  if (!urlInput.includes('github.com/')) {
    statusEl.textContent = 'URL inválida. Usa formato https://github.com/usuario/repo';
    return;
  }

  // Limpiar URL por si tiene slashes finales o .git
  const cleanUrl = urlInput.replace(/\.git$/, '').replace(/\/$/, '');
  const parts = cleanUrl.split('github.com/')[1].split('/');
  const user = parts[0];
  const repo = parts[1];

  if (!user || !repo) {
    statusEl.textContent = 'Estructura inválida. Debe ser usuario/repo.';
    return;
  }

  statusEl.textContent = 'Consultando GitHub...';
  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Repositorio no encontrado. ¿Es privado o está mal escrito?');
      } else if (res.status === 403) {
        throw new Error('Límite de API de GitHub excedido (espera 1 hora).');
      } else {
        throw new Error(`Error HTTP: ${res.status}`);
      }
    }
    
    const data = await res.json();
    
    // Obtener lenguajes para tags
    let tags = [];
    if (data.language) tags.push(data.language);

    globalData.projects.push({
      id: `proj-${Date.now()}`,
      repoUrl: cleanUrl,
      title: data.name.replace(/-/g, ' '),
      description: data.description || 'Sin descripción en GitHub.',
      tags: tags,
      size: 'normal'
    });
    
    saveData();
    statusEl.textContent = `¡Proyecto "${data.name}" añadido exitosamente!`;
    document.getElementById('cms-github-url').value = '';
  } catch (e) {
    statusEl.textContent = 'Error: ' + e.message;
  }
}

// ─── CRUD Funciones ───────────────────────────────────────────────────────────
function addCert() {
  const title = document.getElementById('cert-title').value.trim();
  const platform = document.getElementById('cert-platform').value.trim();
  const year = document.getElementById('cert-year').value.trim();
  const desc = document.getElementById('cert-desc').value.trim();
  const url = document.getElementById('cert-url').value.trim();

  if(!title || !platform || !year) {
    alert("Título, Plataforma y Año son obligatorios.");
    return;
  }

  const nextIdx = globalData.certifications.length;
  const size = (nextIdx % 3 === 0) ? 'horizontal' : 'normal';

  globalData.certifications.push({
    id: `cert-${Date.now()}`,
    year, platform, title, description: desc, url, size
  });

  saveData();
  document.getElementById('cert-title').value = '';
  document.getElementById('cert-platform').value = '';
  document.getElementById('cert-year').value = '';
  document.getElementById('cert-desc').value = '';
  document.getElementById('cert-url').value = '';
}

window.removeProject = function(id) {
  if(!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
  globalData.projects = globalData.projects.filter(p => p.id !== id);
  saveData();
};

window.removeCert = function(id) {
  if(!confirm("¿Seguro que deseas eliminar este certificado?")) return;
  globalData.certifications = globalData.certifications.filter(c => c.id !== id);
  saveData();
};

function escapeHtml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
