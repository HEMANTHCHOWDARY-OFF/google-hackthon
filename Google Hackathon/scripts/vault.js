import { auth, db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

export function initVault() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
        <div class="doc-hero">
            <div class="doc-container">
                <h1>Resume Vault</h1>
                <p>Securely manage and version control your resumes.</p>
            </div>
        </div>

        <div class="doc-container">
            <div class="row g-4">
                <!-- Upload Form -->
                <div class="col-lg-5">
                     <div class="doc-card sticky-top" style="top: 2rem; z-index: 1;">
                        <h4 class="doc-card-title mb-4">
                            <i class="fas fa-cloud-upload-alt text-primary"></i> Upload New Version
                        </h4>
                        
                        <form id="vault-upload-form">
                            <div class="mb-3">
                                <label class="text-label mb-1">Version Name</label>
                                <input type="text" class="form-control" id="resume-label" placeholder="e.g. Frontend V1" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="text-label mb-1">Tag / Type</label>
                                <select class="form-select" id="resume-tag">
                                    <option value="General">General</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Full Stack">Full Stack</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="text-label mb-1">Resume File (PDF)</label>
                                <input class="form-control" type="file" id="resume-file" accept=".pdf" required>
                                <div class="form-text">Max size 5MB. PDF only.</div>
                            </div>

                            <button type="submit" class="btn btn-doc-primary w-100" id="upload-btn">
                                <i class="fas fa-upload me-2"></i> Upload to Vault
                            </button>

                            <!-- Progress Tracking -->
                            <div class="upload-progress-container" id="upload-progress-wrapper">
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="upload-progress-bar" role="progressbar" style="width: 0%"></div>
                                </div>
                                <div class="progress-text" id="upload-progress-text">Starting upload... (0%)</div>
                            </div>
                        </form>
                     </div>
                </div>

                <!-- File List -->
                <div class="col-lg-7">
                     <div class="doc-card">
                        <div class="d-flex align-items-center justify-content-between mb-4">
                            <h4 class="doc-card-title m-0">Stored Resumes</h4>
                            <span class="badge bg-light text-secondary border" id="file-count">0 Files</span>
                        </div>
                        
                        <div id="resume-list" class="vstack gap-3">
                            <div class="text-center text-muted py-5">Loading your vault...</div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    `;

    // Remove Initial Loader
    const loader = document.getElementById('initial-loader');
    if (loader) loader.remove();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setupVaultEvents(user);
        }
    });
}

function setupVaultEvents(user) {
    const uploadForm = document.getElementById('vault-upload-form');
    const resumeListEl = document.getElementById('resume-list');
    const fileCountEl = document.getElementById('file-count');

    // 1. Upload Logic
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('upload-btn');
            const label = document.getElementById('resume-label').value;
            const tag = document.getElementById('resume-tag').value;
            const fileInput = document.getElementById('resume-file');
            const file = fileInput.files[0];

            if (!file) {
                alert("Please select a file.");
                return;
            }

            // ENFORCE 1MB LIMIT for Firestore documents
            if (file.size > 1 * 1024 * 1024) {
                alert("File is too large (Max 1MB for Firestore storage). Please compress your PDF or use a smaller file.");
                return;
            }

            const originalBtn = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Converting...';
            btn.disabled = true;

            const progressWrapper = document.getElementById('upload-progress-wrapper');
            const progressBar = document.getElementById('upload-progress-bar');
            const progressText = document.getElementById('upload-progress-text');

            try {
                // Show progress UI (simulated since Base64 is fast)
                progressWrapper.style.display = 'block';
                progressBar.style.width = '30%';
                progressText.innerText = "Converting to Base64...";

                // A. Convert File to Base64
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = async () => {
                    const base64Data = reader.result;

                    progressBar.style.width = '60%';
                    progressText.innerText = "Saving to Database...";
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

                    try {
                        // B. Save to Firestore
                        await addDoc(collection(db, "users", user.uid, "resumes"), {
                            label: label,
                            tag: tag,
                            fileName: file.name,
                            fileData: base64Data, // The Base64 string
                            size: (file.size / 1024).toFixed(2) + ' KB',
                            createdAt: serverTimestamp()
                        });

                        progressBar.style.width = '100%';
                        progressText.innerText = "Successfully saved!";
                        showToast("Resume uploaded successfully!", "success");
                        uploadForm.reset();
                    } catch (err) {
                        console.error("Firestore save failed:", err);
                        showToast("Failed to save: " + err.message, "error");
                    } finally {
                        resetUploadUI();
                    }
                };

                reader.onerror = (err) => {
                    console.error("FileReader error:", err);
                    showToast("Failed to read file.", "error");
                    resetUploadUI();
                };

            } catch (err) {
                console.error("Setup failed:", err);
                showToast("Setup failed. Please try again.", "error");
                resetUploadUI();
            }

            function resetUploadUI() {
                btn.innerHTML = originalBtn;
                btn.disabled = false;
                setTimeout(() => {
                    progressWrapper.style.display = 'none';
                    progressBar.style.width = '0%';
                }, 1000);
            }
        });
    }

    // 2. Real-time List Logic
    const safeQ = query(collection(db, "users", user.uid, "resumes"));

    onSnapshot(safeQ, (snapshot) => {
        const docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));

        // Client Sort
        docs.sort((a, b) => {
            const tA = a.createdAt ? a.createdAt.toMillis() : Date.now();
            const tB = b.createdAt ? b.createdAt.toMillis() : Date.now();
            return tB - tA;
        });

        fileCountEl.innerText = `${docs.length} File${docs.length !== 1 ? 's' : ''}`;

        if (docs.length === 0) {
            resumeListEl.innerHTML = `
                <div class="text-center py-5 border rounded bg-light">
                    <i class="fas fa-folder-open fs-1 text-muted mb-3 opacity-50"></i>
                    <p class="text-muted">Your vault is empty.<br>Upload your first resume!</p>
                </div>
            `;
            return;
        }

        resumeListEl.innerHTML = '';
        docs.forEach(item => {
            const date = item.createdAt ? new Date(item.createdAt.toMillis()).toLocaleDateString() : 'Just now';
            // Use fileData (Base64) or fallback to item.url for legacy
            const downloadUrl = item.fileData || item.url || "#";

            const div = document.createElement('div');
            div.className = 'doc-card p-3 d-flex align-items-center gap-3 hover-shadow transition-all';
            div.style.cursor = 'default';

            div.innerHTML = `
                <div class="rounded p-3 bg-danger bg-opacity-10 text-danger mb-0">
                    <i class="fas fa-file-pdf fs-3"></i>
                </div>
                
                <div class="flex-grow-1 overflow-hidden">
                    <h6 class="mb-1 fw-bold text-truncate" title="${item.label}">${item.label}</h6>
                    <div class="d-flex align-items-center gap-2 small text-muted">
                        <span class="badge bg-light text-dark border">${item.tag}</span>
                        <span>• ${item.size}</span>
                        <span>• ${date}</span>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <a href="${downloadUrl}" download="${item.fileName || 'resume.pdf'}" class="btn btn-outline-primary btn-sm" title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                    <button class="btn btn-outline-danger btn-sm delete-file-btn" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            resumeListEl.appendChild(div);
        });

        // Attach Delete Listeners
        document.querySelectorAll('.delete-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e, user));
        });
    }, (error) => {
        console.error("Fetch error:", error);
        resumeListEl.innerHTML = `<p class="text-danger">Error loading vault.</p>`;
    });
}

async function handleDelete(e, user) {
    const btn = e.target.closest('button');
    const docId = btn.dataset.id;

    if (!confirm("Are you sure you want to delete this version? This cannot be undone.")) return;

    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        // Delete from Firestore only
        await deleteDoc(doc(db, "users", user.uid, "resumes", docId));
    } catch (err) {
        console.error("Delete failed:", err);
        showToast("Failed to delete file.", "error");
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// --- UI Helpers ---
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} shadow-sm fade-in`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';

    toast.innerHTML = `
        <i class="fas ${icon} fs-5"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
