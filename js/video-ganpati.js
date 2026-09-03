/**
 * Video Ganpati — Chroma-keyed video background
 *
 * Plays the source MP4 (plays in all browsers) and removes the green
 * screen at runtime by drawing each frame to a <canvas> and keying out
 * the green pixels. This is fully deterministic and works everywhere —
 * no reliance on VP9 alpha WebM support.
 *
 * The canvas is transparent where green was, so the mountains/particles
 * behind it show through. Exports initVideoGanpati(onComplete) as a
 * drop-in replacement for initDrawingAnimation(onComplete).
 */

const VIDEO_SRC = 'assets/video/upscaled-video.mp4';
const KEY = { r: 0, g: 255, b: 0 };   // pure green screen color
const SIMILARITY = 0.35;              // how close to green counts as green (0–1)
const SMOOTH = 0.18;                  // soft band for anti-aliased edges
const PROCESS_MAX = 640;              // max processing dimension (scaled for perf)
const FADE_DURATION = 1.2;            // seconds for the fade-in
const MAX_WAIT = 5000;                // ms before forcing content reveal regardless

export function initVideoGanpati(onComplete) {
    const bgLayer = document.getElementById('bg-layer');
    if (!bgLayer) {
        onComplete?.();
        return;
    }

    // Hidden video source — drives playback, never shown directly
    const video = document.createElement('video');
    video.src = VIDEO_SRC;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.playbackRate = 0.5;
    video.setAttribute('aria-hidden', 'true');
    video.style.display = 'none';

    // Visible canvas we draw the keyed frames onto
    const canvas = document.createElement('canvas');
    canvas.id = 'ganpati-video';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Initial state: invisible, opacity controlled by CSS transition
    canvas.style.opacity = '0';

    bgLayer.insertBefore(canvas, bgLayer.firstChild);

    let completed = false;
    let fadedIn = false;
    let rafId = null;
    let lastTime = -1;
    let ready = false;

    function finish() {
        if (completed) return;
        completed = true;
        clearTimeout(fallbackTimer);
        onComplete?.();
    }

    // Safety: always call onComplete within MAX_WAIT ms
    const fallbackTimer = setTimeout(finish, MAX_WAIT);

    // Size the canvas to the video's intrinsic aspect ratio once known
    video.addEventListener('loadedmetadata', () => {
        const vw = video.videoWidth || PROCESS_MAX;
        const vh = video.videoHeight || PROCESS_MAX;
        const scale = PROCESS_MAX / Math.max(vw, vh);
        canvas.width = Math.max(2, Math.round(vw * scale));
        canvas.height = Math.max(2, Math.round(vh * scale));
    });

    // Start playback as soon as enough data is buffered
    video.addEventListener('canplay', function onCanPlay() {
        video.removeEventListener('canplay', onCanPlay);
        video.play().catch(() => {
            // Autoplay blocked — content is already visible, no harm
        });
    });

    // Render loop: chroma-key the current video frame to the canvas
    function tick() {
        rafId = requestAnimationFrame(tick);
        if (!ready) {
            if (video.readyState < 2) return;
            // Make sure canvas is sized before the first draw
            if (!canvas.width || !canvas.height) return;
            ready = true;
        }
        if (video.currentTime === lastTime) return; // no new frame
        lastTime = video.currentTime;
        keyFrame();
    }

    function keyFrame() {
        // Scale the video down into the processing canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = img.data;

        for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];

            // Max channel difference from pure green → how "green" the pixel is
            const diff = Math.max(Math.abs(r - KEY.r), Math.abs(g - KEY.g), Math.abs(b - KEY.b));
            const sim = diff / 255;

            let a;
            if (sim <= SIMILARITY) a = 0;
            else if (sim >= SIMILARITY + SMOOTH) a = 255;
            else a = Math.round(((sim - SIMILARITY) / SMOOTH) * 255);

            d[i + 3] = a;
        }

        ctx.putImageData(img, 0, 0);

        // Fade in and notify on the first rendered frame
        if (!fadedIn) {
            fadedIn = true;
            requestAnimationFrame(() => {
                canvas.style.opacity = '1';
            });
            setTimeout(finish, FADE_DURATION * 1000);
        }
    }

    // Stop drawing when playback ends — the last keyed frame stays visible
    video.addEventListener('ended', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });

    // Handle load errors gracefully — content is still visible
    video.addEventListener('error', () => {
        console.warn('Ganpati video failed to load — showing content without it.');
        finish();
    });

    video.load();
    tick();
}
