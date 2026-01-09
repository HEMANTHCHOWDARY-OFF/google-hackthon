import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { TOPICS_MASTER } from './master-data.js';
import { animateCounter, typeText, staggeredFadeIn, animateProgressBar, initializeAnimations } from './animations.js';

export async function initDashboard(user) {
    console.log("[Dashboard] Initializing for user:", user.uid);

    const container = document.getElementById('main-content');
    if (!container) {
        console.error("[Dashboard] Error: #main-content container not found in HTML!");
        return;
    }

    // 1. Get user name for greeting
    const userName = user.displayName || "User";

    // 1. Inject UI Structure (Hero + Grid + Cards)
    container.innerHTML = `
        <div class="doc-hero" style="padding: 4rem 0 3rem;">
            <div class="doc-container">
                <div id="greeting-container" style="margin-bottom: 2rem;">
                    <h1 id="animated-greeting" style="font-size: 3rem; margin-bottom: 0.5rem; min-height: 80px;"></h1>
                    <p id="animated-subtitle" style="opacity: 0; font-size: 1.2rem;">Track your daily progress, analyze weak areas, and log your journey to success.</p>
                </div>
            </div>
        </div>

        <div class="doc-container">
            <!-- Metrics Row -->
            <div class="row g-4 mb-4">
                 <!-- Readiness Score -->
                 <div class="col-md-6 col-lg-3">
                    <div class="doc-card text-center d-flex flex-column justify-content-center align-items-center">
                        <h3 class="doc-card-title justify-content-center text-primary">
                             <i class="fas fa-chart-line me-2"></i> Readiness
                        </h3>
                        <div class="doc-stat-value" id="readiness-score">--%</div>
                        <p class="text-muted small mb-0">Task Completion Rate</p>
                    </div>
                </div>

                <!-- Total Tasks -->
                <div class="col-md-6 col-lg-3">
                    <div class="doc-card text-center d-flex flex-column justify-content-center align-items-center">
                         <h3 class="doc-card-title justify-content-center text-success">
                            <i class="fas fa-tasks me-2"></i> Active Tasks
                        </h3>
                        <div class="doc-stat-value" id="active-tasks">--</div>
                        <p class="text-muted small mb-0">Items in Tracker</p>
                    </div>
                </div>

                 <!-- Study Hours -->
                 <div class="col-md-6 col-lg-3">
                    <div class="doc-card text-center d-flex flex-column justify-content-center align-items-center">
                         <h3 class="doc-card-title justify-content-center text-info">
                            <i class="fas fa-clock me-2"></i> Study Hours
                        </h3>
                        <div class="doc-stat-value" id="total-hours">--</div> 
                        <p class="text-muted small mb-0">Total Logged Time</p>
                    </div>
                </div>
                
                 <!-- Interviews -->
                 <div class="col-md-6 col-lg-3">
                    <div class="doc-card text-center d-flex flex-column justify-content-center align-items-center">
                         <h3 class="doc-card-title justify-content-center text-warning">
                            <i class="fas fa-users me-2"></i> Mocks
                        </h3>
                        <div class="doc-stat-value" id="total-mocks">--</div> 
                        <p class="text-muted small mb-0">Interviews Given</p>
                    </div>
                </div>
            </div>

            <!-- Topic Mastery Row -->
            <div class="row g-4 mb-4">
                <div class="col-12">
                    <div class="doc-card">
                        <h3 class="doc-card-title mb-3">
                            <i class="fas fa-graduation-cap me-2 text-primary"></i> Topic Mastery
                        </h3>
                        <div id="topic-mastery-list" class="row g-3">
                            <p class="text-center text-muted py-3">Loading progress...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Row -->
            <div class="row g-4">
                <!-- Chart -->
                <div class="col-lg-8">
                     <div class="doc-card h-100">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h3 class="doc-card-title m-0">Subject Proficiency</h3>
                        </div>
                        <div style="position: relative; height: 300px; width: 100%;">
                            <canvas id="progressChart"></canvas>
                        </div>
                     </div>
                </div>

                <!-- Weak Areas -->
                 <div class="col-lg-4">
                      <div class="doc-card h-100 weak-areas-card">
                        <h3 class="doc-card-title text-danger mb-3">
                            <i class="fas fa-exclamation-triangle me-2"></i> Weak Areas
                        </h3>
                        <p class="small text-muted mb-3">Subjects with low task completion or low study hours.</p>
                        <div id="weak-areas-list" class="d-flex flex-column gap-2" style="max-height: 450px; overflow-y: auto; padding-right: 8px;">
                            <p class="text-center text-muted py-3">Analyzing data...</p>
                        </div>
                        <style>
                            #weak-areas-list::-webkit-scrollbar { width: 4px; }
                            #weak-areas-list::-webkit-scrollbar-track { background: transparent; }
                            #weak-areas-list::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
                            #weak-areas-list::-webkit-scrollbar-thumb:hover { background: #fecaca; }
                        </style>
                     </div>
                 </div>
            </div>
        </div>
    `;

    // 2. Animate the greeting with split text effect
    animateSplitText(userName);

    // 2.5. Initialize animations
    initializeAnimations();

    // 3. Fetch Data & Render Logic
    try {
        await loadDashboardData(user);
    } catch (err) {
        console.error("Dashboard Load Error:", err);
        // Ensure "Analyzing..." is cleared if it exists
        const weakList = document.getElementById('weak-areas-list');
        if (weakList) weakList.innerHTML = `<p class="text-danger small">Error loading data.</p>`;
    } finally {
        // Remove Initial Loader
        const loader = document.getElementById('initial-loader');
        if (loader) loader.remove();
    }
}

function animateSplitText(userName) {
    const greetingEl = document.getElementById('animated-greeting');
    const subtitleEl = document.getElementById('animated-subtitle');

    if (!greetingEl) return;

    // Create the full text: "Hi John, Welcome Back!"
    const fullText = `Hi ${userName} Welcome Back to Prep Tracker`;

    // Split into individual characters
    const chars = fullText.split('');

    // Clear the element
    greetingEl.innerHTML = '';

    // Create a span for each character
    chars.forEach((char, index) => {
        const span = document.createElement('span');

        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }

        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'all 0.5s ease';

        // Add gradient color effect
        if (char !== ' ' && char !== ',' && char !== '!') {
            const hue = 250 + (index * 5); // Purple to violet gradient
            span.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 20}, 80%, 60%))`;
            span.style.webkitBackgroundClip = 'text';
            span.style.backgroundClip = 'text';
            span.style.webkitTextFillColor = 'transparent';
        }

        greetingEl.appendChild(span);

        // Animate each character with staggered delay
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50); // 50ms delay between each character
    });

    // Animate subtitle with typing effect after greeting is done
    setTimeout(() => {
        const subtitleText = 'Track your daily progress, analyze weak areas, and log your journey to success.';
        typeText(subtitleEl, subtitleText, 30);
    }, chars.length * 50 + 300);
}

async function loadDashboardData(user) {
    console.log("[Dashboard] Fetching data...");

    // --- 1. Fetch Tasks ---
    const tasksQ = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const tasksSnapshot = await getDocs(tasksQ);
    const tasks = tasksSnapshot.docs.map(doc => doc.data());

    console.log(`[Dashboard] Found ${tasks.length} tasks.`);
    animateCounter(document.getElementById('active-tasks'), tasks.length, 1500);

    // --- 2. Fetch Study Logs (From subcollection) ---
    const logsQ = query(collection(db, "users", user.uid, "dailyLogs"));
    const logsSnapshot = await getDocs(logsQ);
    const logs = logsSnapshot.docs.map(doc => doc.data());

    // Calculate Total Hours
    const totalHours = logs.reduce((acc, curr) => acc + (curr.hours || 0), 0);
    animateCounter(document.getElementById('total-hours'), totalHours, 1800, '');

    // --- 3. Fetch Mocks ---
    const mocksQ = query(collection(db, "mock_interviews"), where("userId", "==", user.uid));
    const mocksSnapshot = await getDocs(mocksQ);
    animateCounter(document.getElementById('total-mocks'), mocksSnapshot.size, 1600);

    // --- 4. Logic & Calculations ---

    // Fetch Progress & Interests early for calculations
    const progressData = await fetchProgressData(user);
    const userData = await fetchUserData(user);

    // Flatten userInterests if legacy interests is missing
    let interests = userData.interests || [];
    if (interests.length === 0 && userData.userInterests) {
        interests = Object.values(userData.userInterests).flat();
    }

    // Readiness Score: (Total Completed Topics across all subjects / Total Possible Topics in Master) * 100
    let totalCompleted = 0;
    let totalPossible = 0;

    Object.keys(TOPICS_MASTER).forEach(sub => {
        const completed = progressData[sub] || [];
        totalCompleted += completed.length;
        totalPossible += TOPICS_MASTER[sub].length;
    });

    const readiness = totalPossible > 0 ? ((totalCompleted / totalPossible) * 100).toFixed(1) : "0.0";

    const scoreEl = document.getElementById('readiness-score');
    animateCounter(scoreEl, parseFloat(readiness), 2000, '%');

    // Color code the score (apply after animation completes)
    setTimeout(() => {
        if (readiness >= 75) scoreEl.style.color = '#198754'; // success
        else if (readiness >= 40) scoreEl.style.color = '#ffc107'; // warning
        else scoreEl.style.color = '#dc3545'; // danger
    }, 2100);

    // Subject Proficiency Chart (Based on Mastery %)
    const chartLabels = interests.length > 0 ? interests : ['DSA', 'Aptitude', 'Core CS'];
    const chartData = chartLabels.map(sub => {
        const completed = progressData[sub] || [];
        const all = TOPICS_MASTER[sub] || [];
        return all.length > 0 ? ((completed.length / all.length) * 100).toFixed(1) : "0.0";
    });

    // Render Chart
    renderChart(chartLabels, chartData);

    // Identify Weak Areas
    identifyWeakAreas(tasks, logs, progressData, interests);

    await renderTopicMastery(user, progressData, interests);
}

async function fetchProgressData(user) {
    const progressSnapshot = await getDocs(collection(db, "users", user.uid, "progress"));
    const progressData = {};
    progressSnapshot.forEach(doc => {
        progressData[doc.id] = doc.data().completed || [];
    });
    return progressData;
}

async function fetchUserData(user) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : {};
}

async function renderTopicMastery(user, progressData, interests) {
    const list = document.getElementById('topic-mastery-list');
    if (!list) return;

    if (interests.length === 0) {
        list.innerHTML = '<p class="text-center text-muted py-3">No interests selected. Update them in settings.</p>';
        return;
    }

    list.innerHTML = '';
    interests.forEach((subject, index) => {
        const completedTopics = progressData[subject] || [];
        const allTopics = TOPICS_MASTER[subject] || [];
        const total = allTopics.length;
        const completedCount = completedTopics.length;
        const percentage = total > 0 ? ((completedCount / total) * 100).toFixed(1) : "0.0";

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
                <div class="p-3 border rounded topic-mastery-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold">${subject}</span>
                        <span class="badge bg-primary">${percentage}%</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar" role="progressbar" style="width: 0%" 
                             aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="mt-2 small text-muted">
                        ${completedCount} of ${total} topics mastered
                    </div>
                </div>
            `;
        list.appendChild(col);

        // Animate progress bar with delay
        setTimeout(() => {
            const progressBar = col.querySelector('.progress-bar');
            animateProgressBar(progressBar, parseFloat(percentage), 1500);
        }, 300 + (index * 150));
    });
}

function renderChart(labels, data) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    // Destroy existing if needed? (Not necessary for single run MPA)

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mastery %',
                data: data,
                backgroundColor: 'rgba(13, 110, 253, 0.7)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { display: true, drawBorder: false } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            },
            animation: {
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !context.dropped) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function identifyWeakAreas(tasks, logs, progressData, interests) {
    const list = document.getElementById('weak-areas-list');
    list.innerHTML = '';

    const recommendations = [];

    // 1. Check Subject-level Weakness (Legacy Logic Enhanced)
    const subjectsToCheck = [...new Set([...interests, 'DSA', 'Core CS'])];

    subjectsToCheck.forEach(sub => {
        const subTasks = tasks.filter(t => t.subject === sub);
        const subCompleted = subTasks.filter(t => t.completed).length;
        const subHours = logs
            .filter(l => l.subject === sub)
            .reduce((acc, curr) => acc + curr.hours, 0);

        let weakReason = null;
        if (subTasks.length > 0 && (subCompleted / subTasks.length) < 0.3) {
            weakReason = "Low task completion";
        } else if (subHours < 1.0 && interests.includes(sub)) {
            weakReason = "Minimal study time";
        }

        if (weakReason) {
            recommendations.push({ subject: sub, reason: weakReason, type: 'danger' });
        }
    });

    // 2. Check Topic-level "Ignoring" logic
    interests.forEach(sub => {
        const completed = progressData[sub] || [];
        const all = TOPICS_MASTER[sub] || [];
        const missing = all.filter(t => !completed.includes(t));

        if (missing.length > 0 && missing.length > (all.length * 0.7)) {
            // If more than 70% topics are missing, suggest the first one
            recommendations.push({
                subject: sub,
                reason: `Ignoring "${missing[0]}" and others`,
                type: 'warning'
            });
        } else if (missing.length > 0 && missing.length <= (all.length * 0.3)) {
            // If almost done, nudge the last few
            recommendations.push({
                subject: sub,
                reason: `Almost there! Try "${missing[0]}" next.`,
                type: 'info'
            });
        }
    });

    if (recommendations.length === 0) {
        list.innerHTML = `
            <div class="alert alert-success m-0 border-0 bg-success bg-opacity-10 text-success">
                <i class="fas fa-check-circle me-1"></i> Great balance so far!
            </div>`;
        return;
    }

    // Sort: danger first, then warning, then info
    const typeOrder = { 'danger': 0, 'warning': 1, 'info': 2 };
    recommendations.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    const renderItem = (container, rec, index) => {
        const div = document.createElement('div');
        const bgColor = rec.type === 'danger' ? 'bg-danger' : (rec.type === 'warning' ? 'bg-warning' : 'bg-info');
        const textColor = rec.type === 'danger' ? 'text-danger' : (rec.type === 'warning' ? 'text-warning' : 'text-info');

        div.className = `alert m-0 py-2 px-3 border-0 ${bgColor} bg-opacity-10 ${textColor} d-flex flex-column mb-2`;
        div.style.opacity = '0';
        div.style.transform = 'translateY(10px)';
        div.style.transition = 'all 0.5s ease';
        div.style.cursor = 'pointer'; // Make it look clickable

        div.innerHTML = `
            <div class="d-flex align-items-center fw-bold small">
                <i class="fas ${rec.type === 'danger' ? 'fa-exclamation-triangle' : 'fa-lightbulb'} me-2"></i> ${rec.subject}
            </div>
            <div class="small opacity-75 ms-4">${rec.reason}</div>
        `;

        // Add click event to navigate
        div.addEventListener('click', () => {
            window.location.href = `daily-tracker.html?subject=${encodeURIComponent(rec.subject)}`;
        });

        container.appendChild(div);

        // Trigger animation
        setTimeout(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        }, index * 100);
    };

    const visibleCount = 5;
    recommendations.slice(0, visibleCount).forEach((rec, i) => renderItem(list, rec, i));

    if (recommendations.length > visibleCount) {
        const hiddenContainer = document.createElement('div');
        hiddenContainer.id = 'hidden-weak-areas';
        hiddenContainer.className = 'collapse';
        recommendations.slice(visibleCount).forEach(rec => renderItem(hiddenContainer, rec));
        list.appendChild(hiddenContainer);

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-sm btn-link text-muted mt-2 w-100 text-decoration-none';
        toggleBtn.innerHTML = `<i class="fas fa-chevron-down me-2"></i> Show More (${recommendations.length - visibleCount})`;

        // Manual toggle logic since we're in a doc-card
        toggleBtn.onclick = () => {
            const isShown = hiddenContainer.classList.contains('show');
            if (isShown) {
                hiddenContainer.classList.remove('show');
                toggleBtn.innerHTML = `<i class="fas fa-chevron-down me-2"></i> Show More (${recommendations.length - visibleCount})`;
            } else {
                hiddenContainer.classList.add('show');
                toggleBtn.innerHTML = `<i class="fas fa-chevron-up me-2"></i> Show Less`;
            }
        };
        list.appendChild(toggleBtn);
    }
}
