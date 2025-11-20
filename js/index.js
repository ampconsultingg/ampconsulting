/**
 * index.js — homepage interactions
 * Place in js/index.js
 *
 * IMPORTANT:
 * - Replace FORM_ENDPOINT_SUPPORT and FORM_ENDPOINT_CAREERS with your real endpoints (Formspree, Netlify, or your backend).
 * - This client-side code posts form data via fetch + FormData.
 */

// -----------------------------
// Configuration: replace these
// -----------------------------
const FORM_ENDPOINT_SUPPORT = 'https://formspree.io/f/your-support-endpoint'; // <- REPLACE
const FORM_ENDPOINT_CAREERS = 'https://formspree.io/f/your-careers-endpoint'; // <- REPLACE

// -----------------------------
// DOM elements
// -----------------------------
const openSupportBtn = document.getElementById('openSupportBtn');
const openSupportBtnMobile = document.getElementById('openSupportBtnMobile');
const heroSupportBtn = document.getElementById('heroSupportBtn');
const servicesSupportBtn = document.getElementById('servicesSupportBtn');

const supportModal = document.getElementById('supportModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelSupportBtn = document.getElementById('cancelSupportBtn');
const supportForm = document.getElementById('supportForm');
const supportFormMsg = document.getElementById('supportFormMsg');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// -----------------------------
// Utility
// -----------------------------
function openModal() {
  supportModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus first input
  const first = supportModal.querySelector('input, select, textarea, button');
  if (first) first.focus();
}

function closeModal() {
  supportModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  supportFormMsg.textContent = '';
  supportForm.reset();

  // Ensure personal view (default)
  setClientType('personal');
}

// -----------------------------
// Client type toggling (personal vs business)
// -----------------------------
function setClientType(type) {
  const businessFields = document.querySelectorAll('.business-only');
  if (type === 'business') {
    businessFields.forEach(n => n.hidden = false);
  } else {
    businessFields.forEach(n => n.hidden = true);
  }
}

// Attach client type radio change delegate
supportModal.addEventListener('change', (e) => {
  if (e.target && e.target.name === 'clientType') {
    setClientType(e.target.value);
  }
});

// -----------------------------
// Modal open/close events
// -----------------------------

// SAFE: PreventDefault only if needed (fixes accordion conflict)
function attachModalOpen(btn) {
  if (!btn) return;

  btn.addEventListener('click', (ev) => {
    // Only prevent default for actual support modal buttons (links)
    if (btn.tagName === 'A' || btn.getAttribute('data-open-support')) {
      ev.preventDefault();
    }
    openModal();
  });
}

attachModalOpen(openSupportBtn);
attachModalOpen(openSupportBtnMobile);
attachModalOpen(heroSupportBtn);
attachModalOpen(servicesSupportBtn);

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelSupportBtn) cancelSupportBtn.addEventListener('click', closeModal);

// close modal when clicking backdrop
supportModal.addEventListener('click', (e) => {
  if (e.target === supportModal) closeModal();
});

// ESC closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && supportModal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

// -----------------------------
// Mobile menu toggling
// -----------------------------
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', (!expanded).toString());

    if (mobileNav) {
      mobileNav.hidden = expanded;
    }
  });
}

// -----------------------------
// Form submission (support)
// -----------------------------
if (supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    supportFormMsg.textContent = 'Sending…';

    // Build FormData
    const formData = new FormData(supportForm);

    // Add extra info for server-side routing/subjecting
    formData.append('_subject', 'New Support Request — AMP Consulting');

    try {
      const res = await fetch(FORM_ENDPOINT_SUPPORT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        supportFormMsg.textContent = 'Thank you — we received your request and will contact you shortly.';
        supportForm.reset();

        // Close modal after short delay
        setTimeout(closeModal, 1800);
      } else {
        const data = await res.json().catch(() => ({}));
        supportFormMsg.textContent =
          data?.error || 'There was an issue submitting the form. Please try again or email info@ampconsulting.com';
      }
    } catch (err) {
      console.error(err);
      supportFormMsg.textContent = 'Network error. Please try again or email info@ampconsulting.com';
    }
  });
}

/* NAVBAR FADE ON SCROLL (Option B) */
let lastScroll = 0;
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // At top → always show navbar
  if (currentScroll <= 10) {
    header.classList.remove("nav-hidden");
    header.classList.add("nav-visible");
    return;
  }

  // Scrolling down → hide navbar
  if (currentScroll > lastScroll) {
    header.classList.add("nav-hidden");
    header.classList.remove("nav-visible");
  }
  // Scrolling up → show navbar
  else {
    header.classList.remove("nav-hidden");
    header.classList.add("nav-visible");
  }

  lastScroll = currentScroll;
});

/* ----------------------------------------------------------------
  NOTE on Careers & file uploads:
  - For file uploads (resumes) and emailing to multiple addresses you need a server or a form service that accepts file attachments
  - Formspree supports file uploads and forwarding to one or more recipient emails (account config)
  - Replace FORM_ENDPOINT_CAREERS with your service endpoint (or implement a small Node/PHP function)
  ----------------------------------------------------------------*/
