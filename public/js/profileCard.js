/* ============================================
   PROFILE CARD — Vanilla JS port of React Bits
   ============================================ */
(function () {
  const DEFAULT_INNER_GRADIENT =
    'linear-gradient(145deg, rgba(131,107,184,0.55) 0%, rgba(113,196,255,0.27) 100%)';
  const INITIAL_DURATION = 1200;
  const INITIAL_X_OFFSET = 70;
  const INITIAL_Y_OFFSET = 60;
  const ENTER_TRANSITION_MS = 180;
  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;

  const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
  const round = (v, p = 3) => parseFloat(v.toFixed(p));
  const adjust = (v, fMin, fMax, tMin, tMax) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

  function initProfileCard(wrapper) {
    const shell = wrapper.querySelector('.pc-card-shell');
    if (!shell) return;

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let initialUntil = 0;
    let enterTimer = null;
    let leaveRaf = null;

    const setVarsFromXY = (x, y) => {
      const w = shell.clientWidth || 1;
      const h = shell.clientHeight || 1;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const cx = px - 50;
      const cy = py - 50;
      const props = {
        '--pointer-x': px + '%',
        '--pointer-y': py + '%',
        '--background-x': adjust(px, 0, 100, 35, 65) + '%',
        '--background-y': adjust(py, 0, 100, 35, 65) + '%',
        '--pointer-from-center': clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1),
        '--pointer-from-top': py / 100,
        '--pointer-from-left': px / 100,
        '--rotate-x': round(-(cx / 5)) + 'deg',
        '--rotate-y': round(cy / 4) + 'deg'
      };
      for (const [k, v] of Object.entries(props)) wrapper.style.setProperty(k, v);
    };

    const step = (ts) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      setVarsFromXY(currentX, currentY);
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05 || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    const getOffsets = (e, el) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerMove = (e) => {
      const { x, y } = getOffsets(e, shell);
      targetX = x; targetY = y;
      start();
    };

    const onPointerEnter = (e) => {
      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = setTimeout(() => shell.classList.remove('entering'), ENTER_TRANSITION_MS);
      const { x, y } = getOffsets(e, shell);
      targetX = x; targetY = y;
      start();
    };

    const onPointerLeave = () => {
      // Return to center
      targetX = shell.clientWidth / 2;
      targetY = shell.clientHeight / 2;
      start();

      const checkSettle = () => {
        const dist = Math.hypot(targetX - currentX, targetY - currentY);
        if (dist < 0.6) {
          shell.classList.remove('active');
          leaveRaf = null;
        } else {
          leaveRaf = requestAnimationFrame(checkSettle);
        }
      };
      if (leaveRaf) cancelAnimationFrame(leaveRaf);
      leaveRaf = requestAnimationFrame(checkSettle);
    };

    shell.addEventListener('pointermove', onPointerMove);
    shell.addEventListener('pointerenter', onPointerEnter);
    shell.addEventListener('pointerleave', onPointerLeave);

    // Initial animation
    const ix = (shell.clientWidth || 0) - INITIAL_X_OFFSET;
    const iy = INITIAL_Y_OFFSET;
    currentX = ix; currentY = iy;
    setVarsFromXY(currentX, currentY);
    targetX = shell.clientWidth / 2;
    targetY = shell.clientHeight / 2;
    initialUntil = performance.now() + INITIAL_DURATION;
    start();

    return () => {
      shell.removeEventListener('pointermove', onPointerMove);
      shell.removeEventListener('pointerenter', onPointerEnter);
      shell.removeEventListener('pointerleave', onPointerLeave);
      if (enterTimer) clearTimeout(enterTimer);
      if (leaveRaf) cancelAnimationFrame(leaveRaf);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }

  function initAll() {
    document.querySelectorAll('.pc-card-wrapper').forEach(initProfileCard);
  }

  // Wait for components to be injected via fetch
  if (document.querySelector('.pc-card-wrapper')) {
    initAll();
  } else {
    window.addEventListener('components-loaded', initAll);
  }
})();
