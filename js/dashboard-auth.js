/**
 * Dashboard Login — Two-Stage Authentication
 */

import { buildBackground } from './bg-builder.js?v=2';
import { initParticles, injectParticleStyles } from './particles.js?v=2';
import { verifyOrganiserIdentity, signInOrganiser } from './auth.js?v=3';

document.addEventListener('DOMContentLoaded', () => {
    // Background
    buildBackground(document.getElementById('bg-canvas'));
    injectParticleStyles();
    initParticles();
    document.body.classList.remove('loading');

    // If already signed in, redirect to dashboard
    initAuthCheck();

    initLogin();
});

async function initAuthCheck() {
    try {
        const { auth } = await import('./firebase-config.js?v=2');
        const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = 'dashboard.html';
            }
        });
    } catch (e) {
        // Firebase not configured
    }
}

async function initLogin() {
    const stage1 = document.getElementById('stage-1');
    const stage2 = document.getElementById('stage-2');
    const backBtn = document.getElementById('back-to-stage-1');

    let currentOrganiser = null;

    // STAGE 1: name + PIN
    stage1.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        const pin = document.getElementById('login-pin').value;

        if (!name || pin.length !== 6) {
            showError('stage-1-error', 'Enter your name and 6-digit PIN.');
            return;
        }

        const btn = document.getElementById('stage1-btn');
        btn.classList.add('loading');

        try {
            const { db } = await import('./firebase-config.js?v=2');
            const { collection, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

            const organiser = await verifyOrganiserIdentity(db, collection, where, getDocs, name, pin);

            if (!organiser) {
                btn.classList.remove('loading');
                showError('stage-1-error', 'Invalid name or PIN.');
                return;
            }

            currentOrganiser = organiser;
            document.getElementById('stage-2-name').textContent = `Welcome, ${organiser.data.displayName}`;

            btn.classList.remove('loading');
            stage1.classList.remove('active');
            stage2.classList.add('active');
            showError('stage-1-error', '');
            document.getElementById('login-password').focus();
        } catch (err) {
            btn.classList.remove('loading');
            showError('stage-1-error', 'Authentication service unavailable.');
        }
    });

    // STAGE 2: password
    stage2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('login-password').value;

        if (!currentOrganiser) {
            showError('stage-2-error', 'Session expired. Please start again.');
            stage2.classList.remove('active');
            stage1.classList.add('active');
            return;
        }

        const btn = document.getElementById('stage2-btn');
        btn.classList.add('loading');

        try {
            const { auth } = await import('./firebase-config.js?v=2');
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

            await signInOrganiser(auth, signInWithEmailAndPassword, currentOrganiser, password);
            window.location.href = 'dashboard.html';
        } catch (err) {
            btn.classList.remove('loading');
            showError('stage-2-error', 'Incorrect password.');
        }
    });

    // Back button
    backBtn.addEventListener('click', () => {
        stage2.classList.remove('active');
        stage1.classList.add('active');
        showError('stage-2-error', '');
    });

    // Clear errors on input
    ['login-name', 'login-pin', 'login-password'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            showError('stage-1-error', '');
            showError('stage-2-error', '');
        });
    });
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
