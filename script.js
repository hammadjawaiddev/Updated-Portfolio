
// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx+'px';
  ring.style.top = ry+'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ── CANVAS PARTICLES ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;
window.addEventListener('resize', () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; });

const particles = Array.from({length: 80}, () => ({
  x: Math.random() * W, y: Math.random() * H,
  vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
  r: Math.random()*1.5+0.3,
  alpha: Math.random()*0.4+0.1
}));

function drawParticles() {
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0) p.x=W; if(p.x>W) p.x=0;
    if(p.y<0) p.y=H; if(p.y>H) p.y=0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,210,255,${p.alpha})`;
    ctx.fill();
  });
  // Connect nearby particles
  for(let i=0;i<particles.length;i++) {
    for(let j=i+1;j<particles.length;j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,210,255,${0.08*(1-d/100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateNavActive();
});

// ── SCROLL SPY ──
function updateNavActive() {
  const sections = ['hero','about','projects','education','contact'];
  const links = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if(el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#'+current);
  });
}

// ── MOBILE MENU ──
function toggleMobile() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── SKILL BARS ──
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.transform = `scaleX(${bar.dataset.width})`;
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-wrap').forEach(el => barObs.observe(el));

// ── CONTACT FORM ──
function handleSubmit(btn) {
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.opacity = ''; }, 3000);
  }, 1500);
}

// ── EDU LAYOUT RESPONSIVE ──
function fixEduLayout() {
  const eduLayout = document.querySelector('.edu-layout');
  if(eduLayout) {
    if(window.innerWidth < 900) {
      eduLayout.style.gridTemplateColumns = '1fr';
    } else {
      eduLayout.style.gridTemplateColumns = '1.3fr 1fr';
    }
  }
}
window.addEventListener('resize', fixEduLayout);
fixEduLayout();