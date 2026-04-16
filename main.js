(function() {
  'use strict';

  // Back to top
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 300);
    });
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Burger menu
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // Fade-in animation
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  fadeElements.forEach(el => fadeObserver.observe(el));

  // Counters
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = Math.floor(current);
          }
        }, 30);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  // Carousel
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    let autoInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    }
    function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
    function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
    function startAuto() { if (autoInterval) clearInterval(autoInterval); autoInterval = setInterval(nextSlide, 5000); }
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
      nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
    }
    startAuto();
  }

  // Forms
  const forms = document.querySelectorAll('#booking-form, #contact-form, #booking-page-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Merci pour votre demande ! Notre équipe vous contactera sous 24h.');
      form.reset();
    });
  });
})();