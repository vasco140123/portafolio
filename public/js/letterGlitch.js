/**
 * letterGlitch.js
 * Efecto de fondo con letras que hacen glitch — convertido desde React Bits a vanilla JS.
 * Usage: <div id="letter-glitch-bg"></div> + <script src="public/js/letterGlitch.js">
 */
(function () {
  'use strict';

  const container = document.getElementById('letter-glitch-bg');
  if (!container) return;

  // ── Config ──
  const glitchColors = ['#2b4539', '#61dc84', '#61b3dc'];
  const glitchSpeed = 50;
  const smooth = true;
  const outerVignette = true;
  const centerVignette = false;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

  // ── Setup ──
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  if (outerVignette) {
    const v = document.createElement('div');
    v.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:radial-gradient(circle,rgba(0,0,0,0) 60%,rgba(0,0,0,1) 100%);';
    container.appendChild(v);
  }
  if (centerVignette) {
    const v = document.createElement('div');
    v.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:radial-gradient(circle,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 60%);';
    container.appendChild(v);
  }

  const ctx = canvas.getContext('2d');
  const lettersAndSymbols = Array.from(characters);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  let letters = [];
  let grid = { columns: 0, rows: 0 };
  let animationId = null;
  let lastGlitchTime = Date.now();

  // ── Helpers ──
  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }

  function interpolateColor(start, end, factor) {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r},${g},${b})`;
  }

  // ── Grid ──
  function calculateGrid(width, height) {
    return { columns: Math.ceil(width / charWidth), rows: Math.ceil(height / charHeight) };
  }

  function initializeLetters(columns, rows) {
    grid = { columns, rows };
    const total = columns * rows;
    letters = Array.from({ length: total }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1
    }));
  }

  // ── Canvas ──
  function resizeCanvas() {
    if (!container || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  }

  function drawLetters() {
    if (!letters.length) return;
    const { width, height } = container.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = fontSize + 'px monospace';
    ctx.textBaseline = 'top';

    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      const x = (i % grid.columns) * charWidth;
      const y = Math.floor(i / grid.columns) * charHeight;
      ctx.fillStyle = l.color;
      ctx.fillText(l.char, x, y);
    }
  }

  function updateLetters() {
    const count = Math.max(1, Math.floor(letters.length * 0.05));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * letters.length);
      letters[idx].char = getRandomChar();
      letters[idx].targetColor = getRandomColor();
      if (!smooth) {
        letters[idx].color = letters[idx].targetColor;
        letters[idx].colorProgress = 1;
      } else {
        letters[idx].colorProgress = 0;
      }
    }
  }

  function handleSmoothTransitions() {
    let needsRedraw = false;
    for (let i = 0; i < letters.length; i++) {
      const l = letters[i];
      if (l.colorProgress < 1) {
        l.colorProgress += 0.05;
        if (l.colorProgress > 1) l.colorProgress = 1;
        const startRgb = hexToRgb(l.color);
        const endRgb = hexToRgb(l.targetColor);
        if (startRgb && endRgb) {
          l.color = interpolateColor(startRgb, endRgb, l.colorProgress);
          needsRedraw = true;
        }
      }
    }
    if (needsRedraw) drawLetters();
  }

  function animate() {
    const now = Date.now();
    if (now - lastGlitchTime >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime = now;
    }
    if (smooth) handleSmoothTransitions();
    animationId = requestAnimationFrame(animate);
  }

  // ── Init ──
  resizeCanvas();
  animate();

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      cancelAnimationFrame(animationId);
      resizeCanvas();
      animate();
    }, 100);
  });
})();
