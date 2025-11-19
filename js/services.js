/**
 * services.js — Services Page Interactions
 * Mirrors index.js logic
 */

// -----------------------------
// Endpoints (same as index.js)
// -----------------------------
const FORM_ENDPOINT_SUPPORT = 'https://formspree.io/f/your-support-endpoint'; // replace
const FORM_ENDPOINT_CAREERS = 'https://formspree.io/f/your-careers-endpoint'; // replace

// -----------------------------
// DOM references
// -----------------------------
const openSupportBtn = document.getElementById('openSupportBtn');
const openSupportBtnMobile = document.getElementById('openSupportBtnMobile');

const supportModal = document.getElementById('supportModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelSupportBtn = document.getElementById('cancelSupportBtn');
const supportForm = document.getElementById('supportForm');
const supportFormMsg = document.getElementById('supportFormMsg');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// -----------------------------
// Modal control
// -----------------------------
function openModal() {
  supportModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const first = supportModal.querySelector('input, select, textarea, button');
  if (first) first.focus();
}

function closeModal() {
  supportModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (supportForm) supportForm.reset();
  if (supportFormMsg) supportFormMsg.textContent = '';

  setClientType('personal');
}

// -----------------------------
// Client type toggle
// -----------------------------
function setClientType(type) {
  const businessFields = document.querySelectorAll('.business-only');

  if (type === 'business') {
    businessFields.forEach(f => f.hidden = false);
  } else {
    businessFields.forEach(f => f.hidden = true);
  }
}

if (supportModal) {
  supportModal.addEventListener('change', (e) => {
    if (e.target && e.target.name === 'clientType') {
      setClientType(e.target.value);
    }
  });
}

// -----------------------------
// Open modal buttons
// -----------------------------
[openSupportBtn, openSupportBtnMobile].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      openModal();
    });
  }
});

// Close modal buttons
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelSupportBtn) cancelSupportBtn.addEventListener('click', closeModal);

// Click backdrop close
if (supportModal) {
  supportModal.addEventListener('click', (e) => {
    if (e.target === supportModal) closeModal();
  });
}

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && supportModal?.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

// -----------------------------
// Mobile menu
// -----------------------------
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', (!expanded).toString());

    if (mobileNav) mobileNav.hidden = expanded;
  });
}

// -----------------------------
// Form submission
// -----------------------------
if (supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    supportFormMsg.textContent = 'Sending…';

    const formData = new FormData(supportForm);
    formData.append('_subject', 'New Support Request — AMP Consulting');

    try {
      const res = await fetch(FORM_ENDPOINT_SUPPORT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        supportFormMsg.textContent = 'Thank you — we received your request.';
        supportForm.reset();
        setTimeout(closeModal, 1800);
      } else {
        const data = await res.json().catch(() => ({}));
        supportFormMsg.textContent = data?.error || 'Error — please try again.';
      }
    } catch (err) {
      console.error(err);
      supportFormMsg.textContent = 'Network error — please try again.';
    }
  });
}

console.log("services.js loaded correctly.");
