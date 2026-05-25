let content = getContent();
const $ = (selector) => document.querySelector(selector);
const status = $('#status');

function showStatus(message, type = 'success') {
  status.textContent = message;
  status.className = `status show ${type}`;
  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => status.className = 'status', 3500);
}

function setInput(id, value) { const el = $(id); if (el) el.value = value || ''; }
function getInput(id) { return $(id)?.value || ''; }

function loadForm() {
  $('#adminInitials').textContent = content.site.initials;
  setInput('#siteName', content.site.name);
  setInput('#siteInitials', content.site.initials);
  setInput('#siteRole', content.site.role);
  setInput('#siteIntro', content.site.intro);
  setInput('#siteFooter', content.site.footer);
  setInput('#heroEyebrow', content.hero.eyebrow);
  setInput('#heroCta', content.hero.cta);
  setInput('#aboutTitle', content.about.title);
  setInput('#aboutBody', content.about.body);
  setInput('#siteEmail', content.site.email);
  setInput('#siteLocation', content.site.location);
  setInput('#siteGithub', content.site.github);
  setInput('#siteLinkedin', content.site.linkedin);
  $('#heroPreview').src = content.hero.image;
  renderGalleryEditor();
  renderSkillsEditor();
  renderExperienceEditor();
}

function collectForm() {
  content.site.name = getInput('#siteName');
  content.site.initials = getInput('#siteInitials');
  content.site.role = getInput('#siteRole');
  content.site.intro = getInput('#siteIntro');
  content.site.footer = getInput('#siteFooter');
  content.hero.eyebrow = getInput('#heroEyebrow');
  content.hero.cta = getInput('#heroCta');
  content.about.title = getInput('#aboutTitle');
  content.about.body = getInput('#aboutBody');
  content.site.email = getInput('#siteEmail');
  content.site.location = getInput('#siteLocation');
  content.site.github = getInput('#siteGithub');
  content.site.linkedin = getInput('#siteLinkedin');
}

function saveAll() {
  collectForm();
  saveContent(content);
  $('#adminInitials').textContent = content.site.initials;
  $('#previewFrame')?.contentWindow?.location?.reload();
  showStatus('Saved. Open the preview or website to see your updates.');
}

function renderGalleryEditor() {
  const wrap = $('#galleryEditor');
  wrap.innerHTML = '';
  content.gallery.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'admin-card';
    card.innerHTML = `
      <div class="card-head"><h3>Project ${index + 1}</h3><div class="card-actions"><button class="btn secondary small" data-action="up" data-index="${index}">Up</button><button class="btn secondary small" data-action="down" data-index="${index}">Down</button><button class="btn danger small" data-action="delete" data-index="${index}">Delete</button></div></div>
      <div class="form-grid">
        <div class="field"><label>Project Title</label><input data-project="title" data-index="${index}" value="${escapeAttr(project.title)}"></div>
        <div class="field"><label>Category</label><input data-project="category" data-index="${index}" value="${escapeAttr(project.category)}"></div>
        <div class="field full"><label>Description</label><textarea data-project="description" data-index="${index}">${escapeHtml(project.description)}</textarea></div>
        <div class="field full"><label>Image</label><div class="image-control"><img class="image-preview" src="${project.image}" alt="${escapeAttr(project.title)} preview"><div class="upload-box"><span>Swap placeholder image</span><input type="file" accept="image/*" data-image-index="${index}"></div></div></div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

function renderSkillsEditor() {
  const wrap = $('#skillsEditor');
  wrap.innerHTML = '';
  content.skills.forEach((skill, index) => {
    const card = document.createElement('article');
    card.className = 'admin-card';
    card.innerHTML = `<div class="form-grid"><div class="field"><label>Skill</label><input data-skill-index="${index}" value="${escapeAttr(skill)}"></div><div class="field"><label>Action</label><button class="btn danger" data-delete-skill="${index}">Delete Skill</button></div></div>`;
    wrap.appendChild(card);
  });
}

function renderExperienceEditor() {
  const wrap = $('#experienceEditor');
  wrap.innerHTML = '';
  content.experience.forEach((job, index) => {
    const card = document.createElement('article');
    card.className = 'admin-card';
    card.innerHTML = `
      <div class="card-head"><h3>Experience ${index + 1}</h3><button class="btn danger small" data-delete-experience="${index}">Delete</button></div>
      <div class="form-grid">
        <div class="field"><label>Period</label><input data-exp="period" data-index="${index}" value="${escapeAttr(job.period)}"></div>
        <div class="field"><label>Role</label><input data-exp="role" data-index="${index}" value="${escapeAttr(job.role)}"></div>
        <div class="field"><label>Company</label><input data-exp="company" data-index="${index}" value="${escapeAttr(job.company)}"></div>
        <div class="field full"><label>Details</label><textarea data-exp="details" data-index="${index}">${escapeHtml(job.details)}</textarea></div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

function escapeHtml(value = '') { return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function escapeAttr(value = '') { return escapeHtml(value).replace(/'/g, '&#39;'); }

$('#saveAll').addEventListener('click', saveAll);
$('#exportJson').addEventListener('click', () => { collectForm(); downloadJson(content); });
$('#resetAll').addEventListener('click', () => {
  if (!confirm('Reset all CMS content back to the default placeholders?')) return;
  resetContent(); content = getContent(); loadForm(); showStatus('Content reset to defaults.');
});
$('#refreshPreview')?.addEventListener('click', () => $('#previewFrame').src = 'index.html');

$('#importJson').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    content = JSON.parse(await readFileAsText(file));
    saveContent(content);
    loadForm();
    showStatus('Imported JSON content successfully.');
  } catch (error) {
    showStatus('Could not import that JSON file.', 'error');
  }
});

$('#heroImage').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  content.hero.image = await readFileAsDataUrl(file);
  $('#heroPreview').src = content.hero.image;
});

document.querySelector('.admin-nav').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-panel]');
  if (!button) return;
  document.querySelectorAll('.admin-nav button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.cms-panel').forEach(panel => panel.classList.add('hidden'));
  $(`#${button.dataset.panel}`).classList.remove('hidden');
});

$('#addProject').addEventListener('click', () => {
  content.gallery.push({ title: 'New Project', category: 'Category', description: 'Add a short project description here.', image: 'assets/img/project-01.svg' });
  renderGalleryEditor();
});
$('#addSkill').addEventListener('click', () => { content.skills.push('New Skill'); renderSkillsEditor(); });
$('#addExperience').addEventListener('click', () => { content.experience.push({ period: 'Year – Year', role: 'Job Title', company: 'Company', details: 'Describe your role and results.' }); renderExperienceEditor(); });

document.addEventListener('input', (event) => {
  const projectField = event.target.dataset.project;
  if (projectField) content.gallery[event.target.dataset.index][projectField] = event.target.value;
  const skillIndex = event.target.dataset.skillIndex;
  if (skillIndex !== undefined) content.skills[skillIndex] = event.target.value;
  const expField = event.target.dataset.exp;
  if (expField) content.experience[event.target.dataset.index][expField] = event.target.value;
});

document.addEventListener('change', async (event) => {
  const imageIndex = event.target.dataset.imageIndex;
  if (imageIndex === undefined) return;
  const file = event.target.files[0];
  if (!file) return;
  content.gallery[imageIndex].image = await readFileAsDataUrl(file);
  renderGalleryEditor();
});

document.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const index = Number(actionButton.dataset.index);
    const action = actionButton.dataset.action;
    if (action === 'delete') content.gallery.splice(index, 1);
    if (action === 'up' && index > 0) [content.gallery[index - 1], content.gallery[index]] = [content.gallery[index], content.gallery[index - 1]];
    if (action === 'down' && index < content.gallery.length - 1) [content.gallery[index + 1], content.gallery[index]] = [content.gallery[index], content.gallery[index + 1]];
    renderGalleryEditor();
  }
  const deleteSkill = event.target.dataset.deleteSkill;
  if (deleteSkill !== undefined) { content.skills.splice(Number(deleteSkill), 1); renderSkillsEditor(); }
  const deleteExperience = event.target.dataset.deleteExperience;
  if (deleteExperience !== undefined) { content.experience.splice(Number(deleteExperience), 1); renderExperienceEditor(); }
});

loadForm();
