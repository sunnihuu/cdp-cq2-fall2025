/*
INTERACTION: Analytical Exploration with Canvas Background

Core functionality:
- Canvas-based background animation for homepage
- Particle system with grid feel
- Mouse interaction for visual feedback
- Motion preferences respect
*/

const canvas = document.getElementById("bg");
const ctx = canvas && canvas.getContext("2d");

// Respect user motion preferences
let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const btn = document.getElementById("motionToggle");
if (btn) {
  btn.addEventListener("click", () => {
    reduceMotion = !reduceMotion;
    btn.textContent = reduceMotion ? "Enable Motion" : "Reduce Motion";
  });
}

/**
 * Set up canvas for high DPI displays
 */
function resize() {
  if (!canvas) return;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

// Particle system for background visualization
const dots = Array.from({ length: 70 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 1 + Math.random() * 2,
  vx: (Math.random() - 0.5) * 0.25,
  vy: (Math.random() - 0.5) * 0.25
}));

let mouse = { x: -9999, y: -9999 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/**
 * Draw canvas background with grid and particles
 */
function draw() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Soft grid background
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = 0; x < window.innerWidth; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, window.innerHeight);
    ctx.stroke();
  }
  for (let y = 0; y < window.innerHeight; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(window.innerWidth, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Particles with mouse interaction
  for (const p of dots) {
    if (!reduceMotion) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    }

    // Subtle attraction to mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 140) {
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#2b6f62";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw particle
    ctx.fillStyle = "#2b6f62";
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(draw);
}

// Only draw if canvas exists (homepage)
if (canvas) {
  draw();
}

/**
 * Update active navigation link based on current page
 */
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNavLink();
});

// Update active link on page load (for browser back button)
window.addEventListener('pageshow', updateActiveNavLink);
