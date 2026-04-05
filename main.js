/* ── PARTICLES (optimizado) ──
   Cambios clave vs original:
   - 60 pts → 35 pts  (menos cálculos por frame)
   - distancia de línea 100 → 80px (reduce comparaciones activas)
   - devicePixelRatio para nitidez sin costo extra
   - sin cambios en la lógica de animación
*/
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width  = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);
}

function init() {
  resize();
  pts = Array.from({ length: 35 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a:  Math.random(),
    c:  Math.random() > 0.5 ? '0,229,255' : '139,92,246'
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Mover y dibujar puntos
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.c},${p.a * 0.6})`;
    ctx.fill();
  }

  // Líneas entre puntos cercanos (distancia reducida a 80)
  const DIST = 80, DIST_SQ = DIST * DIST;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dSq = dx * dx + dy * dy;
      if (dSq < DIST_SQ) {
        const ratio = 1 - Math.sqrt(dSq) / DIST;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.08 * ratio})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

// Resize: evitar recalcular en cada pixel de resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 150);
});

init();
draw();

/* ── LANG TOGGLE ── */
let currentLang = 'es';

function setLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;
  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');

  document.querySelectorAll('[data-es]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt !== null) {
      el.innerHTML = txt;
      el.classList.remove('lang-fade');
      void el.offsetWidth; // reflow para reiniciar animación
      el.classList.add('lang-fade');
    }
  });

  document.documentElement.lang = lang;
}