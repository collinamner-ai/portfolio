const content = getContent();

function getValue(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], content) || '';
}

document.querySelectorAll('[data-bind]').forEach((element) => {
  element.textContent = getValue(element.dataset.bind);
});

document.querySelectorAll('[data-img]').forEach((element) => {
  element.src = getValue(element.dataset.img);
});

const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('open')));

const galleryGrid = document.querySelector('#galleryGrid');
const lightbox = document.querySelector('#galleryLightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxTitle = document.querySelector('#lightboxTitle');
const lightboxMeta = document.querySelector('#lightboxMeta');
const lightboxDescription = document.querySelector('#lightboxDescription');
const lightboxClose = document.querySelector('#lightboxClose');
const lightboxPrev = document.querySelector('#lightboxPrev');
const lightboxNext = document.querySelector('#lightboxNext');
let activeProjectIndex = 0;
let lastFocusedElement = null;

function renderLightboxProject(index) {
  const project = content.gallery[index];
  if (!project) return;

  activeProjectIndex = index;
  lightboxImage.src = project.image;
  lightboxImage.alt = project.title;
  lightboxTitle.textContent = project.title;
  lightboxMeta.textContent = project.category || '';
  lightboxDescription.textContent = project.description || '';
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  renderLightboxProject(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-active');
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-active');
  lightboxImage.src = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

function showPreviousProject() {
  const nextIndex = (activeProjectIndex - 1 + content.gallery.length) % content.gallery.length;
  renderLightboxProject(nextIndex);
}

function showNextProject() {
  const nextIndex = (activeProjectIndex + 1) % content.gallery.length;
  renderLightboxProject(nextIndex);
}

content.gallery.forEach((project, index) => {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.innerHTML = `
    <button class="project-image-button" type="button" aria-label="Expand ${project.title} image">
      <img src="${project.image}" alt="${project.title}">
      <span class="project-expand-label">Expand image</span>
    </button>
    <div class="project-content">
      <h3>${project.title}</h3>
      <p>${project.category}</p>
      <p class="project-description">${project.description}</p>
    </div>
  `;
  article.querySelector('.project-image-button').addEventListener('click', () => openLightbox(index));
  galleryGrid.appendChild(article);
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', showPreviousProject);
lightboxNext?.addEventListener('click', showNextProject);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPreviousProject();
  if (event.key === 'ArrowRight') showNextProject();
});

const skillList = document.querySelector('#skillList');
content.skills.forEach((skill) => {
  const item = document.createElement('span');
  item.className = 'skill-chip';
  item.textContent = skill;
  skillList.appendChild(item);
});

const experienceList = document.querySelector('#experienceList');
content.experience.forEach((job) => {
  const item = document.createElement('article');
  item.className = 'experience-item';
  item.innerHTML = `
    <div class="experience-meta"><strong>${job.period}</strong><strong>${job.role}</strong><span>${job.company}</span></div>
    <div class="experience-details">${job.details}</div>
  `;
  experienceList.appendChild(item);
});

const emailLink = document.querySelector('#emailLink');
emailLink.textContent = content.site.email;
emailLink.href = `mailto:${content.site.email}`;

function externalUrl(value) {
  if (!value) return '#';
  return value.startsWith('http') ? value : `https://${value}`;
}

const githubLink = document.querySelector('#githubLink');
githubLink.textContent = content.site.github;
githubLink.href = externalUrl(content.site.github);

const linkedinLink = document.querySelector('#linkedinLink');
linkedinLink.textContent = content.site.linkedin;
linkedinLink.href = externalUrl(content.site.linkedin);
