document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return console.error("Content not found. Ensure js/content.js is loaded.");

    // --- Render Content ---
    document.title = data.site.title;
    document.getElementById('nav-logo').textContent = data.hero.name;
    
    // Hero
    document.getElementById('hero-role').textContent = data.hero.role;
    document.getElementById('hero-title').textContent = data.hero.headline;
    document.getElementById('hero-support').textContent = data.hero.supportText;
    
    const statsHtml = data.stats.map(s => `
        <div class="stat-item">
            <div class="stat-value">${s.value}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');
    document.getElementById('hero-stats').innerHTML = statsHtml;

    // Skills Marquee
    const skillsHtml = data.skills.map(s => `<span class="marquee-item">${s}</span>`).join('');
    // Duplicate for smooth infinite scroll
    document.getElementById('skills-track').innerHTML = skillsHtml + skillsHtml + skillsHtml;

    // About & Services
    document.getElementById('about-text').textContent = data.about.text;
    document.getElementById('services-list').innerHTML = data.services.map(s => `<li>${s}</li>`).join('');

    // Contact & Footer
    document.getElementById('contact-cta').textContent = data.contact.ctaText;
    document.getElementById('contact-links').innerHTML = `
        <a href="mailto:${data.contact.email}" class="btn btn-primary">Email Me</a>
        <a href="tel:${data.contact.phone.replace(/[^0-9+]/g, '')}" class="btn btn-secondary">Call Me</a>
    `;
    
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('footer-socials').innerHTML = data.socials.map(s => 
        `<a href="${s.url}" target="_blank" rel="noopener">${s.platform}</a>`
    ).join(' | ');

    // --- Projects & Filters ---
    const projectGrid = document.getElementById('project-grid');
    const filterContainer = document.getElementById('project-filters');
    
    // Extract unique categories
    const categories = ['All', ...new Set(data.projects.map(p => p.category))];
    
    // Render Filters (skip 'All' as it's hardcoded)
    categories.slice(1).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
    });

    function renderProjects(filter = 'All') {
        const filtered = filter === 'All' ? data.projects : data.projects.filter(p => p.category === filter);
        projectGrid.innerHTML = filtered.map((p, index) => `
            <div class="project-card" data-index="${data.projects.indexOf(p)}" role="button" tabindex="0" aria-label="View ${p.title}">
                <div class="project-img-wrapper">
                    <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
                </div>
                <div class="project-meta">${p.category}</div>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.description}</p>
            </div>
        `).join('');

        // Attach Lightbox events
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => openLightbox(card.dataset.index));
            card.addEventListener('keydown', (e) => { if(e.key === 'Enter') openLightbox(card.dataset.index); });
        });
    }

    // Filter Logic
    filterContainer.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProjects(e.target.dataset.filter);
        }
    });

    renderProjects();

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    let currentProjectIndex = 0;
    let currentImageIndex = 0;

    function openLightbox(projIndex) {
        currentProjectIndex = parseInt(projIndex);
        currentImageIndex = 0;
        updateLightbox();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        lbImg.focus();
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const proj = data.projects[currentProjectIndex];
        lbImg.src = proj.images[currentImageIndex];
        lbImg.alt = proj.title;
        lbCaption.textContent = `${proj.title} - Image ${currentImageIndex + 1} of ${proj.images.length}`;
    }

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        const proj = data.projects[currentProjectIndex];
        currentImageIndex = (currentImageIndex - 1 + proj.images.length) % proj.images.length;
        updateLightbox();
    });
    document.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        const proj = data.projects[currentProjectIndex];
        currentImageIndex = (currentImageIndex + 1) % proj.images.length;
        updateLightbox();
    });
    
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
        if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
    });

    // --- Mobile Menu ---
    document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
        document.querySelector('.main-nav').classList.toggle('active');
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolioTheme', newTheme);
    });
});
