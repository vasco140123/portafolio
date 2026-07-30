/**
 * letterGlitch.js
 * Efecto LetterGlitch — port exacto del componente React de React Bits.
 * https://github.com/ekmas/react-bits/blob/master/src/content/Backgrounds/LetterGlitch/LetterGlitch.jsx
 */
(function () {
  'use strict';

  var container = document.getElementById('letter-glitch-bg');
  if (!container) return;

  // ── Config (mismos defaults que el React component) ──
  var glitchColors = ['#2b4539', '#61dca3', '#61b3dc'];
  var glitchSpeed = 50;
  var smooth = true;
  var outerVignette = true;
  var centerVignette = false;
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

  // ── Canvas setup ──
  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  // ── Vignettes ──
  if (outerVignette) {
    var outerVig = document.createElement('div');
    outerVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%);';
    container.appendChild(outerVig);
  }
  if (centerVignette) {
    var centerVig = document.createElement('div');
    centerVig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);';
    container.appendChild(centerVig);
  }

  // ── State ──
  var ctx = canvas.getContext('2d');
  var lettersAndSymbols = Array.from(characters);
  var fontSize = 16;
  var charWidth = 10;
  var charHeight = 20;
  var letters = [];
  var grid = { columns: 0, rows: 0 };
  var animationRef = null;
  var lastGlitchTime = Date.now();

  // ── Helpers (idénticos al original) ──
  function getRandomChar() {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  }

  function getRandomColor() {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }

  function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  function interpolateColor(start, end, factor) {
    var result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return 'rgb(' + result.r + ',' + result.g + ',' + result.b + ')';
  }

  function calculateGrid(width, height) {
    var columns = Math.ceil(width / charWidth);
    var rows = Math.ceil(height / charHeight);
    return { columns: columns, rows: rows };
  }

  function initializeLetters(columns, rows) {
    grid.columns = columns;
    grid.rows = rows;
    var totalLetters = columns * rows;
    letters = [];
    for (var i = 0; i < totalLetters; i++) {
      letters.push({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1
      });
    }
  }

  // ── resizeCanvas (usa parentElement como el original React) ──
  function resizeCanvas() {
    var parent = container;
    if (!parent) return;

    var dpr = window.devicePixelRatio || 1;
    var rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var g = calculateGrid(rect.width, rect.height);
    initializeLetters(g.columns, g.rows);
    drawLetters();
  }

  // ── drawLetters (idéntico al original) ──
  function drawLetters() {
    if (!ctx || letters.length === 0) return;
    var rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.font = fontSize + 'px monospace';
    ctx.textBaseline = 'top';

    for (var i = 0; i < letters.length; i++) {
      var x = (i % grid.columns) * charWidth;
      var y = Math.floor(i / grid.columns) * charHeight;
      ctx.fillStyle = letters[i].color;
      ctx.fillText(letters[i].char, x, y);
    }
  }

  // ── updateLetters (idéntico al original) ──
  function updateLetters() {
    if (!letters || letters.length === 0) return;
    var updateCount = Math.max(1, Math.floor(letters.length * 0.05));
    for (var i = 0; i < updateCount; i++) {
      var index = Math.floor(Math.random() * letters.length);
      if (!letters[index]) continue;
      letters[index].char = getRandomChar();
      letters[index].targetColor = getRandomColor();
      if (!smooth) {
        letters[index].color = letters[index].targetColor;
        letters[index].colorProgress = 1;
      } else {
        letters[index].colorProgress = 0;
      }
    }
  }

  // ── handleSmoothTransitions (idéntico al original) ──
  function handleSmoothTransitions() {
    var needsRedraw = false;
    for (var i = 0; i < letters.length; i++) {
      var letter = letters[i];
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;
        var startRgb = hexToRgb(letter.color);
        var endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    }
    if (needsRedraw) drawLetters();
  }

  // ── animate (idéntico al original) ──
  function animate() {
    var now = Date.now();
    if (now - lastGlitchTime >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime = now;
    }
    if (smooth) handleSmoothTransitions();
    animationRef = requestAnimationFrame(animate);
  }

  // ── Init (igual que el useEffect del original) ──
  resizeCanvas();
  animate();

  var resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      cancelAnimationFrame(animationRef);
      resizeCanvas();
      animate();
    }, 100);
  }
  window.addEventListener('resize', handleResize);
})();
