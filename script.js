const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

(function applyWorkView() {
  const view = document.documentElement.getAttribute('data-work') || 'all';
  if (view === 'all') return;

  const title = document.querySelector('#work .section-title');
  const subtitle = document.querySelector('#work .section-subtitle');
  if (title) title.textContent = 'Selected projects';
  if (subtitle) {
    subtitle.textContent = view === 'web'
      ? 'Production sites shipped to users.'
      : 'Production apps shipped to users.';
  }

  document.title = view === 'web'
    ? 'Emmanuel Aderemi — Web Projects'
    : 'Emmanuel Aderemi — Mobile Apps';
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  document.body.style.overflow = open ? 'hidden' : '';
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-label', 'Open menu');
  });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.project-card').forEach(card => {
  const imgs = card.querySelectorAll('.project-screenshots img');
  const dots = card.querySelectorAll('.screenshot-toggle button');
  if (imgs.length < 2) return;
  let current = 0;
  let interval;
  function show(index) {
    imgs.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    imgs[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    current = index;
  }
  function startAuto() {
    interval = setInterval(() => show((current + 1) % imgs.length), 4000);
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      show(i);
      startAuto();
    });
  });
  show(0);
  startAuto();
  card.addEventListener('mouseenter', () => clearInterval(interval));
  card.addEventListener('mouseleave', startAuto);
});

function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = el.getAttribute('data-count');
    const suffix = target.replace(/[0-9]/g, '');
    const num = parseInt(target, 10);
    let current = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 30);
  });
}

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(statsSection);
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}
