(function () {
    'use strict';

    const data = window.PORTFOLIO_CONTENT;

    if (!data) {
        console.error('Portfolio content not found. Make sure js/content.js loads before js/main.js.');
        return;
    }

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const escapeHtml = (value = '') => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const isUsableUrl = (url = '') => {
        const trimmed = String(url).trim();
        return trimmed && trimmed !== '#';
    };

    const firstImage = (project) => {
        const image = project?.images?.find(Boolean);
        return image || 'assets/img/project-placeholder.svg';
    };

    function getPath(path) {
        return path.split('.').reduce((source, key) => source?.[key], data) ?? '';
    }

    function renderTextBindings() {
        document.title = data.site?.title || 'Portfolio';

        const description = $('meta[name="description"]');
        if (description && data.site?.description) description.setAttribute('content', data.site.description);

        $$('[data-content]').forEach((node) => {
            node.textContent = getPath(node.dataset.content);
        });
    }

    function renderStats() {
        const target = $('#stats-list');
        if (!target) return;

        target.innerHTML = (data.stats || []).map((stat) => `
            <div class="stat">
                <strong>${escapeHtml(stat.value)}</strong>
                <span>${escapeHtml(stat.label)}</span>
            </div>
        `).join('');
    }

    function renderProjects() {
        const target = $('#project-list-container');
        if (!target) return;

        const projects = data.projects || [];
        target.innerHTML = projects.map((project, index) => `
            <article class="project-card">
                <div class="project-media">
                    <img src="${escapeHtml(firstImage(project))}" alt="${escapeHtml(project.title)} preview" loading="lazy">
                    <span class="project-tag">${escapeHtml(project.category)}</span>
                </div>
                <div class="project-body">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <button class="btn btn-secondary" type="button" data-project-index="${index}">View gallery</button>
                </div>
            </article>
        `).join('');

        $$('[data-project-index]', target).forEach((button) => {
            button.addEventListener('click', () => openLightbox(Number(button.dataset.projectIndex)));
        });
    }

    function renderProfile() {
        const about = $('#about-text');
        if (about) about.textContent = data.about?.text || '';

        const employerValue = $('#employer-value-list');
        if (employerValue) {
            employerValue.innerHTML = (data.employerValue || []).map((item) => `
                <div class="value-card">
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.text)}</p>
                </div>
            `).join('');
        }
    }

    function renderSkills() {
        const services = $('#services-list');
        const skills = $('#skills-list');

        if (services) services.innerHTML = (data.services || []).map((service) => `<li>${escapeHtml(service)}</li>`).join('');
        if (skills) skills.innerHTML = (data.skills || []).map((skill) => `<li>${escapeHtml(skill)}</li>`).join('');
    }

    function renderContact() {
        const cta = $('#contact-cta');
        const target = $('#contact-links');
        const footerSocials = $('#footer-socials');
        const currentYear = $('#current-year');

        if (cta) cta.textContent = data.contact?.ctaText || '';
        if (currentYear) currentYear.textContent = new Date().getFullYear();

        const rows = [];
        if (data.contact?.email) {
            rows.push(`<div class="contact-row"><span>Email</span><a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a></div>`);
        }
        if (data.contact?.phone) {
            const phoneHref = data.contact.phone.replace(/[^+\d]/g, '');
            rows.push(`<div class="contact-row"><span>Phone</span><a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(data.contact.phone)}</a></div>`);
        }
        (data.socials || []).filter((social) => isUsableUrl(social.url)).forEach((social) => {
            rows.push(`<div class="contact-row"><span>${escapeHtml(social.platform)}</span><a href="${escapeHtml(social.url)}" target="_blank" rel="noopener">Open</a></div>`);
        });

        if (target) {
            target.innerHTML = `
                <h3>Contact details</h3>
                ${rows.join('') || '<p>Add contact details in js/content.js.</p>'}
                ${data.contact?.email ? `<div class="hero-actions"><a class="btn btn-primary" href="mailto:${escapeHtml(data.contact.email)}?subject=Portfolio%20enquiry">Start a conversation</a></div>` : ''}
            `;
        }

        if (footerSocials) {
            footerSocials.innerHTML = (data.socials || [])
                .filter((social) => isUsableUrl(social.url))
                .map((social) => `<a href="${escapeHtml(social.url)}" target="_blank" rel="noopener">${escapeHtml(social.platform)}</a>`)
                .join('');
        }
    }

    function setupNavigation() {
        const toggle = $('.nav-toggle');
        const nav = $('#site-nav');
        if (!toggle || !nav) return;

        const closeNav = () => {
            nav.classList.remove('open');
            document.body.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            document.body.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });

        $$('a', nav).forEach((link) => link.addEventListener('click', closeNav));
    }

    const lightbox = $('#lightbox');
    const lightboxImage = $('#lightbox-img');
    const lightboxTitle = $('#lightbox-title');
    const lightboxCaption = $('#lightbox-caption');
    const prevButton = $('.lightbox-prev');
    const nextButton = $('.lightbox-next');
    let activeProjectIndex = 0;
    let activeImageIndex = 0;
    let lastFocusedElement = null;

    function currentProject() {
        return data.projects?.[activeProjectIndex];
    }

    function updateLightbox() {
        const project = currentProject();
        if (!project || !lightboxImage) return;

        const images = project.images?.length ? project.images : [firstImage(project)];
        activeImageIndex = (activeImageIndex + images.length) % images.length;

        lightboxImage.src = images[activeImageIndex];
        lightboxImage.alt = `${project.title} image ${activeImageIndex + 1}`;
        if (lightboxTitle) lightboxTitle.textContent = project.title;
        if (lightboxCaption) {
            lightboxCaption.textContent = `${project.category} · ${project.description} · Image ${activeImageIndex + 1} of ${images.length}`;
        }

        const multipleImages = images.length > 1;
        if (prevButton) prevButton.hidden = !multipleImages;
        if (nextButton) nextButton.hidden = !multipleImages;
    }

    function openLightbox(projectIndex) {
        if (!lightbox || !data.projects?.[projectIndex]) return;
        lastFocusedElement = document.activeElement;
        activeProjectIndex = projectIndex;
        activeImageIndex = 0;
        updateLightbox();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        $('.lightbox-close')?.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        if (lastFocusedElement?.focus) lastFocusedElement.focus();
    }

    function stepLightbox(direction) {
        const project = currentProject();
        if (!project) return;
        const length = project.images?.length || 1;
        activeImageIndex = (activeImageIndex + direction + length) % length;
        updateLightbox();
    }

    function setupLightbox() {
        if (!lightbox) return;

        $('.lightbox-close')?.addEventListener('click', closeLightbox);
        prevButton?.addEventListener('click', () => stepLightbox(-1));
        nextButton?.addEventListener('click', () => stepLightbox(1));

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (event) => {
            if (lightbox.classList.contains('hidden')) return;
            if (event.key === 'Escape') closeLightbox();
            if (event.key === 'ArrowLeft') stepLightbox(-1);
            if (event.key === 'ArrowRight') stepLightbox(1);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderTextBindings();
        renderStats();
        renderProjects();
        renderProfile();
        renderSkills();
        renderContact();
        setupNavigation();
        setupLightbox();
    });
}());
