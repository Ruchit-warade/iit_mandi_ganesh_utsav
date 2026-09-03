/**
 * Scroll Animation System
 *
 * Uses IntersectionObserver to reveal sections
 * as they enter the viewport.
 *
 * Elements with .scroll-reveal class are animated once.
 */

/**
 * Initialize scroll reveal animations
 */
export function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay based on data-delay attribute
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));

                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Initialize hero content reveal (after Ganpati drawing completes)
 */
export function revealHeroContent() {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.classList.add('hero-revealed');
    }
}
