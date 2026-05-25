document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_CONTENT;
  const grid = document.getElementById("work-grid");
  const projectModal = document.getElementById("project-modal");
  const contactModal = document.getElementById("contact-modal");
  const projectTitle = document.getElementById("project-title");
  const projectType = document.getElementById("project-type");
  const projectCount = document.getElementById("project-count");
  const projectImage = document.getElementById("project-image");
  const prevButton = document.querySelector(".gallery-prev");
  const nextButton = document.querySelector(".gallery-next");

  let activeProjectIndex = 0;
  let activeImageIndex = 0;

  document.getElementById("year").textContent = new Date().getFullYear();

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderGrid() {
    grid.innerHTML = data.projects.map((project, index) => `
      <button class="work-card" type="button" data-project="${index}" aria-label="Open ${project.title}">
        <img src="${project.images[0]}" alt="${project.title} thumbnail" loading="${index < 3 ? "eager" : "lazy"}">
        <span class="work-card-text">
          <h2>${project.title}</h2>
          <p>${project.type}</p>
        </span>
      </button>
    `).join("");

    document.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("click", () => openProject(Number(card.dataset.project), 0));
    });
  }

  function renderProject() {
    const project = data.projects[activeProjectIndex];
    projectTitle.textContent = project.title;
    projectType.textContent = project.type;
    projectCount.textContent = `${pad(activeProjectIndex + 1)} / ${pad(data.projects.length)}`;
    projectImage.src = project.images[activeImageIndex];
    projectImage.alt = `${project.title} image ${activeImageIndex + 1}`;
    prevButton.hidden = project.images.length < 2;
    nextButton.hidden = project.images.length < 2;
  }

  function openProject(projectIndex, imageIndex) {
    activeProjectIndex = projectIndex;
    activeImageIndex = imageIndex;
    renderProject();
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function nextImage() {
    const images = data.projects[activeProjectIndex].images;
    activeImageIndex = (activeImageIndex + 1) % images.length;
    renderProject();
  }

  function previousImage() {
    const images = data.projects[activeProjectIndex].images;
    activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
    renderProject();
  }

  function openContact() {
    contactModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeContact() {
    contactModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-project]").forEach((button) => {
    button.addEventListener("click", closeProject);
  });

  document.querySelectorAll("[data-open-contact]").forEach((button) => {
    button.addEventListener("click", openContact);
  });

  document.querySelectorAll("[data-close-contact]").forEach((button) => {
    button.addEventListener("click", closeContact);
  });

  prevButton.addEventListener("click", previousImage);
  nextButton.addEventListener("click", nextImage);

  document.addEventListener("keydown", (event) => {
    const projectOpen = projectModal.getAttribute("aria-hidden") === "false";
    const contactOpen = contactModal.getAttribute("aria-hidden") === "false";

    if (event.key === "Escape") {
      if (projectOpen) closeProject();
      if (contactOpen) closeContact();
    }

    if (projectOpen && event.key === "ArrowRight") nextImage();
    if (projectOpen && event.key === "ArrowLeft") previousImage();
  });

  renderGrid();
});
