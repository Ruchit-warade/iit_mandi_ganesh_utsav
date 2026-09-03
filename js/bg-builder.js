/**
 * Shared Background Builder
 *
 * Builds the fixed background SVG (mountains + Ganpati + particles)
 * Used across index.html, contribute.html, dashboard-login.html
 */

import { MOUNTAIN_PATHS } from './ganpati-svg.js';

export const GANPATI_PATH_DATA = [
    { id: 'crown-base', d: 'M 155 195 Q 170 175 200 168 Q 220 165 250 168 Q 280 165 300 168 Q 330 175 345 195', sw: 2.2 },
    { id: 'crown-left', d: 'M 155 195 Q 158 170 175 150 Q 195 128 215 118', sw: 2.2 },
    { id: 'crown-right', d: 'M 345 195 Q 342 170 325 150 Q 305 128 285 118', sw: 2.2 },
    { id: 'crown-peak', d: 'M 215 118 Q 230 95 250 85 Q 270 95 285 118', sw: 2.2 },
    { id: 'crown-jewel', d: 'M 240 100 Q 250 92 260 100 Q 250 108 240 100', sw: 1.8 },
    { id: 'crown-ornament-l', d: 'M 190 140 Q 200 132 210 138', sw: 1.5 },
    { id: 'crown-ornament-r', d: 'M 310 140 Q 300 132 290 138', sw: 1.5 },
    { id: 'crown-band', d: 'M 170 185 Q 210 178 250 176 Q 290 178 330 185', sw: 1.2 },
    { id: 'face-left', d: 'M 175 205 Q 150 225 142 260 Q 135 300 145 340 Q 155 370 180 385 Q 200 395 220 398', sw: 2.4 },
    { id: 'face-right', d: 'M 325 205 Q 350 225 358 260 Q 365 300 355 340 Q 345 370 320 385 Q 300 395 280 398', sw: 2.4 },
    { id: 'forehead', d: 'M 175 205 Q 200 198 250 195 Q 300 198 325 205', sw: 2.2 },
    { id: 'ear-left', d: 'M 145 235 Q 115 245 100 275 Q 90 310 100 340 Q 115 360 140 355', sw: 2.2 },
    { id: 'ear-left-inner', d: 'M 140 255 Q 122 265 115 290 Q 112 315 120 335', sw: 1.5 },
    { id: 'ear-right', d: 'M 355 235 Q 385 245 400 275 Q 410 310 400 340 Q 385 360 360 355', sw: 2.2 },
    { id: 'ear-right-inner', d: 'M 360 255 Q 378 265 385 290 Q 388 315 380 335', sw: 1.5 },
    { id: 'tilak', d: 'M 240 210 Q 250 200 260 210 Q 255 218 250 222 Q 245 218 240 210', sw: 1.5 },
    { id: 'eye-left', d: 'M 200 270 Q 210 262 222 268 Q 210 276 200 270', sw: 1.8 },
    { id: 'eye-left-pupil', d: 'M 208 268 Q 212 265 216 268 Q 212 271 208 268', sw: 1.5 },
    { id: 'eye-right', d: 'M 300 270 Q 290 262 278 268 Q 290 276 300 270', sw: 1.8 },
    { id: 'eye-right-pupil', d: 'M 292 268 Q 288 265 284 268 Q 288 271 292 268', sw: 1.5 },
    { id: 'eyebrow-left', d: 'M 196 258 Q 210 250 225 255', sw: 1.5 },
    { id: 'eyebrow-right', d: 'M 304 258 Q 290 250 275 255', sw: 1.5 },
    { id: 'tusk-left', d: 'M 215 370 Q 205 385 210 400 Q 215 410 225 415', sw: 2.0 },
    { id: 'tusk-right', d: 'M 285 370 Q 295 385 300 395', sw: 2.0 },
    { id: 'trunk-bridge', d: 'M 220 398 Q 225 405 230 415 Q 240 430 245 445', sw: 2.4 },
    { id: 'trunk-main', d: 'M 245 445 Q 248 465 240 485 Q 230 505 215 518 Q 198 530 185 535', sw: 2.6 },
    { id: 'trunk-curl', d: 'M 185 535 Q 175 540 168 535 Q 162 528 168 520 Q 178 515 188 520', sw: 2.2 },
    { id: 'trunk-right', d: 'M 280 398 Q 270 410 265 425 Q 260 440 260 455', sw: 2.0 },
    { id: 'body-left', d: 'M 180 385 Q 165 410 158 440 Q 152 475 160 505 Q 170 525 190 540', sw: 2.2 },
    { id: 'body-right', d: 'M 320 385 Q 335 410 342 440 Q 348 475 340 505 Q 330 525 310 540', sw: 2.2 },
    { id: 'body-belly', d: 'M 190 540 Q 210 560 250 568 Q 290 560 310 540', sw: 2.0 },
    { id: 'body-belly-detail', d: 'M 220 520 Q 250 535 280 520', sw: 1.2 },
    { id: 'arm-left-upper', d: 'M 160 440 Q 140 445 120 455 Q 105 465 95 480', sw: 2.0 },
    { id: 'arm-left-lower', d: 'M 95 480 Q 88 495 92 510 Q 98 518 108 515', sw: 1.8 },
    { id: 'modak', d: 'M 102 508 Q 108 500 114 508 Q 108 516 102 508', sw: 1.5 },
    { id: 'arm-right-upper', d: 'M 340 440 Q 360 445 380 455 Q 395 465 405 480', sw: 2.0 },
    { id: 'arm-right-lower', d: 'M 405 480 Q 412 495 408 510 Q 402 518 392 515', sw: 1.8 },
    { id: 'blessing-hand', d: 'M 395 505 Q 398 495 405 498 Q 412 502 408 510', sw: 1.3 },
    { id: 'leg-left', d: 'M 190 540 Q 170 555 155 565 Q 140 575 145 585 Q 155 590 175 585 Q 195 578 210 568', sw: 2.0 },
    { id: 'leg-right', d: 'M 310 540 Q 330 555 345 565 Q 360 575 355 585 Q 345 590 325 585 Q 305 578 290 568', sw: 2.0 },
    { id: 'necklace', d: 'M 195 395 Q 220 410 250 415 Q 280 410 305 395', sw: 1.3 },
    { id: 'necklace-pendant', d: 'M 245 412 Q 250 420 255 412', sw: 1.3 },
    { id: 'earring-left', d: 'M 130 350 Q 125 360 130 368 Q 135 360 130 350', sw: 1.2 },
    { id: 'earring-right', d: 'M 370 350 Q 375 360 370 368 Q 365 360 370 350', sw: 1.2 },
];

/**
 * Build the fixed background into the given SVG element
 * @param {SVGElement} canvas - The #bg-canvas element
 */
export function buildBackground(canvas) {
    if (!canvas) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.setAttribute('viewBox', `0 0 ${Math.max(vw, 1500)} ${Math.max(vh, 800)}`);

    // Defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood flood-color="#D4A843" flood-opacity="0.35" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="glow"/>
            <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `;
    canvas.appendChild(defs);

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

    // Ganpati group
    const ganpatiGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    ganpatiGroup.id = 'ganpati-paths';
    ganpatiGroup.setAttribute('transform',
        `translate(${vwScaled / 2 - 250}, ${vhScaled * 0.08}) scale(${Math.min(vwScaled / 700, vhScaled / 750, 1.1)})`
    );
    ganpatiGroup.innerHTML = GANPATI_PATH_DATA.map(p =>
        `<path data-id="${p.id}" d="${p.d}" stroke-width="${p.sw}"/>`
    ).join('\n');
    canvas.appendChild(ganpatiGroup);

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
