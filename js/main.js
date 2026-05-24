document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return console.error("Content not found. Ensure js/content.js is loaded.");

    // Header & Titles
    document.title = data.site.title;
    document.getElementById('nav-logo').textContent = data.hero.name;
    
    // Hero
    document.getElementById('hero-title').innerHTML = data.hero.headline;
    document.getElementById('hero-support').textContent = data.hero.supportText;
    
    document.getElementById('hero-stats').innerHTML = data.stats.map(s => `
        <div class="stat-item">
            <span class="stat-value">${s.value}</span>
            <span class="stat-label">${s.label}</span>
        </div>
    `).join('');

    // Profile & Services
    document.getElementById('about-text').textContent = data.about.text;
    document.getElementById('services-list').innerHTML = data.services.map(s => `<li>${s}</li>`).join('');

    // Contact & Footer
    document.getElementById('contact-cta').textContent = data.contact.ctaText;
    document.getElementById('contact-links').innerHTML = `
        <a href="mailto:${data.contact.email}" class="btn-primary">Email Me</a>
    `;
    
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('footer-socials').innerHTML = data.socials.map(s => 
        `<a href="${s.url}" target="_blank" rel="noopener">${s.platform}</a>`
    ).join('');

    // Projects & Filters
    const projectGrid = document.getElementById('project-grid');
    const filterContainer = document.getElementById('project-filters');
    const categories = ['All', ...new Set(data.projects.map(p => p.category))];
    
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
            <div class="project-card" data-index="${data.projects.indexOf(p)}" role="button" tabindex="0">
                <div class="project-img-wrapper">
                    <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
                </div>
                <div class="project-meta">${p.category}</div>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.description}</p>
            </div>
        `).join('');

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => openLightbox(card.dataset.index));
        });
    }

    filterContainer.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProjects(e.target.dataset.filter);
        }
    });

    renderProjects();

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    let currentProj = 0, currentImg = 0;

    function openLightbox(idx) {
        currentProj = parseInt(idx); currentImg = 0;
        updateLightbox();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const proj = data.projects[currentProj];
        lbImg.src = proj.images[currentImg];
        lbCaption.textContent = `${proj.title} — ${currentImg + 1} / ${proj.images.length}`;
    }

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => {
        const p = data.projects[currentProj];
        currentImg = (currentImg - 1 + p.images.length) % p.images.length;
        updateLightbox();
    });
    document.querySelector('.lightbox-next').addEventListener('click', () => {
        const p = data.projects[currentProj];
        currentImg = (currentImg + 1) % p.images.length;
        updateLightbox();
    });
});
