/* ═══════════════════════════════════════════════
   main.js — Varun Kumar Portfolio
   ═══════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
}, { passive: true });

(function animateCursor() {
  dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
})();

/* ─── LANDING → APP TRANSITION ──────────────── */
const landing = document.getElementById('landing');
const app     = document.getElementById('app');
let transitioned = false;

function doTransition() {
  if (transitioned) return;
  transitioned = true;
  landing.classList.add('exit');
  setTimeout(() => {
    app.classList.add('visible');
    initScrollReveal();      // start observing only after app visible
    setTimeout(() => {
      landing.classList.add('gone');
      document.body.style.overflowY = 'auto';
    }, 950);
  }, 200);
}

const autoTimer = setTimeout(doTransition, 3400);
let canSkip = false;
setTimeout(() => { canSkip = true; }, 1200);
['wheel', 'touchstart', 'keydown', 'click'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (canSkip) { clearTimeout(autoTimer); doTransition(); }
  }, { passive: true });
});
document.body.style.overflowY = 'hidden';

/* ─── NAVBAR SCROLL ──────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── SMOOTH SCROLL ──────────────────────────── */
function smoothScroll(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

/* ─── MOBILE MENU ────────────────────────────── */
let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('mobile-menu').classList.toggle('open', menuOpen);
}
function closeMobileMenu() {
  menuOpen = false;
  document.getElementById('mobile-menu').classList.remove('open');
}

/* ─── TABS ───────────────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b  => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  // stagger cards in newly visible tab
  setTimeout(() => {
    const active = document.getElementById('tab-' + name);
    if (active) staggerCards(active);
  }, 20);
}

/* ─── STAGGER CARDS ──────────────────────────── */
function staggerCards(container) {
  const items = container.querySelectorAll('.port-card, .lab-card-featured, .lab-card-small');
  items.forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s,
                             transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }));
  });
}

/* ─── SCROLL REVEAL ──────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // initial stagger for the first (investigations) tab
  setTimeout(() => {
    const firstTab = document.getElementById('tab-investigations');
    if (firstTab) staggerCards(firstTab);
  }, 400);
}

function openTabAndScroll(event, tabName) {
  event.preventDefault();

  const section = document.getElementById('portfolio');

  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  // Wait until scroll finishes more naturally
  setTimeout(() => {
    const tabBtn = document.querySelector(
      `.tab-btn[onclick*="${tabName}"]`
    );
    if (tabBtn) {
      switchTab(tabName, tabBtn);
    }
  }, 500); // slightly smoother timing
}

document.querySelectorAll('.card-light').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });
});