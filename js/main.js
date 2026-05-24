document.addEventListener("DOMContentLoaded", () => {
  const data = window.PORTFOLIO_CONTENT;
  const projectsEl = document.querySelector(".projects");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const contactLink = document.getElementById("contact-link");

  let activeProject = 0;
  let activeImage = 0;

  document.getElementById("about-text").textContent = data.about;
  document.getElementById("year").textContent = new Date().getFullYear();
  contactLink.href = data.contactUrl;

  function twoDigits(number) {
    return String(number).padStart(2, "0");
  }

  function renderProjects() {
    projectsEl.innerHTML = data.projects.map((project, index) => {
      const images = project.images.slice(0, 4);
      return `
        <article class="project" id="project-${twoDigits(index + 1)}">
          <p class="project-number">${twoDigits(index + 1)}</p>
          <div class="project-gallery">
            ${images.map((image, imageIndex) => `
              <button class="project-image-button" type="button" data-project="${index}" data-image="${imageIndex}" aria-label="Open ${project.title} image ${imageIndex + 1}">
                <img src="${image}" alt="${project.title} portfolio image ${imageIndex + 1}" loading="${index === 0 ? "eager" : "lazy"}">
              </button>
            `).join("")}
          </div>
          <div class="project-copy">
            <h2>${project.title}</h2>
            <p class="project-type">${project.type}</p>
            <p class="project-description">${project.description}</p>
            <button class="project-open" type="button" data-project="${index}" data-image="0">Open gallery ↗</button>
          </div>
        </article>
      `;
    }).join("");

    document.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => {
        openLightbox(Number(button.dataset.project), Number(button.dataset.image));
      });
    });
  }

  function renderLightbox() {
    const project = data.projects[activeProject];
    const image = project.images[activeImage];
    lightboxImage.src = image;
    lightboxImage.alt = `${project.title} gallery image ${activeImage + 1}`;
    lightboxCaption.textContent = `${twoDigits(activeProject + 1)} / ${project.title} / ${twoDigits(activeImage + 1)}`;
    prevBtn.hidden = project.images.length < 2;
    nextBtn.hidden = project.images.length < 2;
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
    const project = data.projects[activeProject];
    activeImage = (activeImage + 1) % project.images.length;
    renderLightbox();
  }

  function prevImage() {
    const project = data.projects[activeProject];
    activeImage = (activeImage - 1 + project.images.length) % project.images.length;
    renderLightbox();
  }

  document.querySelector("[data-close]").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  nextBtn.addEventListener("click", nextImage);
  prevBtn.addEventListener("click", prevImage);

  document.addEventListener("keydown", (event) => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") prevImage();
  });

  renderProjects();
});