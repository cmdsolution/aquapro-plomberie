(function () {
  'use strict';

  // Carousel
  const slides = document.querySelectorAll('.carousel-slide');
  let current = 0;
  function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
  }
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
  if (slides.length) setInterval(() => showSlide(current + 1), 5000);

  // Navbar sticky shadow
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,.12)' : '0 2px 12px rgba(0,0,0,.08)';
    });
  }

  // Burger menu
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) navMenu.classList.remove('open');
    });
  }

  // Dropdown on mobile tap
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        link.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  // Back to top
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 300));
    btt.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Counters
  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let count = 0;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { el.textContent = target.toLocaleString('fr'); clearInterval(timer); }
      else el.textContent = Math.floor(count).toLocaleString('fr');
    }, 16);
  }

  // Intersection Observer: fade-in + counters
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('fade-in')) {
        el.classList.add('visible');
      }
      if (el.classList.contains('counter')) {
        animateCounter(el);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in, .counter').forEach(el => io.observe(el));

  // Forms
  ['booking-form', 'contact-form', 'booking-page-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .form-submit, .btn-primary');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = '✓ Envoyé !';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
    });
  });

})();
