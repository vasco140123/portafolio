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
      const tetris = ['feature', 'normal', 'vertical', 'normal', 'horizontal', 'normal'];
      const sizeCls = tetris[idx % tetris.length];
      const cls = idx === 0 ? 'feature' : sizeCls;
      const tags = proj.tags.map(t => `<span class="bento-tag">${t}</span>`).join('');
      projContainer.innerHTML += `
        <article class="bento-card ${cls !== 'normal' ? cls : ''}" data-tilt>
          <div class="bento-content">
            <h3 class="bento-title">${escapeHtml(proj.title)}</h3>
            <p class="bento-desc">${escapeHtml(proj.description)}</p>
            <div class="bento-tags">${tags}</div>
            <a href="${proj.repoUrl}" target="_blank" class="bento-link">Ver Código ↗</a>
          </div>
        </article>
      `;
    });
  }

  // Render Certifications (Bento)
  const certContainer = document.getElementById('certifications-grid');
  if (certContainer && globalData.certifications) {
    certContainer.innerHTML = '';
    globalData.certifications.forEach((cert, idx) => {
      // Forzar patrón de ladrillo asimétrico basado en el índice
      const certTetris = ['horizontal', 'normal', 'normal', 'vertical', 'normal', 'horizontal'];
      const certSize = certTetris[idx % certTetris.length];
      const cls = 'cert-card ' + certSize;
      const linkStyle = cert.url ? `cursor: pointer;` : '';
      const onClickAttr = cert.url ? `onclick="window.open('${escapeHtml(cert.url)}', '_blank')"` : '';
      const urlHtml = cert.url ? `<span style="margin-top:auto; font-weight:600; color:var(--cyan); font-size:0.85rem; padding:12px 0;">Ver Credencial ↗</span>` : '';
      
      certContainer.innerHTML += `
        <article class="${cls}" data-tilt ${onClickAttr} style="${linkStyle}">
          <div class="cert-content">
            <span class="cert-tag">${cert.year} · ${escapeHtml(cert.platform)}</span>
            <h3 class="cert-title">${escapeHtml(cert.title)}</h3>
            ${cert.description ? `<p class="cert-desc" style="${cert.url ? 'margin-top:0;' : ''}">${escapeHtml(cert.description)}</p>` : ''}
            ${urlHtml}
          </div>
        </article>
      `;
    });
  }

  // Render Sesiones Dinámicas (Bitácora)
  const sesionContainer = document.getElementById('timeline-dinamico');
  if (sesionContainer && globalData.sesiones) {
    sesionContainer.innerHTML = '';
    globalData.sesiones.forEach(ses => {
      const tagsHtml = ses.tags.map(t => `<span class="sesion-tag">${escapeHtml(t.trim())}</span>`).join('');
      sesionContainer.innerHTML += `
        <article class="sesion-item">
          <div class="sesion-marker"></div>
          <div class="sesion-content">
            <div class="sesion-header">
              <span class="sesion-week">Semana ${escapeHtml(ses.num)}</span>
              <span class="sesion-date">${escapeHtml(ses.fecha)}</span>
            </div>
            <h3 class="sesion-topic">${escapeHtml(ses.tema)}</h3>
            <div class="sesion-tags">${tagsHtml}</div>
          </div>
        </article>
      `;
    });
  }

  // Actualizar Stats
  const statProjects = document.querySelectorAll('.stat-value');
  if (statProjects.length >= 3) {
    // 0 = Ciclo (no cambia acá), 1 = Semanas, 2 = Proyectos Reales
    statProjects[2].textContent = globalData.projects ? globalData.projects.length + '+' : '0';
  }

  // Render Admin Lists
  renderAdminLists();

  // Refrescar GSAP porque el DOM cambió
  setTimeout(() => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
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

  // Tabs Logic
  document.querySelectorAll('.cms-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cms-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.tab).classList.add('active');
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

  // Add Sesion
  const btnAddSesion = document.getElementById('btn-add-sesion');
  if (btnAddSesion) {
    btnAddSesion.addEventListener('click', addSesion);
  }
}

function initAdminDashboard() {
  document.getElementById('cms-bio-text').value = globalData.bio || '';
  renderAdminLists();
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

  // Sesiones
  const sList = document.getElementById('cms-sesiones-list');
  if (sList && globalData.sesiones) {
    sList.innerHTML = globalData.sesiones.map(s => `
      <div class="cms-list-item">
        <div>
          <h5>Semana ${escapeHtml(s.num)}: ${escapeHtml(s.tema)}</h5>
          <p>${escapeHtml(s.fecha)}</p>
        </div>
        <div class="cms-item-actions">
          <button onclick="removeSesion('${s.id}')">Eliminar</button>
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

function addSesion() {
  const num = document.getElementById('sesion-num').value.trim();
  const tema = document.getElementById('sesion-tema').value.trim();
  const fecha = document.getElementById('sesion-fecha').value.trim();
  const tagsStr = document.getElementById('sesion-tags').value.trim();

  if(!num || !tema || !fecha) {
    alert("Número, Tema y Fecha son obligatorios.");
    return;
  }

  if(!globalData.sesiones) globalData.sesiones = [];

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t !== '') : [];

  globalData.sesiones.push({
    id: `ses-${Date.now()}`,
    num, tema, fecha, tags
  });

  saveData();
  document.getElementById('sesion-num').value = '';
  document.getElementById('sesion-tema').value = '';
  document.getElementById('sesion-fecha').value = '';
  document.getElementById('sesion-tags').value = '';
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

window.removeSesion = function(id) {
  if(!confirm("¿Seguro que deseas eliminar esta sesión?")) return;
  if(globalData.sesiones) {
    globalData.sesiones = globalData.sesiones.filter(s => s.id !== id);
    saveData();
  }
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
