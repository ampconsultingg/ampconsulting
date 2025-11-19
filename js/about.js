/**
 * about.js — page-specific interactions/animations for About page
 * - Staggered glass card reveal
 * - Section fade-ins
 * - Process-step slide-ins
 *
 * Safe to load on any page; it will no-op if selectors are missing.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Helper: create observer with common options
  const observerOpts = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  };

  // ---- 1) Staggered glass cards + fade the whole row ----
  const staggerContainer = document.querySelector('[data-animate="stagger"]');
  if (staggerContainer) {
    const cards = Array.from(staggerContainer.querySelectorAll('[data-animate="item"]'));

    // observer for the container (fade-in)
    const rowObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          staggerContainer.classList.add('in');

          // stagger animation for each card
          cards.forEach((card, i) => {
            // set small delay per card
            card.style.transitionDelay = `${i * 120}ms`;
            // add class to run CSS transition
            requestAnimationFrame(() => card.classList.add('in'));
          });

          obs.unobserve(entry.target);
        }
      });
    }, observerOpts);

    rowObserver.observe(staggerContainer);
  }

  // ---- 2) Generic section fade-in (for any element with data-animate="section") ----
  const sectionEls = document.querySelectorAll('[data-animate="section"]');
  if (sectionEls.length) {
    const sectionObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, observerOpts);

    sectionEls.forEach(el => sectionObserver.observe(el));
  }

  // ---- 3) Process steps slide-in (each .process-step) ----
  const steps = document.querySelectorAll('.process-step');
  if (steps.length) {
    const stepsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    steps.forEach(s => stepsObserver.observe(s));
  }

  // Optional: gentle entrance for the hero (if present)
  const hero = document.querySelector('.about-hero-inner');
  if (hero) {
    hero.style.opacity = 0;
    hero.style.transform = 'translateY(8px)';
    setTimeout(() => {
      hero.style.transition = 'opacity .55s ease, transform .55s cubic-bezier(.2,.9,.2,1)';
      hero.style.opacity = 1;
      hero.style.transform = 'translateY(0)';
    }, 120);
  }

});
