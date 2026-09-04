/**
 * Gallery Carousel — Coverflow-style slider
 *
 * Shows one main photo in front with the previous & next photos partially
 * visible on either side. Auto-advances every 3s, is swipeable on touch,
 * navigable with the arrow buttons / dots / keyboard, and opens the
 * full-screen lightbox when a slide is clicked.
 */

const IMAGES = [
    { src: 'assets/images/gallery/DSC07855.jpg' },
    { src: 'assets/images/gallery/DSC07886%20(1).JPG' },
    { src: 'assets/images/gallery/DSC09058.JPG' },
    { src: 'assets/images/gallery/DSC09168.JPG' },
    { src: 'assets/images/gallery/IMG-20240912-WA0037.jpg' },
    { src: 'assets/images/gallery/LEH09807.JPG' },
];

const AUTO_MS = 3000;
const SWIPE_THRESHOLD = 50;
const DEFAULT_CAPTION = 'Ganesh Utsav — IIT Mandi';

export function initCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track || !IMAGES.length) return;

    const carousel = document.getElementById('gallery-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsWrap = document.getElementById('carousel-dots');

    // Respect users who prefer reduced motion: no auto-play, no animation
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build slides
    const slides = IMAGES.map((img) => {
        const el = document.createElement('div');
        el.className = 'carousel-slide gallery-item';
        el.dataset.caption = img.caption || DEFAULT_CAPTION;
        el.innerHTML = `<img src="${img.src}" alt="${el.dataset.caption}" draggable="false">`;
        track.appendChild(el);
        return el;
    });

    // Build dots
    const dots = IMAGES.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot';
        d.setAttribute('aria-label', `Go to photo ${i + 1}`);
        d.addEventListener('click', () => go(i));
        if (dotsWrap) dotsWrap.appendChild(d);
        return d;
    });

    const n = slides.length;
    let current = 0;
    let timer = null;

    function positionOf(i) {
        let pos = i - current;
        const half = Math.floor(n / 2);
        if (pos > half) pos -= n;
        if (pos < -half) pos += n;
        return pos;
    }

    function render() {
        slides.forEach((el, i) => {
            const pos = positionOf(i);
            el.dataset.position = String(pos);
            el.classList.toggle('is-active', pos === 0);
        });
        dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    function go(i) {
        current = ((i % n) + n) % n;
        render();
        restart();
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }

    function start() {
        stop();
        if (reduceMotion) return;
        timer = setInterval(next, AUTO_MS);
    }
    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { start(); }

    // Arrows
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    // Pause auto-advance while hovering
    if (carousel) {
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
    }

    // Touch swipe (horizontal drag navigates; vertical drag still scrolls the page)
    let startX = 0, startY = 0, dragging = false;
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            dragging = true;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
                e.preventDefault(); // horizontal intent — stop page scroll
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (!dragging) return;
            dragging = false;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > SWIPE_THRESHOLD) {
                dx < 0 ? next() : prev();
            }
        }, { passive: true });
    }

    // Keyboard navigation (ignored while the lightbox is open)
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    render();
    start();
}
