import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

let editModal;

export function initInterviews() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
        <div class="doc-hero">
            <div class="doc-container">
                <h1>Mock Interviews</h1>
                <p>Record your performance, feedback, and growth over time.</p>
            </div>
        </div>

        <div class="doc-container">
            <div class="row g-5">
                 <!-- Left: Form -->
                 <div class="col-lg-4 order-lg-last">
                    <div class="doc-card sticky-lg-top" style="top: 2rem;">
                        <h3 class="doc-card-title mb-4">Log New Session</h3>
                        <form id="interview-form">
                            <div class="mb-3">
                                <label class="text-label mb-1">Company / Peer</label>
                                <input type="text" class="form-control" placeholder="e.g. Google" id="form-company" required>
                            </div>
                            <div class="mb-3">
                                <label class="text-label mb-1">Role</label>
                                <input type="text" class="form-control" placeholder="e.g. SDE" id="form-role" required>
                            </div>
                            <div class="mb-4">
                                <label class="text-label mb-1">Score (1-10)</label>
                                <div class="d-flex align-items-center gap-3">
                                    <input type="range" class="form-range" min="1" max="10" value="5" id="form-score" oninput="this.nextElementSibling.value = this.value">
                                    <output class="fw-bold fs-5">5</output>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="text-label mb-1">Feedback</label>
                                <textarea class="form-control" rows="3" placeholder="What went well? What didn't?" id="form-feedback"></textarea>
                            </div>
                            <button type="submit" class="btn btn-doc-primary w-100">Save Log</button>
                        </form>
                    </div>
                 </div>

                 <!-- Right: list -->
                 <div class="col-lg-8">
                    <h3 class="mb-4 fw-bold">Recent History</h3>
                    <div id="interview-list" class="d-flex flex-column gap-3">
                        <div class="text-center py-5 text-muted">Loading history...</div>
                    </div>
                 </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal fade" id="editInterviewModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content doc-card p-0 overflow-hidden">
                    <div class="modal-header border-0 p-4 pb-0">
                        <h5 class="modal-title fw-bold">Edit Interview Log</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="edit-interview-form">
                            <input type="hidden" id="edit-id">
                            <div class="mb-3">
                                <label class="text-label mb-1">Company / Peer</label>
                                <input type="text" class="form-control" id="edit-company" required>
                            </div>
                            <div class="mb-3">
                                <label class="text-label mb-1">Role</label>
                                <input type="text" class="form-control" id="edit-role" required>
                            </div>
                            <div class="mb-4">
                                <label class="text-label mb-1">Score (1-10)</label>
                                <div class="d-flex align-items-center gap-3">
                                    <input type="range" class="form-range" min="1" max="10" id="edit-score" oninput="this.nextElementSibling.value = this.value">
                                    <output class="fw-bold fs-5">5</output>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="text-label mb-1">Feedback</label>
                                <textarea class="form-control" rows="3" id="edit-feedback"></textarea>
                            </div>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-doc-primary w-100">Update Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove Initial Loader if exists
    const loader = document.getElementById('initial-loader');
    if (loader && container) loader.remove();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setupInterviewEvents(user);
        }
    });

    // Initialize Bootstrap Modal
    const modalEl = document.getElementById('editInterviewModal');
    if (modalEl && window.bootstrap) {
        editModal = new bootstrap.Modal(modalEl);
    }
}

function setupInterviewEvents(user) {
    const form = document.getElementById('interview-form');
    const logsContainer = document.getElementById('interview-list');
    const editForm = document.getElementById('edit-interview-form');

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const company = document.getElementById('form-company').value;
        const role = document.getElementById('form-role').value;
        const score = document.getElementById('form-score').value;
        const feedback = document.getElementById('form-feedback').value;
        const submitBtn = form.querySelector('button');

        try {
            submitBtn.disabled = true;
            await addDoc(collection(db, "mock_interviews"), {
                userId: user.uid,
                company,
                role,
                score: parseInt(score),
                feedback,
                createdAt: serverTimestamp()
            });
            form.reset();
            form.querySelector('output').value = 5;
        } catch (error) {
            console.error("Error adding log: ", error);
            alert("Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
        }
    });

    // Handle Edit Submit
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const company = document.getElementById('edit-company').value;
        const role = document.getElementById('edit-role').value;
        const score = document.getElementById('edit-score').value;
        const feedback = document.getElementById('edit-feedback').value;
        const submitBtn = editForm.querySelector('button[type="submit"]');

        try {
            submitBtn.disabled = true;
            await updateDoc(doc(db, "mock_interviews", id), {
                company,
                role,
                score: parseInt(score),
                feedback
            });
            if (editModal) editModal.hide();
        } catch (error) {
            console.error("Error updating log: ", error);
            alert("Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
        }
    });

    // Real-time List
    // Removed orderBy to avoid index requirement
    const q = query(
        collection(db, "mock_interviews"),
        where("userId", "==", user.uid)
    );

    onSnapshot(q, (snapshot) => {
        logsContainer.innerHTML = '';

        if (snapshot.empty) {
            logsContainer.innerHTML = `
                <div class="doc-card text-center py-5 border-dashed">
                    <i class="fas fa-ghost fa-3x text-muted mb-3 opacity-25"></i>
                    <p class="text-muted">No mock interviews logged yet. Start practicing!</p>
                </div>`;
            return;
        }

        const mocks = [];
        snapshot.forEach(d => mocks.push({ id: d.id, ...d.data() }));

        // Client-side Sort: CreatedAt Descending
        mocks.sort((a, b) => {
            const tA = a.createdAt ? a.createdAt.toMillis() : Date.now();
            const tB = b.createdAt ? b.createdAt.toMillis() : Date.now();
            return tB - tA;
        });

        mocks.forEach(data => {
            const id = data.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            }) : 'Just now';

            // Score Coloring Logic
            let scoreClass = 'bg-secondary';
            if (data.score <= 3) scoreClass = 'bg-danger';
            else if (data.score <= 7) scoreClass = 'bg-warning text-dark';
            else scoreClass = 'bg-success';

            const card = document.createElement('div');
            card.className = 'doc-card p-4 position-relative';
            card.innerHTML = `
                <div class="position-absolute top-0 end-0 m-3 d-flex gap-1">
                    <button class="btn btn-sm btn-link text-primary edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-link text-danger delete-btn" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-start mb-3 pe-5">
                    <div class="d-flex align-items-center">
                         <div class="p-3 bg-light rounded-3 me-3">
                             <i class="fas fa-building text-primary fs-4"></i>
                         </div>
                         <div>
                            <h4 class="fw-bold m-0 text-dark">${data.company}</h4>
                            <span class="text-muted small">${date} &bull; ${data.role}</span>
                         </div>
                    </div>
                    <div class="badge ${scoreClass} rounded-pill px-3 py-2 fs-6 shadow-sm">
                        ${data.score}/10
                    </div>
                </div>
                <div class="p-3 bg-light rounded-3 text-dark border-start border-4 ${data.score <= 3 ? 'border-danger' : (data.score <= 7 ? 'border-warning' : 'border-success')}" style="min-height: 50px;">
                    <div class="fw-bold mb-1 small text-uppercase opacity-50"><i class="fas fa-comment-alt me-1"></i> Feedback</div>
                    <div class="fst-italic">${data.feedback || 'No feedback recorded.'}</div>
                </div>
            `;

            // Edit Event
            card.querySelector('.edit-btn').onclick = () => {
                document.getElementById('edit-id').value = id;
                document.getElementById('edit-company').value = data.company;
                document.getElementById('edit-role').value = data.role;
                document.getElementById('edit-score').value = data.score;
                document.getElementById('edit-score').nextElementSibling.value = data.score;
                document.getElementById('edit-feedback').value = data.feedback || '';
                if (editModal) editModal.show();
            };

            // Delete Event
            card.querySelector('.delete-btn').onclick = async () => {
                if (confirm("Are you sure you want to delete this log?")) {
                    await deleteDoc(doc(db, "mock_interviews", id));
                }
            };

            logsContainer.appendChild(card);
        });
    });
}
