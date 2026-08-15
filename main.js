document.addEventListener('DOMContentLoaded', () => {

  const WSP_NUMBER  = '56932123523';
  const WSP_MESSAGE = encodeURIComponent('¡Holaa! Vi tu página y me gustaria inscribirme al programa.');
  const IG_USER     = 'ruben.bg.coach';
  const TIKTOK_USER = 'bboyangelovayork';

  // DETECCIÓN DE MÓVIL: desactivamos cosas pesadas
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ============================
  // 1. CURSOR PERSONALIZADO
  // ============================
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

  if (!isTouchDevice) {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX - 6 + 'px';
      cursor.style.top  = mouseY - 6 + 'px';
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX - 16 + 'px';
      trail.style.top  = trailY - 16 + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    function refreshCursorTargets() {
      document.querySelectorAll('a, button, .client-card, .price-card, .contact-bubble').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(2)';
          cursor.style.background = 'var(--neon-orange)';
          trail.style.borderColor = 'var(--neon-orange)';
          trail.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          cursor.style.background = 'var(--neon-cyan)';
          trail.style.borderColor = 'var(--neon-purple)';
          trail.style.transform = 'scale(1)';
        });
      });
    }
    refreshCursorTargets();
  } else {
    // Si es móvil, nos deshacemos de esto
    if (cursor) cursor.style.display = 'none';
    if (trail) trail.style.display = 'none';
  }

  // ============================
  // 2. NAV — efecto scroll
  // ============================
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ============================
  // 3. SCROLL REVEAL
  // ============================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ============================
  // 4. COUNTER ANIMATION
  // ============================
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const inc    = target / (2000 / 16);
        let current  = 0;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else { el.textContent = Math.floor(current); }
        }, 16);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(c => countObserver.observe(c));

  // ============================
  // 5. CARRUSEL INFINITO
  // ============================
  const track    = document.getElementById('clientsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn) {

    const originalCards = Array.from(track.querySelectorAll('.client-card'));
    const total = originalCards.length;

    originalCards.forEach(c => {
      const cloneEnd = c.cloneNode(true);
      cloneEnd.setAttribute('aria-hidden', 'true');
      track.appendChild(cloneEnd);
    });
    [...originalCards].reverse().forEach(c => {
      const cloneStart = c.cloneNode(true);
      cloneStart.setAttribute('aria-hidden', 'true');
      track.insertBefore(cloneStart, track.firstChild);
    });

    let currentIndex    = total;
    let isTransitioning = false;
    let autoplayTimer   = null;
    let isDragging      = false;
    let startX          = 0;

    originalCards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (!isTransitioning) goTo(i + total);
      });
      dotsWrap.appendChild(dot);
    });

    function getCardWidth() {
      const gap = parseInt(getComputedStyle(track).gap) || 28;
      return track.querySelector('.client-card').offsetWidth + gap;
    }

    function setPosition(idx, animated) {
      track.style.transition = animated
        ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none';
      track.style.transform = `translateX(${-idx * getCardWidth()}px)`;
    }

    function updateDots() {
      const realIdx = ((currentIndex - total) % total + total) % total;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === realIdx)
      );
    }

    function goTo(idx, animated = true) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = idx;
      setPosition(currentIndex, animated);
      updateDots();

      setTimeout(() => {
        if (currentIndex >= total * 2) {
          currentIndex = total;
          setPosition(currentIndex, false);
        }
        if (currentIndex < total) {
          currentIndex = total * 2 - 1;
          setPosition(currentIndex, false);
        }
        updateDots();
        isTransitioning = false;
      }, 560);
    }

    function next() { goTo(currentIndex + 1); resetAutoplay(); }
    function prev() { goTo(currentIndex - 1); resetAutoplay(); }

    prevBtn.style.opacity = '1';
    nextBtn.style.opacity = '1';

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    track.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      track.style.transition = 'none';
    });
    document.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 60) { diff > 0 ? next() : prev(); }
      else { setPosition(currentIndex, true); }
    });

    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    function startAutoplay() {
      autoplayTimer = setInterval(next, 4500);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    setPosition(currentIndex, false);
    updateDots();
    startAutoplay();

    requestAnimationFrame(() => {
      track.classList.add('ready');
    });

    window.addEventListener('resize', () => setPosition(currentIndex, false));
  }

  // ============================
  // 6. PARALLAX ORBS
  // ============================
  if (!isTouchDevice) {
    const orbs = document.querySelectorAll('.hero-orb');
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 12;
        orb.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
      });
    });
  }

  // ============================
  // 7. FLOATING TAGS
  // ============================
  document.querySelectorAll('.floating-tag').forEach((tag, i) => {
    tag.style.animationDelay = `${i * 1.5}s`;
  });

  // ============================
  // 8. GLITCH HERO
  // ============================
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !isTouchDevice) {
    heroTitle.addEventListener('mouseenter', () => {
      heroTitle.style.textShadow = `2px 0 var(--neon-cyan), -2px 0 var(--neon-pink)`;
      setTimeout(() => { heroTitle.style.textShadow = ''; }, 200);
    });
  }

  // ============================
  // 9. BURBUJAS DE CONTACTO
  // ============================
  const bubblesHTML = `
    <div class="contact-bubbles" id="contactBubbles">
      <a class="contact-bubble wsp-bubble"
         href="https://wa.me/${WSP_NUMBER}?text=${WSP_MESSAGE}"
         target="_blank" rel="noopener"
         aria-label="WhatsApp">
        <div class="bubble-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.843L.055 23.454a.75.75 0 00.919.921l5.733-1.503A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.653-.493-5.188-1.357l-.372-.215-3.853 1.011 1.032-3.765-.228-.383A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </div>
        <div class="bubble-tooltip">¡Escríbeme por WhatsApp!</div>
        <div class="bubble-pulse"></div>
      </a>

      <a class="contact-bubble ig-bubble"
         href="https://instagram.com/${IG_USER}"
         target="_blank" rel="noopener"
         aria-label="Instagram">
        <div class="bubble-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <div class="bubble-tooltip">Sígueme en Instagram</div>
        <div class="bubble-pulse"></div>
      </a>

      <a class="contact-bubble tiktok-bubble"
         href="https://tiktok.com/@${TIKTOK_USER}"
         target="_blank" rel="noopener"
         aria-label="TikTok">
        <div class="bubble-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </div>
        <div class="bubble-tooltip">¡Sígueme en TikTok!</div>
        <div class="bubble-pulse"></div>
      </a>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', bubblesHTML);

});