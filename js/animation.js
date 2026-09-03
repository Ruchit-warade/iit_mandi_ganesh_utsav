/**
 * Ganpati Drawing Animation Engine
 *
 * Uses SVG stroke-dasharray / stroke-dashoffset to animate
 * the Ganpati artwork being "drawn" stroke by stroke.
 *
 * Animation plays ONCE, then stops permanently.
 */

import { GANPATI_PATHS } from './ganpati-svg.js';

const TOTAL_DRAW_DURATION = 4500; // 4.5 seconds for complete drawing
const STAGGER_WINDOW = 0.55;      // fraction of total time for stagger spread

let isComplete = false;
let completedCallback = null;

/**
 * Initialize the Ganpati drawing animation.
 * Call this after the SVG is rendered in the DOM.
 *
 * @param {Function} onComplete - Called when drawing finishes
 */
export function initDrawingAnimation(onComplete) {
    completedCallback = onComplete;

    const svgGroup = document.getElementById('ganpati-paths');
    if (!svgGroup) {
        console.warn('Ganpati SVG group not found');
        if (onComplete) onComplete();
        return;
    }

    const pathElements = svgGroup.querySelectorAll('path');
    if (pathElements.length === 0) {
        console.warn('No path elements found in Ganpati SVG');
        if (onComplete) onComplete();
        return;
    }

    // Build a map of path configs by id for quick lookup
    const pathConfigMap = {};
    GANPATI_PATHS.forEach(p => { pathConfigMap[p.id] = p; });

    // Initialize each path: set dasharray = total length, dashoffset = total length
    const animationData = [];

    pathElements.forEach(pathEl => {
        const id = pathEl.getAttribute('data-id') || pathEl.id;
        const config = pathConfigMap[id] || { delay: 0, strokeWidth: 2 };

        let length;
        try {
            length = pathEl.getTotalLength();
        } catch (e) {
            length = 1000; // fallback
        }

        // Set initial hidden state
        pathEl.style.strokeDasharray = length;
        pathEl.style.strokeDashoffset = length;
        pathEl.style.strokeWidth = config.strokeWidth || 2;
        pathEl.style.strokeLinecap = 'round';
        pathEl.style.strokeLinejoin = 'round';
        pathEl.style.fill = 'none';

        animationData.push({
            element: pathEl,
            length,
            delay: config.delay || 0,
        });
    });

    // Start animation after a brief settling delay
    setTimeout(() => {
        animatePaths(animationData);
    }, 400);
}

/**
 * Animate all paths with staggered delays
 */
function animatePaths(animationData) {
    // Find the maximum delay to know total animation window
    const maxDelay = Math.max(...animationData.map(d => d.delay));
    const drawWindow = TOTAL_DRAW_DURATION * STAGGER_WINDOW;
    const perPathDuration = TOTAL_DRAW_DURATION * 0.45;

    animationData.forEach(({ element, length, delay }) => {
        // Calculate when this path should start drawing
        const normalizedDelay = maxDelay > 0 ? (delay / maxDelay) : 0;
        const startOffset = normalizedDelay * drawWindow;
        const duration = Math.max(perPathDuration, 600);

        element.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${startOffset}ms`;
        element.style.strokeDashoffset = '0';
    });

    // Schedule completion callback
    const totalTime = drawWindow + perPathDuration + 200;
    setTimeout(() => {
        isComplete = true;

        // Remove transitions and lock the final state
        animationData.forEach(({ element }) => {
            element.style.transition = 'none';
            element.style.strokeDashoffset = '0';
        });

        if (completedCallback) {
            completedCallback();
        }
    }, totalTime);
}

/**
 * Check if drawing animation is complete
 */
export function isDrawingComplete() {
    return isComplete;
}

/**
 * Add a subtle glow effect to the completed Ganpati
 */
export function addGlowEffect() {
    const svg = document.getElementById('ganpati-svg');
    if (!svg) return;

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    filter.innerHTML = `
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feFlood flood-color="#D4A843" flood-opacity="0.4" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `;
    svg.insertBefore(filter, svg.firstChild);

    const ganpatiGroup = document.getElementById('ganpati-paths');
    if (ganpatiGroup) {
        ganpatiGroup.style.filter = 'url(#gold-glow)';
    }
}
