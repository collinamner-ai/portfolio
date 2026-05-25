document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_CONTENT;
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeButton = document.querySelector(".lightbox-close");
  const prevButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  let activeProject = 0;
  let activeImage = 0;

  document.getElementById("year").textContent = new Date().getFullYear();

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderGallery() {
    grid.innerHTML = data.projects.map((project, index) => `
      <button class="gallery-card" type="button" data-project="${index}" aria-label="Open ${project.title} gallery">
        <img src="${project.images[0]}" alt="${project.title} preview" loading="${index < 3 ? "eager" : "lazy"}">
        <span class="card-copy">
          <span>
            <h2>${project.title}</h2>
            <p>${project.type}</p>
          </span>
          <span aria-hidden="true">↗</span>
        </span>
      </button>
    `).join("");

    document.querySelectorAll(".gallery-card").forEach(card => {
      card.addEventListener("click", () => openLightbox(Number(card.dataset.project), 0));
    });
  }

  function renderLightbox() {
    const project = data.projects[activeProject];
    lightboxImage.src = project.images[activeImage];
    lightboxImage.alt = `${project.title} image ${activeImage + 1}`;
    lightboxCaption.textContent = `${pad(activeProject + 1)} / ${project.title} / ${pad(activeImage + 1)}`;
    prevButton.hidden = project.images.length < 2;
    nextButton.hidden = project.images.length < 2;
  }

  function openLightbox(projectIndex, imageIndex) {
    activeProject = projectIndex;
    activeImage = imageIndex;
    renderLightbox();
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function nextImage() {
    const images = data.projects[activeProject].images;
    activeImage = (activeImage + 1) % images.length;
    renderLightbox();
  }

  function previousImage() {
    const images = data.projects[activeProject].images;
    activeImage = (activeImage - 1 + images.length) % images.length;
    renderLightbox();
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", previousImage);
  nextButton.addEventListener("click", nextImage);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") previousImage();
  });

  renderGallery();
});
