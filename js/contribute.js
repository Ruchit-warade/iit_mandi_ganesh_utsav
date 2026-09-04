/**
 * Contribution Page Logic
 *
 * 2-step flow:
 *   Step 1: Contributor details (name, phone, amount)
 *   Step 2: QR payment + transaction ID
 *   Step 3: Success confirmation
 *
 * Saves to Firestore `donations` collection with status "PENDING"
 */

import { buildBackground } from './bg-builder.js?v=2';
import { initParticles, injectParticleStyles } from './particles.js?v=2';

// Contribution data collected in step 1
let contributionData = {};

document.addEventListener('DOMContentLoaded', () => {
    // Build background + animate
    buildBackground(document.getElementById('bg-canvas'));
    injectParticleStyles();
    initParticles();

    document.body.classList.remove('loading');

    initForm();
});

function initForm() {
    const detailsForm = document.getElementById('details-form');
    const paymentForm = document.getElementById('payment-form');
    const backBtn = document.getElementById('back-btn');

    // Amount presets
    document.querySelectorAll('.amount-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.amount-preset').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('input-amount').value = btn.dataset.amount;
        });
    });

    // Step 1 → Step 2
    detailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep1()) return;

        // Collect data
        contributionData = {
            name: document.getElementById('input-name').value.trim(),
            phone: document.getElementById('input-phone').value.trim(),
            roll: document.getElementById('input-roll').value.trim(),
            amount: parseInt(document.getElementById('input-amount').value),
        };

        // Update summary
        document.getElementById('summary-name').textContent = contributionData.name;
        document.getElementById('summary-phone').textContent =
            contributionData.phone;
        document.getElementById('summary-amount').textContent = `₹${contributionData.amount.toLocaleString('en-IN')}`;

        goToStep(2);
        loadQRCode();
    });

    // Step 2 → Step 3 (submit)
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const txn = document.getElementById('input-txn').value.trim();
        if (!txn) {
            setError('group-txn', true);
            return;
        }
        setError('group-txn', false);

        submitContribution(txn);
    });

    // Back button
    backBtn.addEventListener('click', () => {
        goToStep(1);
    });
}

function validateStep1() {
    let valid = true;

    const name = document.getElementById('input-name').value.trim();
    if (!name) {
        setError('group-name', true);
        valid = false;
    } else {
        setError('group-name', false);
    }

    const phone = document.getElementById('input-phone').value.trim();
    if (!phone || !/^[0-9+\-\s()]{7,15}$/.test(phone)) {
        setError('group-phone', true);
        valid = false;
    } else {
        setError('group-phone', false);
    }

    const amount = parseInt(document.getElementById('input-amount').value);
    if (!amount || amount < 1) {
        setError('group-amount', true);
        valid = false;
    } else {
        setError('group-amount', false);
    }

    return valid;
}

function setError(groupId, hasError) {
    const group = document.getElementById(groupId);
    if (group) {
        group.classList.toggle('has-error', hasError);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show target
    const target = document.getElementById(`step-${step}`);
    if (target) target.classList.add('active');

    // Update step indicator
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i < step);
    });

    // Scroll to form top
    const container = document.querySelector('.form-container');
    if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadQRCode() {
    const qrImg = document.getElementById('qr-code');
    const placeholder = document.getElementById('qr-placeholder');

    try {
        const { db } = await import('./firebase-config.js?v=2');
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        const settingsRef = doc(db, 'event', 'settings');
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists() && snapshot.data().qrCodeUrl) {
            qrImg.src = snapshot.data().qrCodeUrl;
            qrImg.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            placeholder.textContent = 'QR code not yet configured by the organising team.';
        }
    } catch (e) {
        placeholder.textContent = 'QR code will appear here once configured.';
    }
}

async function submitContribution(transactionId) {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting…';

    try {
        const { db } = await import('./firebase-config.js?v=2');
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        await addDoc(collection(db, 'donations'), {
            name: contributionData.name,
            phone: contributionData.phone,
            roll: contributionData.roll || '',
            amount: contributionData.amount,
            transactionId: transactionId,
            createdAt: serverTimestamp(),
            status: 'PENDING',
        });

        // Success
        submitBtn.classList.remove('loading');
        goToStep(3);
    } catch (e) {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Submit Contribution';
        alert('There was an error submitting your contribution. Please try again.');
        console.error('Submission error:', e);
    }
}
