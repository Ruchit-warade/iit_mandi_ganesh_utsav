/**
 * Scroll Animation System
 *
 * Uses IntersectionObserver to reveal sections
 * as they enter the viewport.
 *
 * Elements with .scroll-reveal class are animated once.
 *
 * initScrollAnimations() is intentionally re-runnable: it keeps a single
 * shared observer and observes any .scroll-reveal elements that are not yet
 * visible. This is important because content (team cards, gallery items) is
 * injected into the DOM asynchronously after Firebase responds — calling this
 * again after that load picks up the newly-added elements so they don't stay
 * stuck at opacity: 0.
 */

let observer = null;

/**
 * Initialize (or re-run) scroll reveal animations.
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

    // Create the observer once, reuse it across calls
    if (!observer) {
        observer = new IntersectionObserver(
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
    }

    // Observe any elements not yet revealed (skips already-visible ones)
    revealElements.forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el);
    });
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
