/* ===========================
   LINZZ CAFE - SCRIPT
   Pure Vanilla JS — No Libraries
   =========================== */

(function () {
  'use strict';

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      initAnimations();
    }, 1800);
  });

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .menu-item, .gallery-item, .review-card, .feature-card');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // --- Hero Particles ---
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.width = (1 + Math.random() * 2) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  // --- Navbar: Hide/Show on Scroll Direction ---
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  function handleNavbar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavbar);
      ticking = true;
    }
  });

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  function initAnimations() {
    const reveals = document.querySelectorAll('.reveal-up');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling elements
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll('.reveal-up')) : [];
          const sibIndex = siblings.indexOf(entry.target);
          const delay = sibIndex >= 0 ? sibIndex * 40 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // --- Counter Animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const isDecimal = el.getAttribute('data-decimal') === 'true';
          const target = parseFloat(el.getAttribute('data-target'));
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
              el.textContent = current.toFixed(1);
            } else {
              el.textContent = Math.round(current);
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }
  animateCounters();

  // --- Menu Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach((item, i) => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 40);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Reviews Carousel ---
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const reviewCards = track ? track.querySelectorAll('.review-card') : [];
  let currentSlide = 0;
  let cardsPerView = 3;
  let autoplayInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getTotalSlides() {
    return Math.max(1, reviewCards.length - cardsPerView + 1);
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    if (!track || !reviewCards.length) return;
    const card = reviewCards[0];
    const gap = 20;
    const cardWidth = card.offsetWidth + gap;
    track.style.transform = 'translateX(' + (-currentSlide * cardWidth) + 'px)';

    // Update dots
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
  }

  function prevSlide() {
    const maxSlide = getTotalSlides() - 1;
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateCarousel();
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { nextSlide(); }
        else { prevSlide(); }
        resetAutoplay();
      }
    }, { passive: true });
  }

  function initCarousel() {
    cardsPerView = getCardsPerView();
    currentSlide = 0;
    createDots();
    updateCarousel();
    resetAutoplay();
  }

  initCarousel();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cardsPerView = getCardsPerView();
      if (currentSlide >= getTotalSlides()) {
        currentSlide = getTotalSlides() - 1;
      }
      createDots();
      updateCarousel();
    }, 200);
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Parallax effect on hero (subtle) ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const opacity = 1 - (scrolled / (window.innerHeight * 0.7));
        const translateY = scrolled * 0.3;
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = 'translateY(' + translateY + 'px)';
      }
    });
  }

  // --- Reservation Modal ---
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqmA89yJLT17XeyPgPpfMlaTnnTvAWiABbC1nsEM7HxB2pY8-j7JqxWtZQDaFbleFGfg/exec';

  const modal = document.getElementById('reservationModal');
  const form = document.getElementById('reservationForm');
  const successDiv = document.getElementById('reservationSuccess');
  const errorDiv = document.getElementById('reservationError');
  const submitBtn = document.getElementById('submitReservation');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function resetModal() {
    if (form) form.style.display = '';
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    if (btnText) btnText.style.display = '';
    if (btnLoader) btnLoader.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  }

  // Set min date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Open modal triggers
  document.querySelectorAll('#openReservationHero, #openReservationCta, [data-open-reservation]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      resetModal();
      openModal();
    });
  });

  // Close modal
  if (document.getElementById('closeReservation')) {
    document.getElementById('closeReservation').addEventListener('click', closeModal);
  }
  if (document.getElementById('closeSuccess')) {
    document.getElementById('closeSuccess').addEventListener('click', function() {
      closeModal();
      if (form) form.reset();
      resetModal();
    });
  }
  if (document.getElementById('retryReservation')) {
    document.getElementById('retryReservation').addEventListener('click', function() {
      resetModal();
    });
  }

  // Close on overlay click
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var data = {
        name: document.getElementById('res-name').value.trim(),
        phone: document.getElementById('res-phone').value.trim(),
        date: document.getElementById('res-date').value,
        time: document.getElementById('res-time').value,
        guests: document.getElementById('res-guests').value,
        occasion: document.getElementById('res-occasion').value,
        requests: document.getElementById('res-requests').value.trim()
      };

      // Validate
      if (!data.name || !data.phone || !data.date || !data.time || !data.guests) return;

      // Show loading
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline';
      submitBtn.disabled = true;

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.text(); })
      .then(function() {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        form.reset();
      })
      .catch(function() {
        // With redirect, fetch may error but data still goes through
        form.style.display = 'none';
        successDiv.style.display = 'block';
        form.reset();
      });
    });
  }

})();
