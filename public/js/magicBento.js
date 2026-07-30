/* ============================================
   MAGIC BENTO — Vanilla JS port of React Bits
   Projects & Certificates interactive cards
   ============================================ */
(function () {
  const SPOTLIGHT_RADIUS = 300;
  const GLOW_COLOR = '139, 92, 246'; // violet
  const CYAN_GLOW = '6, 182, 212';
  const PARTICLE_COUNT = 12;

  /* ── Particle creation ── */
  function createParticle(x, y, color) {
    const el = document.createElement('div');
    el.className = 'magic-bento-particle';
    el.style.cssText = `
      position:absolute;width:4px;height:4px;border-radius:50%;
      background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);
      pointer-events:none;z-index:100;left:${x}px;top:${y}px;
    `;
    return el;
  }

  /* ── Individual card interactions ── */
  function initCard(card, glowColor) {
    const particles = [];
    const timeouts = [];
    let isHovered = false;
    let memoized = [];
    let initialized = false;

    const initParticles = () => {
      if (initialized) return;
      const r = card.getBoundingClientRect();
      memoized = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(Math.random() * r.width, Math.random() * r.height, glowColor)
      );
      initialized = true;
    };

    const clearParticles = () => {
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
      particles.forEach(p => {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
      particles.length = 0;
    };

    const animateParticles = () => {
      if (!isHovered) return;
      if (!initialized) initParticles();
      memoized.forEach((template, i) => {
        const tid = setTimeout(() => {
          if (!isHovered) return;
          const clone = template.cloneNode(true);
          card.appendChild(clone);
          particles.push(clone);
          // Drift animation
          const dx = (Math.random() - 0.5) * 100;
          const dy = (Math.random() - 0.5) * 100;
          const dur = 2 + Math.random() * 2;
          clone.animate([
            { transform: 'scale(0) translate(0,0)', opacity: 0 },
            { transform: `scale(1) translate(${dx * 0.3}px,${dy * 0.3}px)`, opacity: 1, offset: 0.15 },
            { transform: `scale(0.8) translate(${dx}px,${dy}px)`, opacity: 0.3, offset: 0.5 },
            { transform: `scale(1) translate(${dx * 0.5}px,${dy * 0.5}px)`, opacity: 0.6 },
            { transform: `scale(0) translate(${dx * 0.2}px,${dy * 0.2}px)`, opacity: 0 }
          ], { duration: dur * 1000, iterations: Infinity });
        }, i * 100);
        timeouts.push(tid);
      });
    };

    const onMouseEnter = () => {
      isHovered = true;
      animateParticles();
      card.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-2px)';
    };

    const onMouseLeave = () => {
      isHovered = false;
      clearParticles();
      card.style.transform = '';
    };

    const onMouseMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) * 8;
      const mx = (x - cx) * 0.03;
      const my = (y - cy) * 0.03;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translate(${mx}px,${my}px) translateY(-2px)`;
    };

    const onClick = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const maxDist = Math.max(
        Math.hypot(x, y), Math.hypot(x - r.width, y),
        Math.hypot(x, y - r.height), Math.hypot(x - r.width, y - r.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute;width:${maxDist * 2}px;height:${maxDist * 2}px;border-radius:50%;
        background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);
        left:${x - maxDist}px;top:${y - maxDist}px;pointer-events:none;z-index:1000;
      `;
      card.appendChild(ripple);
      ripple.animate([
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 }
      ], { duration: 800, easing: 'ease-out' }).onfinish = () => ripple.remove();
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('click', onClick);
  }

  /* ── Global spotlight ── */
  function initSpotlight(section, glowColor) {
    const grid = section.querySelector('.bento-grid, .cert-bento-grid');
    if (!grid) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'magic-global-spotlight';
    spotlight.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spotlight);

    const proximity = SPOTLIGHT_RADIUS * 0.5;
    const fadeDistance = SPOTLIGHT_RADIUS * 0.75;

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = grid.querySelectorAll('.magic-bento-card');

      if (!inside) {
        spotlight.style.opacity = '0';
        cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
        return;
      }

      let minDist = Infinity;
      cards.forEach(card => {
        const cr = card.getBoundingClientRect();
        const ccx = cr.left + cr.width / 2;
        const ccy = cr.top + cr.height / 2;
        const dist = Math.hypot(e.clientX - ccx, e.clientY - ccy) - Math.max(cr.width, cr.height) / 2;
        const eff = Math.max(0, dist);
        minDist = Math.min(minDist, eff);

        let intensity = 0;
        if (eff <= proximity) intensity = 1;
        else if (eff <= fadeDistance) intensity = (fadeDistance - eff) / (fadeDistance - proximity);

        const relX = ((e.clientX - cr.left) / cr.width) * 100;
        const relY = ((e.clientY - cr.top) / cr.height) * 100;
        card.style.setProperty('--glow-x', relX + '%');
        card.style.setProperty('--glow-y', relY + '%');
        card.style.setProperty('--glow-intensity', intensity.toString());
        card.style.setProperty('--glow-radius', SPOTLIGHT_RADIUS + 'px');
      });

      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';

      let targetOpacity = 0;
      if (minDist <= proximity) targetOpacity = 0.8;
      else if (minDist <= fadeDistance) targetOpacity = ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8;
      spotlight.style.opacity = targetOpacity.toString();
    };

    const onMouseLeave = () => {
      spotlight.style.opacity = '0';
      grid.querySelectorAll('.magic-bento-card').forEach(c => c.style.setProperty('--glow-intensity', '0'));
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
  }

  /* ── Initialize all sections ── */
  function init() {
    // Projects section — violet glow
    const projectsSection = document.querySelector('.projects');
    if (projectsSection) {
      const cards = projectsSection.querySelectorAll('.magic-bento-card');
      cards.forEach(card => initCard(card, GLOW_COLOR));
      initSpotlight(projectsSection, GLOW_COLOR);
    }

    // Certifications section — cyan glow
    const certSection = document.querySelector('.certifications');
    if (certSection) {
      const cards = certSection.querySelectorAll('.magic-bento-card');
      cards.forEach(card => initCard(card, CYAN_GLOW));
      initSpotlight(certSection, CYAN_GLOW);
    }
  }

  // Wait for components to be injected via fetch
  if (document.querySelector('.magic-bento-card')) {
    init();
  } else {
    window.addEventListener('components-loaded', init);
  }

  // Re-init when CMS renders new content
  window.addEventListener('portfolio-data-rendered', init);
})();
