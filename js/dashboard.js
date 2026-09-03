/**
 * Organiser Dashboard
 *
 * Features:
 *  - Auth gate (redirect to login if not signed in)
 *  - Tab navigation
 *  - Overview stats (real-time)
 *  - Contributions table with verify/reject
 *  - Gallery management (upload/delete/reorder)
 *  - Team management (add/edit/delete)
 *  - Event settings (title, tagline, QR code)
 */

import { hashPin, makeOrganiserEmail } from './auth.js?v=3';

// Firebase refs (set after auth)
let db, collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc,
    serverTimestamp, where, getDocs, getDoc;
let storage, ref, uploadBytes, getDownloadURL, deleteObject;
let auth, signInWithEmailAndPassword, createUserWithEmailAndPassword;

// Current filter
let currentFilter = 'ALL';
let allDonations = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadFirebase();
    setupAuthGate();
    setupTabs();
}

async function loadFirebase() {
    const firestore = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const fbStorage = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');
    const fbAuth = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const config = await import('./firebase-config.js?v=2');

    db = config.db;
    storage = config.storage;
    auth = config.auth;

    ({ collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc,
       serverTimestamp, where, getDocs, getDoc } = firestore);
    ({ ref, uploadBytes, getDownloadURL, deleteObject } = fbStorage);
    ({ signInWithEmailAndPassword, createUserWithEmailAndPassword } = fbAuth);
}

function setupAuthGate() {
    const gate = document.getElementById('auth-gate');
    const shell = document.getElementById('dashboard-shell');

    onAuthStateChangedSafe((user) => {
        if (user) {
            gate.style.display = 'none';
            shell.hidden = false;
            initDashboard();
        } else {
            window.location.href = 'dashboard-login.html';
        }
    });
}

// Wrapper to handle missing auth gracefully
function onAuthStateChangedSafe(cb) {
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js')
        .then(m => {
            m.onAuthStateChanged(auth, cb);
        })
        .catch(() => {
            // Firebase not configured — show a message
            document.getElementById('auth-gate').innerHTML =
                '<p>Firebase is not configured. Please update js/firebase-config.js</p>';
        });
}

function initDashboard() {
    setupSignOut();
    loadStats();
    loadContributions();
    loadGallery();
    loadTeam();
    loadSettings();
}

function setupSignOut() {
    document.getElementById('signout-btn').addEventListener('click', () => {
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js')
            .then(m => m.signOut(auth))
            .then(() => window.location.href = 'dashboard-login.html');
    });
}

/* ============ TABS ============ */
function setupTabs() {
    document.querySelectorAll('.sidebar-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.sidebar-nav button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show panel
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`tab-${tab}`);
            if (panel) panel.classList.add('active');
        });
    });

    // Contribution filters
    document.querySelectorAll('#filter-group .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#filter-group .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderContributions();
        });
    });
}

/* ============ STATS ============ */
function loadStats() {
    const q = query(collection(db, 'donations'));
    onSnapshot(q, (snap) => {
        const donations = [];
        snap.forEach(d => donations.push({ id: d.id, ...d.data() }));
        allDonations = donations;
        renderStats(donations);
        renderContributions();
    });
}

function renderStats(donations) {
    const totalCount = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const verified = donations.filter(d => d.status === 'VERIFIED');
    const pending = donations.filter(d => d.status === 'PENDING');
    const rejected = donations.filter(d => d.status === 'REJECTED');
    const sum = arr => arr.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const avg = totalCount ? totalAmount / totalCount : 0;

    setText('stat-total-count', `${totalCount}`);
    setText('stat-total-amount', `₹${totalAmount.toLocaleString('en-IN')}`);
    setText('stat-verified', verified.length);
    setText('stat-verified-amount', `₹${sum(verified).toLocaleString('en-IN')}`);
    setText('stat-pending', pending.length);
    setText('stat-pending-amount', `₹${sum(pending).toLocaleString('en-IN')}`);
    setText('stat-rejected', rejected.length);
    setText('stat-rejected-amount', `₹${sum(rejected).toLocaleString('en-IN')}`);
    setText('stat-avg', `₹${Math.round(avg).toLocaleString('en-IN')}`);
    setText('stat-contributors', `${verified.length}`);

    renderCharts(donations);
    renderStatusLegend(donations);
    renderTopContributors(donations);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

/* ============ CHARTS ============ */
let charts = {};

function destroyCharts() {
    Object.values(charts).forEach(c => { try { c.destroy(); } catch (e) {} });
    charts = {};
}

function renderCharts(donations) {
    if (typeof Chart === 'undefined') return;
    destroyCharts();

    const cats = ['student', 'teacher', 'alumni', 'staff', 'other'];
    const catLabels = { student: 'Student', teacher: 'Teacher', alumni: 'Alumni', staff: 'Staff', other: 'Other' };

    // Donut: donation count by category
    charts.category = new Chart(document.getElementById('chart-category'), {
        type: 'doughnut',
        data: {
            labels: cats.map(c => catLabels[c]),
            datasets: [{
                data: cats.map(c => donations.filter(d => d.category === c).length),
                backgroundColor: ['#D4A843', '#FF6B35', '#E8C96A', '#B8922E', '#6b4f1f'],
                borderWidth: 2,
                borderColor: '#141420',
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,248,240,0.65)', padding: 14 } } }
        }
    });

    // Bar: amount by category
    charts.categoryAmount = new Chart(document.getElementById('chart-category-amount'), {
        type: 'bar',
        data: {
            labels: cats.map(c => catLabels[c]),
            datasets: [{
                label: 'Amount (₹)',
                data: cats.map(c => donations.filter(d => d.category === c).reduce((s, d) => s + (Number(d.amount) || 0), 0)),
                backgroundColor: 'rgba(212,168,67,0.75)',
                hoverBackgroundColor: '#E8C96A',
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: 'rgba(255,248,240,0.65)' }, grid: { color: 'rgba(212,168,67,0.08)' } },
                y: { beginAtZero: true, ticks: { color: 'rgba(255,248,240,0.65)' }, grid: { color: 'rgba(212,168,67,0.08)' } }
            }
        }
    });

    // Line: last 14 days
    const today = new Date();
    const labels = [], amounts = [], counts = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const key = d.toDateString();
        let amt = 0, cnt = 0;
        donations.forEach(don => {
            if (!don.createdAt || !don.createdAt.seconds) return;
            if (new Date(don.createdAt.seconds * 1000).toDateString() === key) { amt += Number(don.amount) || 0; cnt++; }
        });
        labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
        amounts.push(amt); counts.push(cnt);
    }

    charts.timeline = new Chart(document.getElementById('chart-timeline'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Amount (₹)', data: amounts, borderColor: '#D4A843', backgroundColor: 'rgba(212,168,67,0.15)', fill: true, tension: 0.4, yAxisID: 'y' },
                { label: 'Donations', data: counts, borderColor: '#FF6B35', backgroundColor: 'rgba(255,107,53,0.15)', fill: false, tension: 0.4, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: 'rgba(255,248,240,0.65)' } } },
            scales: {
                x: { ticks: { color: 'rgba(255,248,240,0.65)', maxRotation: 0 }, grid: { color: 'rgba(212,168,67,0.06)' } },
                y: { beginAtZero: true, position: 'left', ticks: { color: 'rgba(212,168,67,0.9)' }, grid: { color: 'rgba(212,168,67,0.08)' } },
                y1: { beginAtZero: true, position: 'right', ticks: { color: 'rgba(255,107,53,0.9)' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function renderStatusLegend(donations) {
    const statuses = ['VERIFIED', 'PENDING', 'REJECTED'];
    const colors = { VERIFIED: '#4CAF50', PENDING: '#FF6B35', REJECTED: '#F44336' };
    const total = donations.length || 1;
    const el = document.getElementById('status-legend');
    el.innerHTML = statuses.map(s => {
        const arr = donations.filter(d => d.status === s);
        const n = arr.length;
        const amt = arr.reduce((a, d) => a + (Number(d.amount) || 0), 0);
        return `
            <div class="legend-row">
                <span class="legend-dot" style="background:${colors[s]}"></span>
                <span class="legend-label">${s.charAt(0) + s.slice(1).toLowerCase()}</span>
                <span class="legend-bar"><span style="width:${(n / total) * 100}%"></span></span>
                <span class="legend-value">${n} · ₹${amt.toLocaleString('en-IN')}</span>
            </div>
        `;
    }).join('');
}

function renderTopContributors(donations) {
    const el = document.getElementById('top-contributors');
    const map = {};
    donations.filter(d => d.status === 'VERIFIED').forEach(d => {
        const name = (d.name || 'Anonymous').trim();
        if (!map[name]) map[name] = 0;
        map[name] += Number(d.amount) || 0;
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);

    if (sorted.length === 0) {
        el.innerHTML = '<div class="empty-inline">No verified donations yet.</div>';
        return;
    }
    const max = sorted[0][1] || 1;
    el.innerHTML = sorted.map(([name, amt], i) => `
        <div class="top-row">
            <span class="top-rank">${i + 1}</span>
            <span class="top-name">${escapeHtml(name)}</span>
            <span class="top-bar"><span style="width:${Math.max(6, (amt / max) * 100)}%"></span></span>
            <span class="top-amount">₹${amt.toLocaleString('en-IN')}</span>
        </div>
    `).join('');
}

/* ============ CONTRIBUTIONS ============ */
function renderContributions() {
    const tbody = document.getElementById('contributions-body');
    const empty = document.getElementById('contributions-empty');

    let filtered = allDonations;
    if (currentFilter !== 'ALL') {
        filtered = allDonations.filter(d => d.status === currentFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    tbody.innerHTML = filtered.map(d => {
        const date = d.createdAt ? formatDate(d.createdAt) : '—';
        const statusClass = `status-${(d.status || 'PENDING').toLowerCase()}`;
        const statusLabel = (d.status || 'PENDING').charAt(0) + (d.status || 'PENDING').slice(1).toLowerCase();

        let actions = '';
        if (d.status === 'PENDING') {
            actions = `
                <button class="action-btn action-verify" onclick="window.verifyDonation('${d.id}')">Verify</button>
                <button class="action-btn action-reject" onclick="window.rejectDonation('${d.id}')">Reject</button>
            `;
        }

        return `
            <tr>
                <td>${escapeHtml(d.name || '—')}</td>
                <td>${capitalize(d.category || '—')}</td>
                <td>₹${(Number(d.amount) || 0).toLocaleString('en-IN')}</td>
                <td>${escapeHtml(d.transactionId || '—')}</td>
                <td>${date}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>${actions}</td>
            </tr>
        `;
    }).join('');
}

window.verifyDonation = async (id) => {
    await updateDoc(doc(db, 'donations', id), { status: 'VERIFIED' });
};

window.rejectDonation = async (id) => {
    await updateDoc(doc(db, 'donations', id), { status: 'REJECTED' });
};

/* ============ GALLERY ============ */
let galleryDocs = [];

function loadGallery() {
    const q = query(collection(db, 'gallery'), orderBy('order'));
    onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        galleryDocs = items;
        renderGallery();
    });

    setupGalleryUpload();
}

function renderGallery() {
    const grid = document.getElementById('dashboard-gallery-grid');
    const empty = document.getElementById('gallery-empty');

    if (galleryDocs.length === 0) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = galleryDocs.map((item, i) => `
        <div class="dash-gallery-item">
            <img src="${item.url}" alt="${escapeHtml(item.caption || '')}" loading="lazy">
            <div class="reorder-controls">
                <button class="reorder-btn" onclick="window.moveGallery('${item.id}', -1)" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button class="reorder-btn" onclick="window.moveGallery('${item.id}', 1)" ${i === galleryDocs.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
            <div class="item-actions">
                <button class="action-btn action-delete" onclick="window.deleteGallery('${item.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function setupGalleryUpload() {
    const input = document.getElementById('photo-input');
    const btn = document.getElementById('upload-photo-btn');

    btn.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
        const files = Array.from(input.files);
        if (files.length === 0) return;
        uploadGalleryFiles(files);
        input.value = '';
    });
}

async function uploadGalleryFiles(files) {
    const progress = document.getElementById('upload-progress');
    const bar = document.getElementById('upload-bar');
    const status = document.getElementById('upload-status');
    progress.hidden = false;

    let uploaded = 0;
    const total = files.length;

    for (const file of files) {
        try {
            const filename = `gallery/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const fileRef = ref(storage, filename);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            // Compute next order
            const nextOrder = galleryDocs.length ? Math.max(...galleryDocs.map(d => d.order || 0)) + 1 : 0;
            await addDoc(collection(db, 'gallery'), {
                url,
                caption: file.name.replace(/\.[^.]+$/, ''),
                order: nextOrder,
                createdAt: serverTimestamp(),
            });

            uploaded++;
            bar.style.width = `${(uploaded / total) * 100}%`;
            status.textContent = `Uploading… ${uploaded}/${total}`;
        } catch (e) {
            console.error('Upload error:', e);
        }
    }

    setTimeout(() => { progress.hidden = true; bar.style.width = '0%'; }, 1500);
}

window.moveGallery = async (id, dir) => {
    const idx = galleryDocs.findIndex(d => d.id === id);
    const target = idx + dir;
    if (target < 0 || target >= galleryDocs.length) return;

    const a = galleryDocs[idx];
    const b = galleryDocs[target];
    const aOrder = a.order ?? idx;
    const bOrder = b.order ?? target;

    await updateDoc(doc(db, 'gallery', a.id), { order: bOrder });
    await updateDoc(doc(db, 'gallery', b.id), { order: aOrder });
};

window.deleteGallery = async (id) => {
    if (!confirm('Delete this gallery image?')) return;
    const item = galleryDocs.find(d => d.id === id);

    try {
        // Try to delete from storage (best effort)
        const path = item.url.split('/o/')[1]?.split('?')[0];
        if (path) {
            const decoded = decodeURIComponent(path);
            const fileRef = ref(storage, decoded);
            await deleteObject(fileRef);
        }
    } catch (e) { /* ignore storage errors */ }

    await deleteDoc(doc(db, 'gallery', id));
};

/* ============ TEAM ============ */
let teamDocs = [];
let editingMemberId = null;

function loadTeam() {
    const q = query(collection(db, 'organisers'), orderBy('order'));
    onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        teamDocs = items;
        renderTeam();
    });

    setupTeamModal();
}

function renderTeam() {
    const grid = document.getElementById('dashboard-team-grid');
    const empty = document.getElementById('team-empty');

    if (teamDocs.length === 0) {
        grid.innerHTML = '';
        empty.hidden = false;
        return;
    }
    empty.hidden = true;

    grid.innerHTML = teamDocs.map((member, i) => {
        const initials = (member.displayName || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        return `
            <div class="dash-team-card">
                ${member.photoUrl
                    ? `<img src="${member.photoUrl}" alt="${escapeHtml(member.displayName)}">`
                    : `<div class="team-photo-placeholder">${initials}</div>`}
                <div class="team-name">${escapeHtml(member.displayName)}</div>
                <div class="team-role">${escapeHtml(member.role || '')}</div>
                <div class="card-actions">
                    <button class="action-btn action-edit" onclick="window.editMember('${member.id}')">Edit</button>
                    <button class="action-btn action-delete" onclick="window.deleteMember('${member.id}')">Delete</button>
                    <button class="action-btn action-edit" onclick="window.moveMember('${member.id}', -1)" ${i === 0 ? 'disabled' : ''}>▲</button>
                    <button class="action-btn action-edit" onclick="window.moveMember('${member.id}', 1)" ${i === teamDocs.length - 1 ? 'disabled' : ''}>▼</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupTeamModal() {
    const overlay = document.getElementById('member-modal-overlay');
    const cancelBtn = document.getElementById('member-cancel');
    const addBtn = document.getElementById('add-member-btn');

    addBtn.addEventListener('click', () => {
        editingMemberId = null;
        document.getElementById('member-modal-title').textContent = 'Add Organiser';
        document.getElementById('member-form').reset();
        overlay.hidden = false;
    });

    cancelBtn.addEventListener('click', () => {
        overlay.hidden = true;
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.hidden = true;
    });

    document.getElementById('member-form').addEventListener('submit', saveMember);
}

async function saveMember(e) {
    e.preventDefault();
    const name = document.getElementById('member-name').value.trim();
    const role = document.getElementById('member-role').value.trim();
    const email = document.getElementById('member-email').value.trim();
    const pin = document.getElementById('member-pin').value;
    const password = document.getElementById('member-password').value;
    const photoFile = document.getElementById('member-photo').files[0];

    const saveBtn = document.getElementById('member-save');
    saveBtn.classList.add('loading');

    try {
        let photoUrl = null;
        if (photoFile) {
            const filename = `organisers/${Date.now()}_${photoFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const fileRef = ref(storage, filename);
            await uploadBytes(fileRef, photoFile);
            photoUrl = await getDownloadURL(fileRef);
        }

        const pinHash = await hashPin(pin);

        if (editingMemberId) {
            // Update existing
            const updateData = { displayName: name, role };
            if (email) updateData.email = email;
            if (photoUrl) updateData.photoUrl = photoUrl;
            if (pin) updateData.pinHash = pinHash;
            await updateDoc(doc(db, 'organisers', editingMemberId), updateData);
        } else {
            // Create Firebase Auth user + Firestore doc
            let authEmail = email || makeOrganiserEmail(name);
            try {
                await createUserWithEmailAndPassword(auth, authEmail, password);
            } catch (err) {
                // User may already exist — that's fine, skip
                console.warn('Auth user create skipped:', err.message);
            }

            const nextOrder = teamDocs.length ? Math.max(...teamDocs.map(d => d.order || 0)) + 1 : 0;
            await addDoc(collection(db, 'organisers'), {
                displayName: name,
                role,
                email: authEmail,
                pinHash,
                photoUrl: photoUrl || null,
                order: nextOrder,
                createdAt: serverTimestamp(),
            });
        }

        document.getElementById('member-modal-overlay').hidden = true;
        saveBtn.classList.remove('loading');
    } catch (err) {
        console.error('Save member error:', err);
        saveBtn.classList.remove('loading');
        alert('There was an error saving this member.');
    }
}

window.editMember = async (id) => {
    const member = teamDocs.find(d => d.id === id);
    if (!member) return;

    editingMemberId = id;
    document.getElementById('member-modal-title').textContent = 'Edit Organiser';
    document.getElementById('member-name').value = member.displayName || '';
    document.getElementById('member-role').value = member.role || '';
    document.getElementById('member-email').value = member.email || '';
    document.getElementById('member-pin').value = '';
    document.getElementById('member-password').value = '';
    document.getElementById('member-photo').value = '';
    document.getElementById('member-modal-overlay').hidden = false;
};

window.deleteMember = async (id) => {
    if (!confirm('Delete this organiser?')) return;
    const member = teamDocs.find(d => d.id === id);
    if (member?.photoUrl) {
        try {
            const path = member.photoUrl.split('/o/')[1]?.split('?')[0];
            if (path) await deleteObject(ref(storage, decodeURIComponent(path)));
        } catch (e) {}
    }
    await deleteDoc(doc(db, 'organisers', id));
};

window.moveMember = async (id, dir) => {
    const idx = teamDocs.findIndex(d => d.id === id);
    const target = idx + dir;
    if (target < 0 || target >= teamDocs.length) return;
    const a = teamDocs[idx], b = teamDocs[target];
    const aOrder = a.order ?? idx, bOrder = b.order ?? target;
    await updateDoc(doc(db, 'organisers', a.id), { order: bOrder });
    await updateDoc(doc(db, 'organisers', b.id), { order: aOrder });
};

/* ============ SETTINGS ============ */
function loadSettings() {
    const settingsRef = doc(db, 'event', 'settings');

    getDoc(settingsRef).then(snap => {
        if (!snap.exists()) return;
        const data = snap.data();
        document.getElementById('set-title').value = data.title || '';
        document.getElementById('set-tagline').value = data.tagline || '';
        document.getElementById('set-description').value = data.description || '';
        document.getElementById('set-contribution-info').value = data.contributionInfo || '';
        if (data.qrCodeUrl) {
            const preview = document.getElementById('qr-preview');
            preview.src = data.qrCodeUrl;
            preview.style.display = 'block';
        }
    });

    // QR upload
    document.getElementById('set-qr').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        uploadQRCode(file);
    });

    document.getElementById('settings-form').addEventListener('submit', saveSettings);
}

async function uploadQRCode(file) {
    const filename = `payment/${Date.now()}_qr.png`;
    const fileRef = ref(storage, filename);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    const preview = document.getElementById('qr-preview');
    preview.src = url;
    preview.style.display = 'block';

    await updateDoc(doc(db, 'event', 'settings'), { qrCodeUrl: url });
}

async function saveSettings(e) {
    e.preventDefault();
    const btn = document.getElementById('save-settings-btn');
    btn.classList.add('loading');

    const data = {
        title: document.getElementById('set-title').value.trim(),
        tagline: document.getElementById('set-tagline').value.trim(),
        description: document.getElementById('set-description').value.trim(),
        contributionInfo: document.getElementById('set-contribution-info').value.trim(),
        updatedAt: serverTimestamp(),
    };

    try {
        await updateDoc(doc(db, 'event', 'settings'), data);
        btn.classList.remove('loading');
        btn.textContent = 'Saved ✓';
        setTimeout(() => { btn.textContent = 'Save Settings'; }, 2000);
    } catch (e) {
        btn.classList.remove('loading');
        alert('Error saving settings.');
    }
}

/* ============ HELPERS ============ */
function formatDate(ts) {
    if (!ts || !ts.seconds) return '—';
    const d = new Date(ts.seconds * 1000);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function capitalize(str) {
    if (!str) return '—';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
