/**
 * Floating Particles System
 *
 * Creates subtle golden dots and saffron petal shapes
 * that drift gently around the Ganpati artwork.
 *
 * Uses CSS animations for performance (no JS animation loop).
 */

import { PARTICLE_CONFIG } from './ganpati-svg.js';

/**
 * Generate floating particles inside the SVG
 */
export function initParticles() {
    const svgGroup = document.getElementById('particle-paths');
    if (!svgGroup) return;

    const { count, colors, minSize, maxSize, minDuration, maxDuration, range } = PARTICLE_CONFIG;

    for (let i = 0; i < count; i++) {
        const x = range.x[0] + Math.random() * (range.x[1] - range.x[0]);
        const y = range.y[0] + Math.random() * (range.y[1] - range.y[0]);
        const size = minSize + Math.random() * (maxSize - minSize);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = minDuration + Math.random() * (maxDuration - minDuration);
        const delay = Math.random() * duration;
        const opacity = 0.15 + Math.random() * 0.4;

        // Randomly choose between circle and petal shape
        const isPetal = Math.random() > 0.6;

        const el = document.createElementNS('http://www.w3.org/2000/svg', isPetal ? 'ellipse' : 'circle');

        if (isPetal) {
            el.setAttribute('cx', x);
            el.setAttribute('cy', y);
            el.setAttribute('rx', size);
            el.setAttribute('ry', size * 1.8);
            el.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
        } else {
            el.setAttribute('cx', x);
            el.setAttribute('cy', y);
            el.setAttribute('r', size);
        }

        el.setAttribute('fill', color);
        el.setAttribute('opacity', '0');
        el.classList.add('particle');
        el.style.animation = `particleFloat ${duration}s ease-in-out ${delay}s infinite`;

        svgGroup.appendChild(el);
    }
}

/**
 * Create CSS animation keyframes for particles
 */
export function injectParticleStyles() {
    if (document.getElementById('particle-styles')) return;

    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0.5);
            }
            15% {
                opacity: 0.6;
            }
            50% {
                opacity: 0.3;
                transform: translateY(-30px) scale(1);
            }
            85% {
                opacity: 0.5;
            }
            100% {
                opacity: 0;
                transform: translateY(-60px) scale(0.5);
            }
        }

        .particle {
            will-change: opacity, transform;
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
            .particle {
                animation: none !important;
                opacity: 0.3 !important;
            }
        }
    `;
    document.head.appendChild(style);
}
