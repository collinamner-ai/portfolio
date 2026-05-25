document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_CONTENT;
  const grid = document.getElementById("project-grid");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeButton = document.querySelector(".modal-close");
  const prevButton = document.querySelector(".modal-prev");
  const nextButton = document.querySelector(".modal-next");

  let activeProject = 0;
  let activeImage = 0;

  document.getElementById("about-text").textContent = data.about;
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("services-list").innerHTML = data.services.map(item => `<li>${item}</li>`).join("");
  document.getElementById("contact-link").href = data.contactUrl;

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function renderProjects() {
    grid.innerHTML = data.projects.map((project, index) => `
      <button class="project-card" type="button" data-project="${index}" aria-label="Open ${project.title}">
        <div class="project-thumb">
          <img src="${project.images[0]}" alt="${project.title} preview" loading="${index < 3 ? "eager" : "lazy"}">
        </div>
        <div class="project-meta">
          <h2>${project.title}</h2>
          <p>${project.type}</p>
        </div>
      </button>
    `).join("");

    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("click", () => openModal(Number(card.dataset.project), 0));
    });
  }

  function renderModal() {
    const project = data.projects[activeProject];
    modalImage.src = project.images[activeImage];
    modalImage.alt = `${project.title} image ${activeImage + 1}`;
    modalCaption.textContent = `${pad(activeProject + 1)} / ${project.title} / ${pad(activeImage + 1)}`;
    prevButton.hidden = project.images.length < 2;
    nextButton.hidden = project.images.length < 2;
  }

  function openModal(projectIndex, imageIndex) {
    activeProject = projectIndex;
    activeImage = imageIndex;
    renderModal();
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function nextImage() {
    const project = data.projects[activeProject];
    activeImage = (activeImage + 1) % project.images.length;
    renderModal();
  }

  function prevImage() {
    const project = data.projects[activeProject];
    activeImage = (activeImage - 1 + project.images.length) % project.images.length;
    renderModal();
  }

  closeButton.addEventListener("click", closeModal);
  nextButton.addEventListener("click", nextImage);
  prevButton.addEventListener("click", prevImage);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (modal.getAttribute("aria-hidden") === "true") return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") prevImage();
  });

  renderProjects();
});
