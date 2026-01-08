import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, onSnapshot, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, getDoc, arrayUnion, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { TOPICS_MASTER } from './master-data.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { setupStudyLogger } from './study-logger.js';

export function initTracker(user) {
    const container = document.getElementById('main-content');
    if (!container) {
        console.error("[Tracker] Container #main-content not found!");
        return;
    }

    console.log("[Tracker] Initializing for user:", user?.uid);

    // We need to inject the HERO + Content structure. 
    // Since tracker is loaded into #main-content, we'll assume the shell handles the container.
    // Actually, in dashboard.html we put the container in valid spot. 
    // In daily-tracker.html we should have a shell. Let's make this innerHTML robust.

    container.innerHTML = `
        <div class="compact-tracker">
            <div class="doc-hero">
                <div class="doc-container">
                    <h1>Daily Plan</h1>
                    <p>Master your schedule one task at a time.</p>
                </div>
            </div>

            <div class="doc-container">
                <div class="row g-3">
                    <!-- Left Col: Tasks (Keep as is) -->
                    <div class="col-lg-7">
                         <div class="doc-card mb-3">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <h3 class="doc-card-title m-0">Tasks</h3>
                                <span class="badge bg-light text-dark border">Today</span>
                            </div>
                            
                            <div class="d-flex gap-2 mb-3">
                                <select class="form-select" id="task-subject" style="max-width: 140px;">
                                    <option value="DSA" selected>DSA</option>
                                    <option value="Aptitude">Aptitude</option>
                                    <option value="Core CS">Core CS</option>
                                    <option value="General">General</option>
                                </select>
                                <input type="text" class="form-control" placeholder="What needs to be done?" id="task-input">
                                <button class="btn btn-doc-primary" type="button" id="add-task-btn">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>

                            <ul class="list-group list-group-flush" id="task-list">
                                <li class="list-group-item text-center text-muted py-5">Loading tasks...</li>
                            </ul>
                         </div>

                         <!-- Recent Logs Section (Moved here for better layout) -->
                         <div class="doc-card">
                            <h3 class="doc-card-title mb-3">Recent Activity</h3>
                            <div id="daily-logs-list" class="vstack gap-3">
                                <p class="text-muted text-center py-3">Loading logs...</p>
                            </div>
                         </div>
                    </div>

                    <!-- Right Col: Daily Log Form + Code Submission -->
                    <div class="col-lg-5">
                        <!-- Activity Log Card -->
                        <div class="doc-card border-0 mb-3">
                            <h5 class="doc-card-title mb-3">
                                <i class="fas fa-pen-fancy text-primary"></i> Daily Activity Log
                            </h5>
                            <form id="daily-log-form">
                                <div class="row g-2 mb-2">
                                    <div class="col-6">
                                        <label class="text-label mb-1">Subject</label>
                                        <select class="form-select" id="log-subject">
                                            <option value="DSA">DSA</option>
                                            <option value="Aptitude">Aptitude</option>
                                            <option value="Core CS">Core CS</option>
                                            <option value="Mock Prep">Mock Prep</option>
                                            <option value="Development">Development</option>
                                        </select>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-label mb-1">Time (Hrs)</label>
                                        <input type="number" step="0.5" class="form-control" id="log-hours" placeholder="0.0">
                                    </div>
                                </div>
                                
                                <div class="mb-2">
                                    <label class="text-label mb-1">Problems Solved</label>
                                    <input type="number" class="form-control" id="log-problems" placeholder="e.g. 5">
                                </div>

                                 <div class="mb-2">
                                    <label class="text-label mb-1">Specific Topic</label>
                                    <select class="form-select" id="log-topic">
                                        <option value="">-- Select Subject First --</option>
                                    </select>
                                </div>

                                <div class="mb-2">
                                    <label class="text-label mb-1">Notes / Summary</label>
                                    <textarea class="form-control" id="log-notes" rows="2" placeholder="What did you learn today?"></textarea>
                                </div>

                                <button type="submit" class="btn btn-doc-primary w-100" id="save-log-btn">
                                    <i class="fas fa-save me-2"></i> Save Entry
                                </button>
                            </form>
                        </div>

                        <!-- Code Submission Card -->
                        <div class="doc-card border-0 sticky-top" style="top: 2rem; z-index: 1;">
                            <h5 class="doc-card-title mb-3">
                                <i class="fas fa-code text-primary"></i> Submit Daily Code
                            </h5>
                            <form id="code-submission-form">
                                <div class="mb-2">
                                    <label class="text-label mb-1">Topic / Problem</label>
                                    <input type="text" class="form-control" id="code-topic" placeholder="e.g. Two Sum - Array" required>
                                </div>

                                <div class="mb-3">
                                    <label class="text-label mb-1">Code File</label>
                                    <input class="form-control" type="file" id="code-file" required>
                                    <div class="form-text">Attach the code you wrote today.</div>
                                </div>

                                <button type="submit" class="btn btn-doc-primary w-100" id="submit-code-btn">
                                    <i class="fas fa-cloud-upload-alt me-2"></i> Upload Code
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Initialize Logic (Now that DOM exists)
    if (user) {
        setupTrackerEvents(user);
    } else {
        console.error("[Tracker] No user provided to initTracker");
    }
}

function setupTrackerEvents(user) {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskSubjectSelect = document.getElementById('task-subject');
    const logSubjectSelect = document.getElementById('log-subject');
    const logTopicSelect = document.getElementById('log-topic');

    // Populate Topics based on Subject
    function updateTopicDropdown(subject) {
        if (!logTopicSelect) return;
        logTopicSelect.innerHTML = '<option value="">-- Select Topic --</option>';

        const topics = TOPICS_MASTER[subject] || [];
        topics.forEach(topic => {
            const opt = document.createElement('option');
            opt.value = topic;
            opt.textContent = topic;
            logTopicSelect.appendChild(opt);
        });
    }

    if (logSubjectSelect) {
        logSubjectSelect.addEventListener('change', (e) => {
            updateTopicDropdown(e.target.value);
        });
        // Initial population
        updateTopicDropdown(logSubjectSelect.value);
    }

    // Fetch and Populate Subjects based on Interests
    async function loadInterests() {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                let interests = data.interests || [];

                // Fallback to new userInterests structure
                if (interests.length === 0 && data.userInterests) {
                    interests = Object.values(data.userInterests).flat();
                }

                const subjects = [...new Set([...interests, 'General'])];

                // Populate both selects
                [taskSubjectSelect, logSubjectSelect].forEach(select => {
                    if (!select) return;
                    select.innerHTML = ''; // Clear defaults
                    subjects.forEach(sub => {
                        const opt = document.createElement('option');
                        opt.value = sub;
                        opt.textContent = sub;
                        select.appendChild(opt);
                    });
                });
            }
        } catch (err) {
            console.error("Error loading interests:", err);
        }
    }

    loadInterests();
    const taskList = document.getElementById('task-list');

    // Add Task
    addTaskBtn.addEventListener('click', async () => {
        const text = taskInput.value;
        const subject = taskSubjectSelect ? taskSubjectSelect.value : 'General';

        if (text.trim() === '') return;

        try {
            await addDoc(collection(db, "tasks"), {
                uid: user.uid,
                text: text,
                subject: subject,
                completed: false,
                createdAt: serverTimestamp()
            });
            taskInput.value = '';
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    });

    // Real-time Listener (Client-side sorting to avoid Index requirements)
    const q = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid)
    );

    onSnapshot(q, (querySnapshot) => {
        taskList.innerHTML = "";

        let tasks = [];
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        // Client-side Sort: CreatedAt Descending
        tasks.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.toMillis() : Date.now();
            const timeB = b.createdAt ? b.createdAt.toMillis() : Date.now();
            return timeB - timeA;
        });

        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-check-circle fs-2 mb-3 text-light"></i>
                    <p>No tasks yet. You're all caught up!</p>
                </div>`;
            return;
        }

        tasks.forEach(task => {
            renderTaskItem(taskList, task.id, task);
        });
    }, (error) => {
        console.error("Error fetching tasks:", error);
        taskList.innerHTML = `<p class="text-danger text-center py-3">Error loading tasks: ${error.message}</p>`;
    });

    // --- Daily Log Logic ---
    const logForm = document.getElementById('daily-log-form');
    const logsListEl = document.getElementById('daily-logs-list');

    // 1. Save Log
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const saveBtn = document.getElementById('save-log-btn');

            const subject = document.getElementById('log-subject').value;
            const topic = document.getElementById('log-topic').value;
            const hours = parseFloat(document.getElementById('log-hours').value) || 0;
            const problems = parseInt(document.getElementById('log-problems').value) || 0;
            const notes = document.getElementById('log-notes').value;

            if (hours <= 0 && problems <= 0) {
                alert("Please enter hours studied OR problems solved.");
                return;
            }

            const originalBtnContent = saveBtn.innerHTML;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
            saveBtn.disabled = true;

            try {
                // Save to Subcollection: users/{uid}/dailyLogs
                await addDoc(collection(db, "users", user.uid, "dailyLogs"), {
                    subject,
                    topic,
                    hours,
                    problemsSolved: problems,
                    notes,
                    timestamp: serverTimestamp()
                });

                // Update User Progress
                if (topic) {
                    const progressRef = doc(db, "users", user.uid, "progress", subject);
                    await setDoc(progressRef, {
                        completed: arrayUnion(topic),
                        lastUpdated: serverTimestamp()
                    }, { merge: true });
                    console.log(`[Tracker] Progress updated for ${subject}: ${topic}`);
                }

                // Reset Form
                logForm.reset();
                document.getElementById('log-hours').value = ""; // Force clear
            } catch (err) {
                console.error("Error saving log:", err);
                alert("Failed to save entry.");
            } finally {
                saveBtn.innerHTML = originalBtnContent;
                saveBtn.disabled = false;
            }
        });
    }

    // 2. Fetch & Render Logs (Real-time)
    const logsQ = query(
        collection(db, "users", user.uid, "dailyLogs"),
        orderBy("timestamp", "desc") // requires index? or client-side sort if small
    );

    // Note: If index error occurs, we can fallback to client-side sort like tasks.
    // Let's rely on client-side sort for robustness first without waiting for index build.
    const safeLogsQ = query(collection(db, "users", user.uid, "dailyLogs"));

    onSnapshot(safeLogsQ, (snapshot) => {
        const logs = [];
        snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));

        // Client Sort
        logs.sort((a, b) => {
            const tA = a.timestamp ? a.timestamp.toMillis() : Date.now();
            const tB = b.timestamp ? b.timestamp.toMillis() : Date.now();
            return tB - tA;
        });

        if (logs.length === 0) {
            logsListEl.innerHTML = `
                <div class="text-center py-4 bg-light rounded visually-hidden-focusable">
                    <p class="text-muted mb-0">No activity logged yet. Start today!</p>
                </div>
            `;
            return;
        }

        logsListEl.innerHTML = '';
        logs.forEach(log => {
            const date = log.timestamp ? new Date(log.timestamp.toMillis()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Just now';

            const item = document.createElement('div');
            item.className = 'd-flex align-items-start p-3 border rounded bg-white shadow-sm';
            item.innerHTML = `
                <div class="me-3 text-center">
                    <div class="fw-bold text-uppercase small text-secondary">${date}</div>
                    <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mt-1 mx-auto" style="width: 40px; height: 40px;">
                        <i class="fas fa-book text-primary"></i>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <h6 class="mb-1 fw-bold">${log.subject}</h6>
                        <span class="badge bg-light text-dark border">${log.hours} hrs</span>
                    </div>
                    ${log.problemsSolved > 0 ? `<div class="small text-success mb-1"><i class="fas fa-check-circle me-1"></i> Solved ${log.problemsSolved} problems</div>` : ''}
                    ${log.notes ? `<p class="mb-0 small text-muted text-break" style="font-style: italic;">"${log.notes}"</p>` : ''}
                </div>
                <!--Optional: Delete button could go here-- >
        `;
            logsListEl.appendChild(item);
        });
    });

    // --- Code Submission Logic ---
    const codeForm = document.getElementById('code-submission-form');
    if (codeForm) {
        codeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-code-btn');
            const topic = document.getElementById('code-topic').value;
            const fileInput = document.getElementById('code-file');
            const file = fileInput.files[0];

            if (!file) {
                alert("Please select a file.");
                return;
            }

            // ENFORCE 1MB LIMIT for Firestore documents
            if (file.size > 1 * 1024 * 1024) {
                alert("File is too large (Max 1MB for Firestore storage). Please use a smaller file.");
                return;
            }

            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Converting...';
            submitBtn.disabled = true;

            try {
                console.log("[Tracker] Starting Base64 conversion for:", file.name);

                // Convert File to Base64
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = async () => {
                    const base64Data = reader.result;

                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

                    try {
                        // Save Metadata to Firestore
                        console.log("[Tracker] Saving metadata to Firestore...");
                        await addDoc(collection(db, "users", user.uid, "dailyCodes"), {
                            topic,
                            fileName: file.name,
                            fileData: base64Data, // The Base64 string
                            size: (file.size / 1024).toFixed(2) + ' KB',
                            timestamp: serverTimestamp()
                        });

                        console.log("[Tracker] Firestore addDoc complete.");
                        codeForm.reset();
                        alert("Code submitted successfully!");
                    } catch (err) {
                        console.error("[Tracker] Error saving to Firestore:", err);
                        alert("Failed to submit code: " + err.message);
                    } finally {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;
                    }
                };

                reader.onerror = (err) => {
                    console.error("[Tracker] FileReader error:", err);
                    alert("Failed to read file.");
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.disabled = false;
                };

            } catch (err) {
                console.error("[Tracker] Error in submission process:", err);
                alert("Failed to submit code: " + err.message);
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Recent Code Submissions List ---
    setupRecentSubmissions(user);
}

function setupRecentSubmissions(user) {
    // Find or create the container for recent submissions
    const codeCard = document.querySelector('#code-submission-form').closest('.doc-card');

    // Create a new section below the code submission form
    const submissionsSection = document.createElement('div');
    submissionsSection.className = 'mt-4 pt-3 border-top';
    submissionsSection.innerHTML = `
        <h6 class="text-muted mb-3"><i class="fas fa-history me-2"></i>Recent Submissions</h6>
        <div id="recent-submissions-list" class="vstack gap-2">
            <p class="text-muted text-center small py-2">Loading...</p>
        </div>
    `;
    codeCard.appendChild(submissionsSection);

    const listEl = document.getElementById('recent-submissions-list');

    // Real-time listener for code submissions
    const codesQ = query(collection(db, "users", user.uid, "dailyCodes"));

    onSnapshot(codesQ, (snapshot) => {
        const codes = [];
        snapshot.forEach(doc => codes.push({ id: doc.id, ...doc.data() }));

        // Client Sort: Most recent first
        codes.sort((a, b) => {
            const tA = a.timestamp ? a.timestamp.toMillis() : Date.now();
            const tB = b.timestamp ? b.timestamp.toMillis() : Date.now();
            return tB - tA;
        });

        if (codes.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-3 bg-light rounded">
                    <p class="text-muted small mb-0">No code submissions yet.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = '';
        // Show only the 5 most recent
        codes.slice(0, 5).forEach(item => {
            const date = item.timestamp ? new Date(item.timestamp.toMillis()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Just now';
            const downloadUrl = item.fileData || item.url || "#";

            const div = document.createElement('div');
            div.className = 'p-2 border rounded bg-white d-flex align-items-center gap-2';
            div.innerHTML = `
                <div class="flex-grow-1 overflow-hidden">
                    <div class="small fw-bold text-truncate" title="${item.topic}">${item.topic}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">
                        ${item.fileName} • ${item.size} • ${date}
                    </div>
                </div>
                <div class="d-flex gap-1">
                    <a href="${downloadUrl}" download="${item.fileName || 'code.txt'}" class="btn btn-sm btn-outline-primary" title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger delete-code-btn" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            listEl.appendChild(div);
        });

        // Attach Delete Listeners
        document.querySelectorAll('.delete-code-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const btnEl = e.target.closest('button');
                const docId = btnEl.dataset.id;

                if (!confirm("Delete this code submission?")) return;

                const originalContent = btnEl.innerHTML;
                btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btnEl.disabled = true;

                try {
                    await deleteDoc(doc(db, "users", user.uid, "dailyCodes", docId));
                } catch (err) {
                    console.error("Delete failed:", err);
                    alert("Failed to delete submission.");
                    btnEl.innerHTML = originalContent;
                    btnEl.disabled = false;
                }
            });
        });
    }, (error) => {
        console.error("Error fetching code submissions:", error);
        listEl.innerHTML = `<p class="text-danger small">Error loading submissions.</p>`;
    });
}

function renderTaskItem(container, id, task) {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center py-3 px-0 ${task.completed ? 'opacity-50' : ''}`;

    li.innerHTML = `
        <div class="d-flex align-items-center gap-3">
            <input class="form-check-input mt-0" type="checkbox" ${task.completed ? 'checked' : ''} data-id="${id}" style="width: 1.2rem; height: 1.2rem;">
            <div>
                <div class="${task.completed ? 'text-decoration-line-through' : 'fw-medium'}">${task.text}</div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-secondary border fw-normal">${task.subject}</span>
            <button class="btn btn-sm btn-link text-danger delete-btn p-0 ms-2"><i class="fas fa-times"></i></button>
        </div>
    `;

    container.appendChild(li);

    // Event Listeners
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', async (e) => {
        await updateDoc(doc(db, "tasks", id), { completed: e.target.checked });
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
        await deleteDoc(doc(db, "tasks", id));
    });
}
