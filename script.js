// ===== LENIS SMOOTH SCROLL =====
// Lightweight smooth scroll implementation (no dependency needed)
class SmoothScroll {
  constructor() {
    this.currentY = window.scrollY;
    this.targetY = window.scrollY;
    this.ease = 0.08;
    this.running = true;
    this.init();
  }

  init() {
    // Override native scroll
    document.documentElement.classList.add('lenis');

    window.addEventListener('scroll', () => {
      this.targetY = window.scrollY;
    }, { passive: true });

    this.animate();
  }

  animate() {
    this.currentY += (this.targetY - this.currentY) * this.ease;

    // Apply parallax-like transforms to sections for smooth feel
    const diff = this.targetY - this.currentY;
    document.querySelectorAll('.blob').forEach(blob => {
      const speed = parseFloat(blob.dataset.speed) || 0.02;
      blob.style.transform = `translateY(${diff * speed}px)`;
    });

    if (this.running) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

// ===== PRELOADER =====
function initPreloader() {
  return new Promise(resolve => {
    const preloader = document.getElementById('preloader');
    // Wait for preloader animation to finish, then fade out
    setTimeout(() => {
      preloader.classList.add('done');
      setTimeout(resolve, 600);
    }, 2200);
  });
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
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

function initCursor() {
  animateFollower();
  // Show cursor after preloader
  cursor.classList.add('visible');
  follower.classList.add('visible');

  // Hover effects
  const interactiveElements = document.querySelectorAll('a, button, .services__card, .portfolio__item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });
}

// ===== MAGNETIC BUTTONS =====
function initMagnetic() {
  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach(el => {
    const strength = parseInt(el.dataset.strength) || 20;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x / strength * 3}px, ${y / strength * 3}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

// ===== LIQUID TEXT SMEAR =====
function initLiquidText() {
  const chars = document.querySelectorAll('.hero__char');
  let prevX = 0;
  let prevY = 0;
  let velocityX = 0;
  let velocityY = 0;

  // Track mouse velocity
  document.addEventListener('mousemove', (e) => {
    velocityX = e.clientX - prevX;
    velocityY = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  chars.forEach(char => {
    let charBlur = 0;
    let charSkew = 0;
    let charScaleX = 1;
    let targetBlur = 0;
    let targetSkew = 0;
    let targetScaleX = 1;
    let rafId = null;

    function animate() {
      charBlur += (targetBlur - charBlur) * 0.15;
      charSkew += (targetSkew - charSkew) * 0.12;
      charScaleX += (targetScaleX - charScaleX) * 0.12;

      if (charBlur < 0.1) charBlur = 0;
      if (Math.abs(charSkew) < 0.1) charSkew = 0;
      if (Math.abs(charScaleX - 1) < 0.005) charScaleX = 1;

      char.style.filter = charBlur > 0 ? `blur(${charBlur}px)` : '';
      char.style.transform = `skewX(${charSkew}deg) scaleX(${charScaleX})`;

      if (charBlur > 0 || charSkew !== 0 || charScaleX !== 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        char.style.filter = '';
        char.style.transform = '';
        rafId = null;
      }
    }

    char.addEventListener('mouseenter', () => {
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      const clampedSpeed = Math.min(speed, 60);

      targetBlur = 2 + clampedSpeed * 0.25;
      targetSkew = Math.max(-20, Math.min(20, velocityX * 0.6));
      targetScaleX = 1 + clampedSpeed * 0.006;

      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    char.addEventListener('mouseleave', () => {
      targetBlur = 0;
      targetSkew = 0;
      targetScaleX = 1;

      if (!rafId) rafId = requestAnimationFrame(animate);
    });
  });
}

// ===== HERO CHARACTER ANIMATION =====
function initHeroChars() {
  const chars = document.querySelectorAll('.hero__char');
  chars.forEach((char, i) => {
    setTimeout(() => {
      char.classList.add('visible');
    }, i * 120);
  });

  // Reveal other hero elements after chars
  const heroReveals = document.querySelectorAll('.reveal-hero');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, chars.length * 120 + 200 + i * 150);
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-slide');

  function checkReveal() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.88) {
        const parent = el.parentElement;
        const siblings = Array.from(parent.children).filter(child =>
          child.classList.contains('reveal') ||
          child.classList.contains('reveal-up') ||
          child.classList.contains('reveal-slide')
        );
        const siblingIndex = siblings.indexOf(el);
        const delay = siblingIndex * 100;

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal();
}

// ===== NAV =====
function initNav() {
  const nav = document.getElementById('nav');

  // Show nav after preloader
  nav.classList.add('show');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('.stat__number');
  let animated = false;

  function animateCounters() {
    if (animated) return;

    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        animated = true;
        const target = parseFloat(counter.dataset.count);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = isFloat ? target.toFixed(1) : target;
          }
        }

        requestAnimationFrame(update);
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
}

// ===== PORTFOLIO HOVER IMAGE =====
function initPortfolioHover() {
  const hoverImg = document.getElementById('portfolioHoverImg');
  const hoverImgSrc = document.getElementById('portfolioHoverImgSrc');
  const items = document.querySelectorAll('.portfolio__item');
  let imgX = 0, imgY = 0;
  let targetImgX = 0, targetImgY = 0;

  function animateImg() {
    imgX += (targetImgX - imgX) * 0.1;
    imgY += (targetImgY - imgY) * 0.1;
    hoverImg.style.left = imgX + 'px';
    hoverImg.style.top = imgY + 'px';
    requestAnimationFrame(animateImg);
  }
  animateImg();

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const src = item.dataset.img;
      if (src) {
        hoverImgSrc.src = src;
        hoverImg.classList.add('active');
      }
    });

    item.addEventListener('mousemove', (e) => {
      targetImgX = e.clientX + 20;
      targetImgY = e.clientY - 125;
    });

    item.addEventListener('mouseleave', () => {
      hoverImg.classList.remove('active');
    });
  });
}

// ===== STICKY SECTION TOP CALC =====
function initStickyTops() {
  const stickySections = document.querySelectorAll('.hero, .about, .portfolio, .services, .process, .contact');
  const vh = window.innerHeight;

  function calc() {
    stickySections.forEach(section => {
      const h = section.offsetHeight;
      if (h > vh) {
        // Section taller than viewport: pin so the bottom is visible
        section.style.top = (vh - h) + 'px';
      } else {
        section.style.top = '0px';
      }
    });
  }

  calc();
  window.addEventListener('resize', calc);
}

// ===== SMOOTH ANCHOR SCROLL =====
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== INIT EVERYTHING =====
async function init() {
  // Start smooth scroll immediately
  new SmoothScroll();

  // Wait for preloader
  await initPreloader();

  // Init everything else
  initCursor();
  initMagnetic();
  initLiquidText();
  initHeroChars();
  initNav();
  initScrollReveal();
  initCounters();
  initPortfolioHover();
  initStickyTops();
  initAnchors();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
