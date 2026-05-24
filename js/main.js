document.addEventListener('DOMContentLoaded', () => {
  const data = window.PORTFOLIO_CONTENT;
  const projects = data.projects;

  document.getElementById('hero-kicker').textContent = data.hero.kicker;
  document.getElementById('hero-title').innerHTML = data.hero.title;
  document.getElementById('hero-line').textContent = data.hero.line;
  document.getElementById('about-text').textContent = data.about;

  document.getElementById('contact-link').href = data.contactHref;
  document.getElementById('footer-contact-link').href = data.contactHref;

  const featured = projects[0];
  document.getElementById('featured-image').src = featured.thumbnail;
  document.getElementById('featured-title').textContent = featured.title;
  document.getElementById('featured-category').textContent = featured.category;
  document.getElementById('featured-card').addEventListener('click', () => openProject(0));

  const grid = document.getElementById('work-grid');
  projects.slice(1).forEach((project, index) => {
    const realIndex = index + 1;
    const card = document.createElement('button');
    card.className = 'work-card';
    card.type = 'button';
    card.innerHTML = `
      <img src="${project.thumbnail}" alt="${project.title} preview" />
      <span>
        <strong>${project.title}</strong>
        <small>${project.category}</small>
      </span>
    `;
    card.addEventListener('click', () => openProject(realIndex));
    grid.appendChild(card);
  });

  const dialog = document.getElementById('project-dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogCategory = document.getElementById('dialog-category');
  const dialogDescription = document.getElementById('dialog-description');
  const dialogImage = document.getElementById('dialog-image');
  const prevButton = document.getElementById('prev-image');
  const nextButton = document.getElementById('next-image');
  let activeProject = 0;
  let activeImage = 0;

  function updateDialogImage() {
    const project = projects[activeProject];
    dialogImage.src = project.images[activeImage];
    dialogImage.alt = `${project.title} image ${activeImage + 1}`;
    const hasMultipleImages = project.images.length > 1;
    prevButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
  }

  function openProject(index) {
    activeProject = index;
    activeImage = 0;
    const project = projects[index];
    dialogTitle.textContent = project.title;
    dialogCategory.textContent = project.category;
    dialogDescription.textContent = project.description;
    updateDialogImage();
    dialog.showModal();
  }

  function changeImage(direction) {
    const images = projects[activeProject].images;
    activeImage = (activeImage + direction + images.length) % images.length;
    updateDialogImage();
  }

  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  prevButton.addEventListener('click', () => changeImage(-1));
  nextButton.addEventListener('click', () => changeImage(1));

  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
  });
});
