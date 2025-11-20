/**
 * services.js — Services Page Interactions
 * Adds accordion behavior + modal logic + mobile menu + form submission
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
const servicesSupportBtn = document.getElementById('servicesSupportBtn');

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
  businessFields.forEach(f => f.hidden = (type !== 'business'));
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
[openSupportBtn, openSupportBtnMobile, servicesSupportBtn].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      openModal();
    });
  }
});

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelSupportBtn) cancelSupportBtn.addEventListener('click', closeModal);

// Click backdrop close
if (supportModal) {
  supportModal.addEventListener('click', (e) => {
    if (e.target === supportModal) closeModal();
  });
}

// Escape key closes modal
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
// Support form submission
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

// ----------------------------------------------------
// Accordion Logic — FIXED so content actually reveals
// ----------------------------------------------------
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  const content = item.querySelector('.accordion-content');
  const chevron = item.querySelector('.accordion-chevron');

  header.addEventListener('click', () => {
    const isOpen = header.getAttribute('aria-expanded') === 'true';

    // Close all other items
    accordionItems.forEach(other => {
      if (other !== item) {
        const oh = other.querySelector('.accordion-header');
        const oc = other.querySelector('.accordion-content');
        const ocv = other.querySelector('.accordion-chevron');

        oh.setAttribute('aria-expanded', 'false');
        oc.style.maxHeight = null;
        oc.hidden = true;
        ocv.style.transform = 'rotate(0deg)';
      }
    });

    if (!isOpen) {
      // OPEN THIS ONE
      header.setAttribute('aria-expanded', 'true');

      content.hidden = false;              // Unhide BEFORE measuring height
      content.style.maxHeight = null;      // Reset any previous height
      const fullHeight = content.scrollHeight;
      content.style.maxHeight = fullHeight + "px";

      chevron.style.transform = 'rotate(180deg)';

    } else {
      // CLOSE THIS ONE
      header.setAttribute('aria-expanded', 'false');
      content.style.maxHeight = null;
      chevron.style.transform = 'rotate(0deg)';

      // Hide after animation
      setTimeout(() => {
        if (header.getAttribute('aria-expanded') === 'false') {
          content.hidden = true;
        }
      }, 300);
    }
  });
});
