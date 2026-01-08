import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { INTERESTS_CONFIG } from './interests-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('interests-container');
    const saveBtn = document.getElementById('btn-save');
    const countDisplay = document.getElementById('selection-count');
    const toastContainer = document.querySelector('.toast-container');

    // Track selections by category
    const selections = {};
    INTERESTS_CONFIG.forEach(group => selections[group.id] = new Set());

    // 1. Render UI Dynamically
    function renderUI() {
        container.innerHTML = '';
        INTERESTS_CONFIG.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'category-section';
            groupEl.innerHTML = `
                <div class="section-header">
                    <h5 class="section-title"><i class="${group.icon}"></i> ${group.title}</h5>
                    <button class="btn-select-all" data-group="${group.id}">Select All</button>
                </div>
                <div class="pill-group" id="group-${group.id}">
                    ${group.topics.map(topic => `
                        <div class="interest-pill" data-group="${group.id}" data-value="${topic}">${topic}</div>
                    `).join('')}
                </div>
            `;
            container.appendChild(groupEl);
        });

        // Add Event Listeners to Pills
        document.querySelectorAll('.interest-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const groupId = pill.getAttribute('data-group');
                const val = pill.getAttribute('data-value');

                if (selections[groupId].has(val)) {
                    selections[groupId].delete(val);
                    pill.classList.remove('active');
                } else {
                    selections[groupId].add(val);
                    pill.classList.add('active');
                }
                updateUIState();
            });
        });

        // Add Event Listeners to "Select All"
        document.querySelectorAll('.btn-select-all').forEach(btn => {
            btn.addEventListener('click', () => {
                const groupId = btn.getAttribute('data-group');
                const group = INTERESTS_CONFIG.find(g => g.id === groupId);
                const pills = document.querySelectorAll(`.interest-pill[data-group="${groupId}"]`);

                const allSelected = selections[groupId].size === group.topics.length;

                if (allSelected) {
                    selections[groupId].clear();
                    pills.forEach(p => p.classList.remove('active'));
                } else {
                    group.topics.forEach(t => selections[groupId].add(t));
                    pills.forEach(p => p.classList.add('active'));
                }
                updateUIState();
            });
        });
    }

    function updateUIState() {
        let total = 0;
        Object.values(selections).forEach(set => total += set.size);

        saveBtn.disabled = total === 0;
        countDisplay.textContent = total === 0 ? 'No topics selected' : `${total} topics selected`;

        // Update Select All buttons text
        document.querySelectorAll('.btn-select-all').forEach(btn => {
            const groupId = btn.getAttribute('data-group');
            const group = INTERESTS_CONFIG.find(g => g.id === groupId);
            btn.textContent = selections[groupId].size === group.topics.length ? 'Deselect All' : 'Select All';
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} shadow-sm fade show`;
        toast.style.cssText = 'min-width: 250px; margin-top: 10px;';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Auth State Check & Data Loading
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        renderUI();

        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.userInterests) {
                    // Pre-fill selections
                    Object.entries(data.userInterests).forEach(([groupId, topics]) => {
                        if (selections[groupId] && Array.isArray(topics)) {
                            topics.forEach(topic => {
                                selections[groupId].add(topic);
                                const pill = document.querySelector(`.interest-pill[data-group="${groupId}"][data-value="${topic}"]`);
                                if (pill) pill.classList.add('active');
                            });
                        }
                    });
                    updateUIState();
                }
            }
        } catch (error) {
            console.error("[Interests] Load error:", error);
            showToast("Failed to load existing selections", "error");
        }

        saveBtn.addEventListener('click', async () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';
            saveBtn.disabled = true;

            const structuredData = {};
            Object.entries(selections).forEach(([id, set]) => {
                structuredData[id] = Array.from(set);
            });

            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    userInterests: structuredData,
                    updatedAt: new Date().toISOString()
                }, { merge: true });

                showToast("Preferences saved successfully!");
                setTimeout(() => window.location.href = 'dashboard.html', 1000);

            } catch (error) {
                console.error("[Interests] Save error:", error);
                showToast("Failed to save: " + error.message, "error");
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        });
    });
});
