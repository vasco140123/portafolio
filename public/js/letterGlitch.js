/**
 * letterGlitch.js
 * Efecto de fondo con letras que hacen glitch — vanilla JS (desde React Bits).
 */
(function () {
  'use strict';

  var container = document.getElementById('letter-glitch-bg');
  if (!container) return;

  // ── Config ──
  var glitchColors = ['#2b4539', '#61dc84', '#61b3dc'];
  var glitchSpeed = 50;
  var smooth = true;
  var outerVignette = true;
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

  // ── Setup canvas ──
  var canvas = document.createElement('canvas');
  container.appendChild(canvas);

  if (outerVignette) {
    var vig = document.createElement('div');
    vig.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background:radial-gradient(circle,rgba(0,0,0,0) 60%,rgba(5,8,16,1) 100%);z-index:2;';
    container.appendChild(vig);
  }

  var ctx = canvas.getContext('2d');
  var lettersAndSymbols = Array.from(characters);
  var fontSize = 16;
  var charWidth = 10;
  var charHeight = 20;

  var letters = [];
  var grid = { columns: 0, rows: 0 };
  var animationId = null;
  var lastGlitchTime = Date.now();

  // ── Helpers ──
  function getRandomChar() {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  }

  function getRandomColor() {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  }

  function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  function interpolateColor(start, end, factor) {
    var r = Math.round(start.r + (end.r - start.r) * factor);
    var g = Math.round(start.g + (end.g - start.g) * factor);
    var b = Math.round(start.b + (end.b - start.b) * factor);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // ── Grid ──
  function calculateGrid(width, height) {
    return {
      columns: Math.ceil(width / charWidth),
      rows: Math.ceil(height / charHeight)
    };
  }

  function initializeLetters(columns, rows) {
    grid.columns = columns;
    grid.rows = rows;
    var total = columns * rows;
    letters = [];
    for (var i = 0; i < total; i++) {
      letters.push({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1
      });
    }
  }

  // ── Canvas resize ──
  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var g = calculateGrid(w, h);
    initializeLetters(g.columns, g.rows);
    drawLetters();
  }

  // ── Draw ──
  function drawLetters() {
    if (!letters.length) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.font = fontSize + 'px monospace';
    ctx.textBaseline = 'top';

    for (var i = 0; i < letters.length; i++) {
      var l = letters[i];
      var x = (i % grid.columns) * charWidth;
      var y = Math.floor(i / grid.columns) * charHeight;
      ctx.fillStyle = l.color;
      ctx.fillText(l.char, x, y);
    }
  }

  // ── Update ──
  function updateLetters() {
    var count = Math.max(1, Math.floor(letters.length * 0.05));
    for (var i = 0; i < count; i++) {
      var idx = Math.floor(Math.random() * letters.length);
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
    var needsRedraw = false;
    for (var i = 0; i < letters.length; i++) {
      var l = letters[i];
      if (l.colorProgress < 1) {
        l.colorProgress += 0.05;
        if (l.colorProgress > 1) l.colorProgress = 1;
        var startRgb = hexToRgb(l.color);
        var endRgb = hexToRgb(l.targetColor);
        if (startRgb && endRgb) {
          l.color = interpolateColor(startRgb, endRgb, l.colorProgress);
          needsRedraw = true;
        }
      }
    }
    if (needsRedraw) drawLetters();
  }

  // ── Animate ──
  function animate() {
    var now = Date.now();
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

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      cancelAnimationFrame(animationId);
      resizeCanvas();
      animate();
    }, 100);
  });
})();
