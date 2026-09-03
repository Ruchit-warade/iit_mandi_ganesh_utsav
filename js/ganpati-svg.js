/**
 * Background SVG Definitions
 *
 * Provides the mountain silhouettes and particle config used to build
 * the fixed background (the Ganpati line-art was removed).
 */

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
