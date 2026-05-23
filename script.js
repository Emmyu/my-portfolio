// ─── Navbar scroll: becomes transparent on scroll ───
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 100);
});

// ─── Mobile menu ───
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ─── Scroll reveal ───
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ─── Timeline scroll animation ───
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 150);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
timelineItems.forEach(item => timelineObserver.observe(item));

// ─── Project tabs ───
document.querySelectorAll('.project-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.project-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// ─── Project screenshot toggles ───
document.querySelectorAll('.project-card').forEach(card => {
  const imgs = card.querySelectorAll('.project-screenshots img');
  const dots = card.querySelectorAll('.screenshot-toggle button');
  if (imgs.length < 2) return;
  let current = 0, interval;
  function show(index) {
    imgs.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    imgs[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  }
  function startAuto() {
    interval = setInterval(() => show((current + 1) % imgs.length), 4000);
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(interval); show(i); startAuto(); });
  });
  show(0); startAuto();
  card.addEventListener('mouseenter', () => clearInterval(interval));
  card.addEventListener('mouseleave', startAuto);
});

// ─── Typewriter effect for hero tagline ───
const taglines = [
  "Building products people actually use.",
  "Turning ideas into production-ready applications.",
  "Mobile-first engineering with scalable architecture.",
  "Creating fast, reliable, user-focused applications.",
  "Engineering clean experiences across mobile and web.",
  "Shipping products with speed, quality, and ownership."
];

const taglineEl = document.getElementById('hero-tagline');
if (taglineEl) {
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const fullText = taglines[taglineIndex];

    if (!isDeleting) {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
    } else {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex--;
    }

    taglineEl.textContent = currentText;

    let speed = isDeleting ? 25 : 45;

    if (!isDeleting && charIndex === fullText.length) {
      speed = 2500; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      speed = 400; // pause before next word
    }

    setTimeout(type, speed);
  }

  // Start typing
  type();
}

// ─── Smooth counter animation for stats ───
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = el.getAttribute('data-count');
    const suffix = target.replace(/[0-9]/g, '');
    const num = parseInt(target);
    let current = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
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
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}
