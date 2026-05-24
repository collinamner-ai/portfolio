(function () {
    'use strict';

    const STORAGE_KEY = 'portfolioDraft.v2';
    const defaultContent = window.PORTFOLIO_CONTENT;

    if (!defaultContent) {
        console.error('Portfolio content not found. Make sure js/content.js loads before js/admin.js.');
        return;
    }

    const clone = (value) => JSON.parse(JSON.stringify(value));
    let data = clone(defaultContent);

    const form = document.getElementById('admin-form');
    const output = document.getElementById('admin-output');

    const escapeHtml = (value = '') => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    function setStatus(message) {
        if (output) output.textContent = message;
    }

    function getValue(path) {
        return path.split('.').reduce((source, key) => source?.[key], data) ?? '';
    }

    function setValue(path, value) {
        const keys = path.split('.');
        const last = keys.pop();
        const target = keys.reduce((source, key) => {
            if (!source[key]) source[key] = {};
            return source[key];
        }, data);
        target[last] = value;
    }

    function splitList(value, separator = '\n') {
        return String(value)
            .split(separator)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function field(label, path, options = {}) {
        const value = options.value ?? getValue(path);
        const type = options.type || 'text';
        const rows = options.rows || 4;
        const textarea = options.textarea === true;

        return `
            <div class="form-group">
                <label for="${escapeHtml(path)}">${escapeHtml(label)}</label>
                ${textarea
                    ? `<textarea id="${escapeHtml(path)}" class="form-control" data-path="${escapeHtml(path)}" rows="${rows}">${escapeHtml(value)}</textarea>`
                    : `<input id="${escapeHtml(path)}" class="form-control" data-path="${escapeHtml(path)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}">`
                }
            </div>
        `;
    }

    function renderArrayEditor(title, items, name, placeholderTitle = 'Title', placeholderText = 'Text') {
        return `
            <div class="admin-card" id="sec-${name}">
                <h2>${escapeHtml(title)}</h2>
                <div id="${name}-container">
                    ${items.map((item, index) => `
                        <div class="project-editor" data-array="${name}" data-index="${index}">
                            <div class="project-editor-header">
                                <strong>${escapeHtml(title)} ${index + 1}</strong>
                                <button class="btn btn-sm btn-danger" type="button" data-action="remove-array-item" data-array="${name}" data-index="${index}">Remove</button>
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>${escapeHtml(placeholderTitle)}</label>
                                    <input class="form-control array-field" data-array="${name}" data-index="${index}" data-field="title" value="${escapeHtml(item.title)}">
                                </div>
                                <div class="form-group">
                                    <label>${escapeHtml(placeholderText)}</label>
                                    <input class="form-control array-field" data-array="${name}" data-index="${index}" data-field="text" value="${escapeHtml(item.text)}">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary" type="button" data-action="add-array-item" data-array="${name}">Add item</button>
            </div>
        `;
    }

    function renderProject(project, index) {
        return `
            <div class="project-editor" data-project-index="${index}">
                <div class="project-editor-header">
                    <strong>Project ${index + 1}</strong>
                    <div class="project-actions">
                        <button class="btn btn-sm btn-secondary" type="button" data-action="move-project-up" data-index="${index}">Move up</button>
                        <button class="btn btn-sm btn-secondary" type="button" data-action="move-project-down" data-index="${index}">Move down</button>
                        <button class="btn btn-sm btn-danger" type="button" data-action="remove-project" data-index="${index}">Remove</button>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Title</label>
                        <input class="form-control project-field" data-index="${index}" data-field="title" value="${escapeHtml(project.title)}">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input class="form-control project-field" data-index="${index}" data-field="category" value="${escapeHtml(project.category)}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control project-field" data-index="${index}" data-field="description" rows="3">${escapeHtml(project.description)}</textarea>
                </div>
                <div class="form-group">
                    <label>Images — one URL or file path per line</label>
                    <textarea class="form-control project-field" data-index="${index}" data-field="images" rows="4">${escapeHtml((project.images || []).join('\n'))}</textarea>
                </div>
            </div>
        `;
    }

    function renderForm() {
        if (!form) return;

        form.innerHTML = `
            <section class="admin-card" id="sec-hero">
                <h2>Hero & site information</h2>
                <div class="form-grid">
                    ${field('Site title', 'site.title')}
                    ${field('Location line', 'hero.location')}
                    ${field('Name', 'hero.name')}
                    ${field('Role', 'hero.role')}
                </div>
                ${field('Headline', 'hero.headline', { textarea: true, rows: 3 })}
                ${field('Support text', 'hero.supportText', { textarea: true, rows: 4 })}
                ${field('Availability / role focus', 'hero.availability', { textarea: true, rows: 3 })}
            </section>

            <section class="admin-card" id="sec-profile">
                <h2>Profile, services & skills</h2>
                ${field('About title', 'about.title', { textarea: true, rows: 2 })}
                ${field('About text', 'about.text', { textarea: true, rows: 5 })}
                ${field('Services — one per line', 'services', { value: (data.services || []).join('\n'), textarea: true, rows: 6 })}
                ${field('Skills — one per line', 'skills', { value: (data.skills || []).join('\n'), textarea: true, rows: 6 })}
            </section>

            ${renderArrayEditor('Employer value points', data.employerValue || [], 'employerValue', 'Heading', 'Supporting text')}

            <section class="admin-card" id="sec-projects">
                <h2>Projects</h2>
                <div id="projects-container">${(data.projects || []).map(renderProject).join('')}</div>
                <button class="btn btn-secondary" type="button" data-action="add-project">Add project</button>
            </section>

            <section class="admin-card" id="sec-contact">
                <h2>Contact</h2>
                <div class="form-grid">
                    ${field('Email', 'contact.email', { type: 'email' })}
                    ${field('Phone', 'contact.phone')}
                </div>
                ${field('Contact call to action', 'contact.ctaText', { textarea: true, rows: 4 })}
                ${field('Social links — format: Label | URL', 'socials', { value: (data.socials || []).map((item) => `${item.platform} | ${item.url}`).join('\n'), textarea: true, rows: 4 })}
            </section>
        `;

        bindFormEvents();
    }

    function bindFormEvents() {
        form.querySelectorAll('[data-path]').forEach((input) => {
            input.addEventListener('input', (event) => {
                const path = event.target.dataset.path;
                if (path === 'services' || path === 'skills') {
                    data[path] = splitList(event.target.value, '\n');
                } else if (path === 'socials') {
                    data.socials = splitList(event.target.value, '\n').map((line) => {
                        const [platform = '', ...urlParts] = line.split('|');
                        return { platform: platform.trim(), url: urlParts.join('|').trim() || '#' };
                    }).filter((item) => item.platform);
                } else {
                    setValue(path, event.target.value);
                }
            });
        });

        form.querySelectorAll('.project-field').forEach((input) => {
            input.addEventListener('input', (event) => {
                const index = Number(event.target.dataset.index);
                const fieldName = event.target.dataset.field;
                if (!data.projects[index]) return;
                data.projects[index][fieldName] = fieldName === 'images'
                    ? splitList(event.target.value, '\n')
                    : event.target.value;
            });
        });

        form.querySelectorAll('.array-field').forEach((input) => {
            input.addEventListener('input', (event) => {
                const arrayName = event.target.dataset.array;
                const index = Number(event.target.dataset.index);
                const fieldName = event.target.dataset.field;
                if (!data[arrayName]?.[index]) return;
                data[arrayName][index][fieldName] = event.target.value;
            });
        });

        form.querySelectorAll('[data-action]').forEach((button) => {
            button.addEventListener('click', handleAction);
        });
    }

    function handleAction(event) {
        const action = event.currentTarget.dataset.action;
        const index = Number(event.currentTarget.dataset.index);
        const arrayName = event.currentTarget.dataset.array;

        if (action === 'add-project') {
            data.projects.push({
                id: `project-${Date.now()}`,
                title: 'New Project',
                category: 'Category',
                description: 'Short outcome-focused description.',
                images: ['assets/img/project-placeholder.svg']
            });
        }

        if (action === 'remove-project' && confirm('Remove this project?')) {
            data.projects.splice(index, 1);
        }

        if (action === 'move-project-up' && index > 0) {
            [data.projects[index - 1], data.projects[index]] = [data.projects[index], data.projects[index - 1]];
        }

        if (action === 'move-project-down' && index < data.projects.length - 1) {
            [data.projects[index + 1], data.projects[index]] = [data.projects[index], data.projects[index + 1]];
        }

        if (action === 'add-array-item' && arrayName) {
            data[arrayName] = data[arrayName] || [];
            data[arrayName].push({ title: 'New point', text: 'Describe the value clearly.' });
        }

        if (action === 'remove-array-item' && arrayName && confirm('Remove this item?')) {
            data[arrayName].splice(index, 1);
        }

        renderForm();
    }

    function saveDraft() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setStatus('Draft saved in this browser.');
    }

    function clearDraft() {
        if (!confirm('Clear the local draft and reload the original content.js data?')) return;
        localStorage.removeItem(STORAGE_KEY);
        data = clone(defaultContent);
        renderForm();
        setStatus('Draft cleared.');
    }

    function exportContent() {
        const fileContent = `window.PORTFOLIO_CONTENT = ${JSON.stringify(data, null, 2)};\n`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'content.js';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setStatus('Exported content.js. Replace the existing js/content.js file with the downloaded file.');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const draft = localStorage.getItem(STORAGE_KEY);
        if (draft) {
            try {
                data = JSON.parse(draft);
                setStatus('Loaded your saved local draft.');
            } catch (error) {
                console.warn('Could not parse saved draft. Using default content.', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        renderForm();
        document.getElementById('btn-save-draft')?.addEventListener('click', saveDraft);
        document.getElementById('btn-clear-draft')?.addEventListener('click', clearDraft);
        document.getElementById('btn-export')?.addEventListener('click', exportContent);
    });
}());
