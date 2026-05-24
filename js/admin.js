document.addEventListener('DOMContentLoaded', () => {
  let data = JSON.parse(localStorage.getItem('portfolioDraft') || JSON.stringify(window.PORTFOLIO_CONTENT));
  const form = document.getElementById('editor-form');

  function field(label, path, value, textarea = false) {
    return `<div><label>${label}</label>${textarea ? `<textarea data-path="${path}">${value || ''}</textarea>` : `<input data-path="${path}" value="${value || ''}">`}</div>`;
  }

  function render() {
    form.innerHTML = `
      <section class="editor-card">
        <h2>Main text</h2>
        <div class="editor-grid">
          ${field('Hero kicker', 'hero.kicker', data.hero.kicker)}
          ${field('Hero line', 'hero.line', data.hero.line)}
        </div>
        ${field('Hero title — HTML line breaks allowed', 'hero.title', data.hero.title, true)}
        ${field('About strip', 'about', data.about, true)}
        ${field('Contact link — hidden behind buttons, not displayed as text', 'contactHref', data.contactHref)}
      </section>
      <section class="editor-card">
        <h2>Projects</h2>
        ${data.projects.map((p, i) => `
          <div class="project-editor">
            <h3>${i + 1}. ${p.title}</h3>
            <div class="editor-grid">
              ${field('Title', `projects.${i}.title`, p.title)}
              ${field('Category', `projects.${i}.category`, p.category)}
              ${field('Thumbnail', `projects.${i}.thumbnail`, p.thumbnail)}
              ${field('Images, comma separated', `projects.${i}.images`, p.images.join(', '))}
            </div>
            ${field('Description', `projects.${i}.description`, p.description, true)}
          </div>
        `).join('')}
      </section>
    `;
    form.querySelectorAll('[data-path]').forEach(input => input.addEventListener('input', update));
  }

  function update(e) {
    const path = e.target.dataset.path.split('.');
    if (path[0] === 'projects') {
      const index = Number(path[1]);
      const key = path[2];
      data.projects[index][key] = key === 'images' ? e.target.value.split(',').map(item => item.trim()).filter(Boolean) : e.target.value;
      return;
    }
    if (path.length === 2) data[path[0]][path[1]] = e.target.value;
    else data[path[0]] = e.target.value;
  }

  document.getElementById('save-draft').addEventListener('click', () => {
    localStorage.setItem('portfolioDraft', JSON.stringify(data));
    alert('Draft saved in this browser.');
  });

  document.getElementById('export-content').addEventListener('click', () => {
    const blob = new Blob([`window.PORTFOLIO_CONTENT = ${JSON.stringify(data, null, 2)};\n`], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content.js';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  render();
});
