document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return console.error("Content not found. Ensure js/content.js is loaded.");

    // --- Populate Basic Data ---
    document.title = data.site.title;
    document.getElementById('about-text').textContent = data.about.text;
    document.getElementById('services-list').innerHTML = data.services.map(s => `<li>${s}</li>`).join('');
    document.getElementById('contact-cta').textContent = data.contact.ctaText;
    document.getElementById('contact-links').innerHTML = `<a href="mailto:${data.contact.email}" class="btn-primary">Email Me</a>`;
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('footer-socials').innerHTML = data.socials.map(s => 
        `<a href="${s.url}" target="_blank" rel="noopener" style="margin-left: 1.5rem;">${s.platform}</a>`
    ).join('');

    // --- Build the Massive Project List ---
    const listContainer = document.querySelector('.archive-list');
    const previewImg = document.getElementById('hover-preview-img');
    const previewCategory = document.getElementById('preview-category');
    
    // Set initial preview image to the first project
    if (data.projects.length > 0) {
        previewImg.src = data.projects[0].images[0];
        previewImg.classList.add('active');
        previewCategory.textContent = data.projects[0].category;
        previewCategory.style.opacity = 1;
    }

    listContainer.innerHTML = data.projects.map((p, index) => `
        <div class="list-item" data-index="${index}">
            <h3 class="list-title">${p.title}</h3>
            <div class="list-meta">${p.category}</div>
            <img src="${p.images[0]}" class="mobile-inline-img" alt="${p.title}">
        </div>
    `).join('');

    // --- Hover Preview Logic (Desktop) ---
    document.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const index = this.getAttribute('data-index');
            const project = data.projects[index];
            
            // Swap image smoothly
            previewImg.classList.remove('active');
            setTimeout(() => {
                previewImg.src = project.images[0];
                previewImg.classList.add('active');
            }, 150); // Slight delay for the crossfade effect
            
            previewCategory.textContent = project.category;
        });

        // Click to open lightbox
        item.addEventListener('click', () => {
            openLightbox(this.getAttribute('data-index') || item.dataset.index);
        });
    });

    // --- Lightbox Logic ---
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
        lbCaption.textContent = `${proj.title} — Image ${currentImg + 1} of ${proj.images.length}`;
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
