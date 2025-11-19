/* ------------------------------------------------------
   CAREERS PAGE — AMP CONSULTING
   Page-specific scripts
------------------------------------------------------ */

/* ------------------------------------------------------
   1. DYNAMIC JOB POSITIONS
------------------------------------------------------ */

const jobData = [
  {
    title: "IT Technician",
    description: "Hands-on Apple device troubleshooting, optimization, maintenance, and client support."
  },
  {
    title: "Field Engineer",
    description: "On-site IT support, network deployment, and Apple ecosystem setup."
  },
  {
    title: "Client Support Analyst",
    description: "Remote technical support, workflow troubleshooting, and client assistance."
  }
];

const jobContainer = document.getElementById("jobsContainer");

function renderJobCards() {
  if (!jobContainer) return;

  jobContainer.innerHTML = "";

  jobData.forEach(job => {
    const card = document.createElement("article");
    card.className = "card career-card";

    card.innerHTML = `
      <div class="card-accent"></div>
      <h3>${job.title}</h3>
      <p>${job.description}</p>
      <button class="btn btn-primary applyBtn" data-role="${job.title}">
        Apply Now
      </button>
    `;

    jobContainer.appendChild(card);
  });

  attachApplyEvents();
}

renderJobCards();


/* ------------------------------------------------------
   2. APPLY MODAL CONTROL
------------------------------------------------------ */

const applyModal = document.getElementById("applyModal");
const applyJobTitle = document.getElementById("applyJobTitle");  // FIXED
const closeApplyModal = document.getElementById("closeApplyModal"); // FIXED
const cancelApplyBtn = document.getElementById("cancelApplyBtn"); // FIXED
const applyJobValue = document.getElementById("applyJobValue"); // FIXED
const applyForm = document.getElementById("applyForm");
const applyFormMsg = document.getElementById("applyFormMsg");

function attachApplyEvents() {
  const applyButtons = document.querySelectorAll(".applyBtn");

  applyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const roleName = btn.dataset.role;
      openApplyModal(roleName);
    });
  });
}

function openApplyModal(role) {
  applyJobTitle.textContent = `Apply — ${role}`;
  applyJobValue.value = role;

  applyModal.removeAttribute("hidden");
  document.body.classList.add("no-scroll");
}

function closeApply() {
  applyModal.setAttribute("hidden", "");
  document.body.classList.remove("no-scroll");
}

if (closeApplyModal) closeApplyModal.addEventListener("click", closeApply);
if (cancelApplyBtn) cancelApplyBtn.addEventListener("click", closeApply);

// Close on background click
applyModal.addEventListener("click", (e) => {
  if (e.target === applyModal) closeApply();
});

// ESC closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeApply();
});


/* ------------------------------------------------------
   3. APPLICATION FORM SUBMIT
------------------------------------------------------ */

applyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  applyFormMsg.textContent = "Submitting application…";
  applyFormMsg.style.color = "var(--text-muted)";

  setTimeout(() => {
    applyFormMsg.textContent = "Application submitted successfully!";
    applyFormMsg.style.color = "var(--primary)";
    applyForm.reset();
  }, 1200);
});


/* ------------------------------------------------------
   4. Smooth scroll for future button (optional)
------------------------------------------------------ */
const viewJobsBtn = document.getElementById("viewJobsBtn");
const jobsSection = document.getElementById("jobsSection");

if (viewJobsBtn && jobsSection) {
  viewJobsBtn.addEventListener("click", () => {
    jobsSection.scrollIntoView({ behavior: "smooth" });
  });
}
