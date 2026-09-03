/**
 * Gallery Lightbox
 *
 * Full-screen image viewer for the gallery section.
 * Supports keyboard navigation and touch swipe.
 */

let lightbox, lightboxImg, lightboxCaption, currentIndex;
let galleryItems = [];

/**
 * Initialize the lightbox system
 */
export function initLightbox() {
    lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightboxImg = lightbox.querySelector('.lightbox-img');
    lightboxCaption = lightbox.querySelector('.lightbox-caption');
    currentIndex = 0;

    // Collect all gallery items
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    // Bind click events
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Close button
    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Backdrop click to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Navigation arrows
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);

    // Touch swipe
    initTouchSwipe();
}

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const item = galleryItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const caption = item.dataset.caption || '';

    if (lightboxImg && img) {
        lightboxImg.src = img.dataset.full || img.src;
        lightboxImg.alt = img.alt || caption;
    }
    if (lightboxCaption) {
        lightboxCaption.textContent = caption;
    }

    // Update counter
    const counter = lightbox.querySelector('.lightbox-counter');
    if (counter) {
        counter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
}

function handleLightboxKeyboard(e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateLightbox(-1);
            break;
        case 'ArrowRight':
            navigateLightbox(1);
            break;
    }
}

function initTouchSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            navigateLightbox(diff > 0 ? 1 : -1);
        }
    }, { passive: true });
}
