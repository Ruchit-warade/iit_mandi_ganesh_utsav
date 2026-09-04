/**
 * Main Entry Point — IIT Mandi Ganesh Utsav
 *
 * Orchestrates:
 * 1. Build SVG background (mountains + Ganpati + particles)
 * 2. Run Ganpati drawing animation
 * 3. On animation complete → reveal hero content
 * 4. Initialize scroll animations
 * 5. Initialize lightbox
 */

import { initParticles, injectParticleStyles } from './particles.js?v=4';
import { initScrollAnimations, revealHeroContent } from './scroll.js?v=5';
import { initLightbox } from './lightbox.js?v=4';
import { initCarousel } from './carousel.js?v=4';
import { buildBackground } from './bg-builder.js?v=4';

document.addEventListener('DOMContentLoaded', () => {
    // Build the background layers
    buildBackground(document.getElementById('bg-canvas'));

    // Inject particle CSS animations
    injectParticleStyles();

    // Reveal content immediately (no Ganpati animation)
    revealHeroContent();
    document.body.classList.remove('loading');

    // Initialize particles
    initParticles();

    // Initialize scroll reveal (slight delay so hero has time to appear)
    setTimeout(() => {
        initScrollAnimations();
    }, 1000);

    // Initialize gallery carousel (renders local photos first so the lightbox can bind to them)
    initCarousel();

    // Initialize lightbox
    initLightbox();

    // Initialize navigation
    initNavigation();

    // Load dynamic content (team, and Firebase gallery if a grid exists) from Firebase
    loadDynamicContent();
});

/**
 * Initialize navigation (mobile toggle, scroll state, smooth scroll)
 */
function initNavigation() {
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Nav background on scroll
    window.addEventListener('scroll', () => {
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('open');
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Load dynamic content (gallery, team) from Firebase
 * Falls back to placeholders if Firebase not configured
 */
async function loadDynamicContent() {
    try {
        const { db } = await import('./firebase-config.js?v=2');
        const { collection, getDocs, orderBy, query } =
            await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        // Load gallery and team in parallel so a slow gallery never blocks the team tab.
        // Each load handles its own errors and falls back to placeholders independently.
        await Promise.all([
            loadGallery(db, collection, getDocs, orderBy, query),
            loadTeam(db, collection, getDocs, orderBy, query),
        ]);

        // Re-bind lightbox after gallery loads
        initLightbox();
    } catch (e) {
        // Firebase not configured — show placeholders
        renderGalleryPlaceholders();
        renderTeamPlaceholders();
    } finally {
        // Re-scan for dynamically-added .scroll-reveal elements (team cards,
        // gallery items) so they get observed and actually become visible.
        initScrollAnimations();
    }
}

async function loadGallery(db, collection, getDocs, orderBy, query) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    let snapshot;
    try {
        const q = query(collection(db, 'gallery'), orderBy('order'));
        snapshot = await getDocs(q);
    } catch (e) {
        console.warn('Gallery load failed:', e);
        renderGalleryPlaceholders();
        return;
    }

    if (snapshot.empty) {
        renderGalleryPlaceholders();
        return;
    }

    grid.innerHTML = '';
    const items = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        items.push({ id: doc.id, ...data });
    });

    items.forEach((item, index) => {
        const featured = index === 0 ? ' featured' : '';
        const el = document.createElement('div');
        el.className = `gallery-item scroll-reveal${featured}`;
        el.dataset.caption = item.caption || '';
        el.innerHTML = `
            <img src="${item.url}" alt="${item.caption || 'Ganesh Utsav'}" loading="lazy">
            <div class="gallery-caption">${item.caption || 'Ganesh Utsav'}</div>
        `;
        grid.appendChild(el);
    });
}

async function loadTeam(db, collection, getDocs, orderBy, query) {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    let snapshot;
    try {
        const q = query(collection(db, 'organisers'), orderBy('order'));
        snapshot = await getDocs(q);
    } catch (e) {
        console.warn('Team load failed:', e);
        renderTeamPlaceholders();
        return;
    }

    if (snapshot.empty) {
        renderTeamPlaceholders();
        return;
    }

    grid.innerHTML = '';

    snapshot.forEach(doc => {
        const data = doc.data();
        const el = document.createElement('div');
        el.className = 'team-card scroll-reveal';
        const displayName = data.displayName || data.name || '?';
        const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        el.innerHTML = `
            ${data.photoUrl
                ? `<img class="team-photo" src="${data.photoUrl}" alt="${displayName}">
                   <div class="team-name">${displayName}</div>
                   <div class="team-role">${data.role || 'Organiser'}</div>`
                : `<div class="team-photo-placeholder">${initials}</div>
                   <div class="team-name">${displayName}</div>
                   <div class="team-role">${data.role || 'Organiser'}</div>`}
        `;
        grid.appendChild(el);
    });
}

function renderGalleryPlaceholders() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const placeholders = [
        { caption: 'Ganpati Sthapana', featured: true },
        { caption: 'Evening Aarti', featured: false },
        { caption: 'Festive Decoration', featured: false },
        { caption: 'Devotional Songs', featured: false },
        { caption: 'Community Prasad', featured: false },
    ];

    grid.innerHTML = placeholders.map((p, i) => `
        <div class="gallery-item scroll-reveal ${p.featured ? 'featured' : ''}" data-caption="${p.caption}">
            <div class="gallery-placeholder">🪔</div>
            <div class="gallery-caption">${p.caption}</div>
        </div>
    `).join('');
}

function renderTeamPlaceholders() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    const members = [
        { name: 'Event Lead', role: 'Organising Team' },
        { name: 'Co-Lead', role: 'Organising Team' },
        { name: 'Treasurer', role: 'Finance' },
        { name: 'Coordinator', role: 'Volunteers' },
    ];

    grid.innerHTML = members.map((m, i) => `
        <div class="team-card scroll-reveal delay-${i % 4}">
            <div class="team-photo-placeholder">${m.name[0]}</div>
            <div class="team-name">${m.name}</div>
            <div class="team-role">${m.role}</div>
        </div>
    `).join('');
}

