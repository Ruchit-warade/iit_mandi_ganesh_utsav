/**
 * Ganpati SVG Artwork — Golden Line Art
 *
 * Each entry: { id, d, delay (ms), strokeWidth }
 * Paths are ordered for natural drawing sequence:
 *   Crown → Face → Ears → Eyes → Trunk → Body → Arms → Legs → Details
 *
 * viewBox: 0 0 500 600
 * Draw with stroke only, no fill
 */

export const GANPATI_PATHS = [
    // ── CROWN (Mukut) ──────────────────────────────────
    {
        id: 'crown-base',
        d: 'M 155 195 Q 170 175 200 168 Q 220 165 250 168 Q 280 165 300 168 Q 330 175 345 195',
        delay: 0,
        strokeWidth: 2.2,
    },
    {
        id: 'crown-left',
        d: 'M 155 195 Q 158 170 175 150 Q 195 128 215 118',
        delay: 100,
        strokeWidth: 2.2,
    },
    {
        id: 'crown-right',
        d: 'M 345 195 Q 342 170 325 150 Q 305 128 285 118',
        delay: 100,
        strokeWidth: 2.2,
    },
    {
        id: 'crown-peak',
        d: 'M 215 118 Q 230 95 250 85 Q 270 95 285 118',
        delay: 250,
        strokeWidth: 2.2,
    },
    {
        id: 'crown-jewel',
        d: 'M 240 100 Q 250 92 260 100 Q 250 108 240 100',
        delay: 350,
        strokeWidth: 1.8,
    },
    {
        id: 'crown-ornament-l',
        d: 'M 190 140 Q 200 132 210 138',
        delay: 300,
        strokeWidth: 1.5,
    },
    {
        id: 'crown-ornament-r',
        d: 'M 310 140 Q 300 132 290 138',
        delay: 300,
        strokeWidth: 1.5,
    },

    // ── FACE ───────────────────────────────────────────
    {
        id: 'face-left',
        d: 'M 175 205 Q 150 225 142 260 Q 135 300 145 340 Q 155 370 180 385 Q 200 395 220 398',
        delay: 500,
        strokeWidth: 2.4,
    },
    {
        id: 'face-right',
        d: 'M 325 205 Q 350 225 358 260 Q 365 300 355 340 Q 345 370 320 385 Q 300 395 280 398',
        delay: 500,
        strokeWidth: 2.4,
    },
    {
        id: 'forehead',
        d: 'M 175 205 Q 200 198 250 195 Q 300 198 325 205',
        delay: 450,
        strokeWidth: 2.2,
    },

    // ── EARS ───────────────────────────────────────────
    {
        id: 'ear-left',
        d: 'M 145 235 Q 115 245 100 275 Q 90 310 100 340 Q 115 360 140 355',
        delay: 700,
        strokeWidth: 2.2,
    },
    {
        id: 'ear-left-inner',
        d: 'M 140 255 Q 122 265 115 290 Q 112 315 120 335',
        delay: 800,
        strokeWidth: 1.5,
    },
    {
        id: 'ear-right',
        d: 'M 355 235 Q 385 245 400 275 Q 410 310 400 340 Q 385 360 360 355',
        delay: 700,
        strokeWidth: 2.2,
    },
    {
        id: 'ear-right-inner',
        d: 'M 360 255 Q 378 265 385 290 Q 388 315 380 335',
        delay: 800,
        strokeWidth: 1.5,
    },

    // ── TILAK (forehead marking) ───────────────────────
    {
        id: 'tilak',
        d: 'M 240 210 Q 250 200 260 210 Q 255 218 250 222 Q 245 218 240 210',
        delay: 600,
        strokeWidth: 1.5,
    },

    // ── EYES ───────────────────────────────────────────
    {
        id: 'eye-left',
        d: 'M 200 270 Q 210 262 222 268 Q 210 276 200 270',
        delay: 900,
        strokeWidth: 1.8,
    },
    {
        id: 'eye-left-pupil',
        d: 'M 208 268 Q 212 265 216 268 Q 212 271 208 268',
        delay: 950,
        strokeWidth: 1.5,
    },
    {
        id: 'eye-right',
        d: 'M 300 270 Q 290 262 278 268 Q 290 276 300 270',
        delay: 900,
        strokeWidth: 1.8,
    },
    {
        id: 'eye-right-pupil',
        d: 'M 292 268 Q 288 265 284 268 Q 288 271 292 268',
        delay: 950,
        strokeWidth: 1.5,
    },
    {
        id: 'eyebrow-left',
        d: 'M 196 258 Q 210 250 225 255',
        delay: 880,
        strokeWidth: 1.5,
    },
    {
        id: 'eyebrow-right',
        d: 'M 304 258 Q 290 250 275 255',
        delay: 880,
        strokeWidth: 1.5,
    },

    // ── TRUNK ──────────────────────────────────────────
    {
        id: 'trunk-bridge',
        d: 'M 220 398 Q 225 405 230 415 Q 240 430 245 445',
        delay: 1100,
        strokeWidth: 2.4,
    },
    {
        id: 'trunk-main',
        d: 'M 245 445 Q 248 465 240 485 Q 230 505 215 518 Q 198 530 185 535',
        delay: 1300,
        strokeWidth: 2.6,
    },
    {
        id: 'trunk-curl',
        d: 'M 185 535 Q 175 540 168 535 Q 162 528 168 520 Q 178 515 188 520',
        delay: 1600,
        strokeWidth: 2.2,
    },
    {
        id: 'trunk-right',
        d: 'M 280 398 Q 270 410 265 425 Q 260 440 260 455',
        delay: 1200,
        strokeWidth: 2.0,
    },

    // ── BODY (Torso) ───────────────────────────────────
    {
        id: 'body-left',
        d: 'M 180 385 Q 165 410 158 440 Q 152 475 160 505 Q 170 525 190 540',
        delay: 1800,
        strokeWidth: 2.2,
    },
    {
        id: 'body-right',
        d: 'M 320 385 Q 335 410 342 440 Q 348 475 340 505 Q 330 525 310 540',
        delay: 1800,
        strokeWidth: 2.2,
    },
    {
        id: 'body-belly',
        d: 'M 190 540 Q 210 560 250 568 Q 290 560 310 540',
        delay: 2000,
        strokeWidth: 2.0,
    },
    {
        id: 'body-belly-detail',
        d: 'M 220 520 Q 250 535 280 520',
        delay: 2100,
        strokeWidth: 1.2,
    },

    // ── ARMS ───────────────────────────────────────────
    {
        id: 'arm-left-upper',
        d: 'M 160 440 Q 140 445 120 455 Q 105 465 95 480',
        delay: 2200,
        strokeWidth: 2.0,
    },
    {
        id: 'arm-left-lower',
        d: 'M 95 480 Q 88 495 92 510 Q 98 518 108 515',
        delay: 2400,
        strokeWidth: 1.8,
    },
    {
        id: 'modak',
        d: 'M 102 508 Q 108 500 114 508 Q 108 516 102 508',
        delay: 2500,
        strokeWidth: 1.5,
    },
    {
        id: 'arm-right-upper',
        d: 'M 340 440 Q 360 445 380 455 Q 395 465 405 480',
        delay: 2200,
        strokeWidth: 2.0,
    },
    {
        id: 'arm-right-lower',
        d: 'M 405 480 Q 412 495 408 510 Q 402 518 392 515',
        delay: 2400,
        strokeWidth: 1.8,
    },
    {
        id: 'blessing-hand',
        d: 'M 395 505 Q 398 495 405 498 Q 412 502 408 510',
        delay: 2500,
        strokeWidth: 1.3,
    },

    // ── TUSKS ──────────────────────────────────────────
    {
        id: 'tusk-left',
        d: 'M 215 370 Q 205 385 210 400 Q 215 410 225 415',
        delay: 1050,
        strokeWidth: 2.0,
    },
    {
        id: 'tusk-right',
        d: 'M 285 370 Q 295 385 300 395',
        delay: 1050,
        strokeWidth: 2.0,
    },

    // ── LEGS (seated) ──────────────────────────────────
    {
        id: 'leg-left',
        d: 'M 190 540 Q 170 555 155 565 Q 140 575 145 585 Q 155 590 175 585 Q 195 578 210 568',
        delay: 2600,
        strokeWidth: 2.0,
    },
    {
        id: 'leg-right',
        d: 'M 310 540 Q 330 555 345 565 Q 360 575 355 585 Q 345 590 325 585 Q 305 578 290 568',
        delay: 2600,
        strokeWidth: 2.0,
    },

    // ── DECORATIVE DETAILS ─────────────────────────────
    {
        id: 'necklace',
        d: 'M 195 395 Q 220 410 250 415 Q 280 410 305 395',
        delay: 2700,
        strokeWidth: 1.3,
    },
    {
        id: 'necklace-pendant',
        d: 'M 245 412 Q 250 420 255 412',
        delay: 2750,
        strokeWidth: 1.3,
    },
    {
        id: 'crown-band',
        d: 'M 170 185 Q 210 178 250 176 Q 290 178 330 185',
        delay: 200,
        strokeWidth: 1.2,
    },
    {
        id: 'earring-left',
        d: 'M 130 350 Q 125 360 130 368 Q 135 360 130 350',
        delay: 900,
        strokeWidth: 1.2,
    },
    {
        id: 'earring-right',
        d: 'M 370 350 Q 375 360 370 368 Q 365 360 370 350',
        delay: 900,
        strokeWidth: 1.2,
    },
];

/**
 * Mountain silhouette paths — 3 layers
 * Each layer is a single continuous path representing a ridgeline
 */
export const MOUNTAIN_PATHS = {
    back: {
        d: 'M 0 480 Q 30 440 70 450 Q 100 420 140 430 Q 170 390 210 400 Q 240 370 270 380 Q 300 350 330 370 Q 360 340 390 360 Q 420 380 450 370 Q 480 350 510 370 Q 540 345 570 365 Q 600 390 630 380 Q 660 355 690 375 Q 720 400 750 390 Q 780 370 810 385 Q 840 410 870 400 Q 900 380 930 395 Q 960 420 990 410 Q 1020 390 1050 405 Q 1080 430 1110 420 Q 1140 400 1170 415 Q 1200 440 1230 430 Q 1260 410 1290 425 Q 1320 450 1350 440 Q 1380 420 1410 435 Q 1440 460 1470 450 Q 1500 440 1500 480 L 0 480 Z',
        color: '#0D0D18',
        opacity: 0.6,
    },
    mid: {
        d: 'M 0 500 Q 40 460 80 470 Q 120 440 160 455 Q 200 420 240 435 Q 280 410 310 425 Q 340 395 370 415 Q 400 440 430 430 Q 460 405 490 420 Q 520 395 550 415 Q 580 440 610 425 Q 640 400 670 420 Q 700 445 730 435 Q 760 410 790 425 Q 820 450 850 435 Q 880 415 910 430 Q 940 455 970 440 Q 1000 420 1030 435 Q 1060 460 1090 445 Q 1120 425 1150 440 Q 1180 465 1210 450 Q 1240 430 1270 445 Q 1300 470 1330 455 Q 1360 435 1390 450 Q 1420 475 1450 460 Q 1480 450 1500 500 L 0 500 Z',
        color: '#111122',
        opacity: 0.7,
    },
    front: {
        d: 'M 0 520 Q 50 490 100 500 Q 150 475 200 488 Q 250 465 300 480 Q 350 458 400 475 Q 450 460 500 478 Q 550 455 600 472 Q 650 458 700 475 Q 750 462 800 480 Q 850 465 900 482 Q 950 468 1000 485 Q 1050 472 1100 490 Q 1150 475 1200 492 Q 1250 480 1300 495 Q 1350 482 1400 498 Q 1450 488 1500 520 L 0 520 Z',
        color: '#161630',
        opacity: 0.8,
    },
};

/**
 * Particle definitions — small golden dots and petal shapes
 * Positioned around the Ganpati artwork
 */
export const PARTICLE_CONFIG = {
    count: 30,
    colors: ['#D4A843', '#E8C96A', '#FF6B35', '#B8922E'],
    minSize: 1.5,
    maxSize: 4,
    minDuration: 12,
    maxDuration: 25,
    range: { x: [50, 450], y: [60, 550] },
};
