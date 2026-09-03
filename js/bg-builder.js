/**
 * Shared Background Builder
 *
 * Builds the fixed background SVG (mountains + particles)
 * Used across index.html, contribute.html, dashboard-login.html
 */

import { MOUNTAIN_PATHS } from './ganpati-svg.js';

/**
 * Build the fixed background into the given SVG element
 * @param {SVGElement} canvas - The #bg-canvas element
 */
export function buildBackground(canvas) {
    if (!canvas) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.setAttribute('viewBox', `0 0 ${Math.max(vw, 1500)} ${Math.max(vh, 800)}`);

    const vwScaled = Math.max(vw, 1500);
    const vhScaled = Math.max(vh, 800);

    // Mountains
    ['back', 'mid', 'front'].forEach(layer => {
        const config = MOUNTAIN_PATHS[layer];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('mountain-svg-layer', `mountain-${layer}`);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', config.d);
        path.setAttribute('fill', config.color);
        path.setAttribute('opacity', config.opacity);
        path.setAttribute('transform', `scale(${vwScaled / 1500} ${vhScaled / 600})`);
        g.appendChild(path);
        canvas.appendChild(g);
    });

    // Particles group
    const particleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    particleGroup.id = 'particle-paths';
    particleGroup.setAttribute('transform',
        `translate(${vwScaled / 2 - 250}, ${vhScaled * 0.08}) scale(${Math.min(vwScaled / 700, vhScaled / 750, 1.1)})`
    );
    canvas.appendChild(particleGroup);

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => location.reload(), 500);
    });
}
