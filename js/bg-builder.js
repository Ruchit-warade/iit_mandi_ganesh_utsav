/**
 * Shared Background Builder
 *
 * Builds the fixed background SVG (mountains + particles)
 * Used across index.html, contribute.html, dashboard-login.html
 *
 * On resize/orientation change the background is re-laid out in place —
 * it never reloads the page (reloading on mobile breaks scroll + typing,
 * because the URL bar and keyboard fire resize events).
 */

import { MOUNTAIN_PATHS } from './ganpati-svg.js?v=2';

/**
 * Build the fixed background into the given SVG element
 * @param {SVGElement} canvas - The #bg-canvas element
 */
export function buildBackground(canvas) {
    if (!canvas) return;

    // Keep references so we can re-layout on resize without rebuilding the DOM
    const mountainPaths = [];
    let particleGroup;

    // Mountains
    ['back', 'mid', 'front'].forEach(layer => {
        const config = MOUNTAIN_PATHS[layer];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('mountain-svg-layer', `mountain-${layer}`);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', config.d);
        path.setAttribute('fill', config.color);
        path.setAttribute('opacity', config.opacity);
        g.appendChild(path);
        canvas.appendChild(g);
        mountainPaths.push(path);
    });

    // Particles group
    particleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    particleGroup.id = 'particle-paths';
    canvas.appendChild(particleGroup);

    // Layout: recompute the viewBox + transforms from the current viewport
    function layout() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        canvas.setAttribute('viewBox', `0 0 ${Math.max(vw, 1500)} ${Math.max(vh, 800)}`);

        const vwScaled = Math.max(vw, 1500);
        const vhScaled = Math.max(vh, 800);

        mountainPaths.forEach(path => {
            path.setAttribute('transform', `scale(${vwScaled / 1500} ${vhScaled / 600})`);
        });

        particleGroup.setAttribute('transform',
            `translate(${vwScaled / 2 - 250}, ${vhScaled * 0.08}) scale(${Math.min(vwScaled / 700, vhScaled / 750, 1.1)})`
        );
    }

    layout();

    // Re-layout (debounced) on resize — never reload the page
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 150);
    });
}
