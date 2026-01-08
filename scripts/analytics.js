import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { TOPICS_MASTER } from './master-data.js';

export async function initAnalytics(user) {
    const container = document.getElementById('main-content');
    if (!container) return;

    // 1. Inject UI Structure
    container.innerHTML = `
        <div class="doc-hero">
            <div class="doc-container">
                <h1>Deep Dive Analytics</h1>
                <p>Visualize your study patterns, interview performance, and mastery.</p>
            </div>
        </div>

        <div class="doc-container mb-5">
            <div class="row g-4">
                 <!-- Main Charts -->
                 <div class="col-md-6">
                      <div class="doc-card h-100">
                         <h3 class="doc-card-title mb-4"><i class="fas fa-chart-pie me-2 text-primary"></i>Study Distribution</h3>
                         <div style="height: 300px;">
                            <canvas id="studyChart"></canvas>
                         </div>
                      </div>
                </div>
                 <div class="col-md-6">
                      <div class="doc-card h-100">
                         <h3 class="doc-card-title mb-4"><i class="fas fa-chart-line me-2 text-primary"></i>Mock Score Trend</h3>
                          <div style="height: 300px;">
                            <canvas id="scoreChart"></canvas>
                         </div>
                      </div>
                </div>

                <!-- Smart Analytics -->
                <div class="col-lg-8">
                    <div class="doc-card h-100">
                        <h3 class="doc-card-title mb-4"><i class="fas fa-brain me-2 text-primary"></i>Skill Gap Indicator</h3>
                        <div id="skill-gap-container" class="vstack gap-3">
                            <p class="text-muted text-center py-4">Analyzing your topic mastery...</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="doc-card h-100">
                        <h3 class="doc-card-title mb-4"><i class="fas fa-calendar-check me-2 text-primary"></i>Productivity Insights</h3>
                        <div id="monthly-trend-container" class="text-center py-2">
                             <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                        <hr class="my-4">
                        <div id="heatmap-container" class="text-center">
                            <p class="small text-muted mb-0">Daily Engagement</p>
                            <div id="productivity-heatmap" class="d-flex flex-wrap gap-1 justify-content-center mt-2">
                                <!-- Heatmap dots will be injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Load Data
    try {
        await loadAnalyticsData(user);
    } catch (err) {
        console.error("Analytics Load Error:", err);
        container.innerHTML += `<p class="text-danger text-center">Error loading analytics data: ${err.message}</p>`;
    } finally {
        const loader = document.getElementById('initial-loader');
        if (loader) loader.remove();
    }
}

async function loadAnalyticsData(user) {
    // --- 1. Study Hours Data (Daily Logs) ---
    try {
        const studyQ = query(collection(db, "users", user.uid, "dailyLogs"));
        const studySnapshot = await getDocs(studyQ);

        const subjectHours = {};
        const dailyMinutes = {}; // For heatmap/trend
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let thisMonthHours = 0;
        let lastMonthHours = 0;

        studySnapshot.forEach(doc => {
            const d = doc.data();
            const hours = parseFloat(d.hours) || 0;

            // Subject Distribution
            if (!subjectHours[d.subject]) subjectHours[d.subject] = 0;
            subjectHours[d.subject] += hours;

            // Monthly Trends
            if (d.timestamp) {
                const date = d.timestamp.toDate();
                const dateKey = date.toISOString().split('T')[0];
                dailyMinutes[dateKey] = (dailyMinutes[dateKey] || 0) + (hours * 60);

                if (date.getFullYear() === currentYear) {
                    if (date.getMonth() === currentMonth) {
                        thisMonthHours += hours;
                    } else if (date.getMonth() === currentMonth - 1) {
                        lastMonthHours += hours;
                    }
                } else if (currentMonth === 0 && date.getFullYear() === currentYear - 1 && date.getMonth() === 11) {
                    // Handle year transition for December
                    lastMonthHours += hours;
                }
            }
        });

        renderStudyChart(subjectHours);
        renderMonthlyTrend(thisMonthHours, lastMonthHours);
        renderProductivityHeatmap(dailyMinutes);
    } catch (err) {
        console.error("Study Hours Analytics Error:", err);
    }

    // --- 2. Mock Scores Data ---
    try {
        // Removed orderBy to avoid index requirement
        const mockQ = query(collection(db, "mock_interviews"), where("userId", "==", user.uid));
        const mockSnapshot = await getDocs(mockQ);

        const mocks = [];
        mockSnapshot.forEach(doc => {
            mocks.push({ id: doc.id, ...doc.data() });
        });

        // Client-side Sort: CreatedAt Ascending for Trend Chart
        mocks.sort((a, b) => {
            const tA = a.createdAt ? a.createdAt.toMillis() : 0;
            const tB = b.createdAt ? b.createdAt.toMillis() : 0;
            return tA - tB;
        });

        const scores = mocks.map(m => m.score);
        const labels = mocks.map(m => {
            const dateStr = m.createdAt ? m.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '?';
            return `${m.company} (${dateStr})`;
        });

        renderScoreChart(labels, scores);
    } catch (err) {
        console.error("Mock Scores Analytics Error:", err);
    }

    // --- 3. Topic Completion (Skill Gap) ---
    try {
        await loadSkillGap(user);
    } catch (err) {
        console.error("Skill Gap Analytics Error:", err);
    }
}

async function loadSkillGap(user) {
    const container = document.getElementById('skill-gap-container');
    if (!container) return;

    try {
        // Fetch User Interests to know which subjects to show
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        let interests = userDoc.exists() ? (userDoc.data().interests || []) : [];

        // Fallback to new userInterests structure
        if (interests.length === 0 && userDoc.exists() && userDoc.data().userInterests) {
            interests = Object.values(userDoc.data().userInterests).flat();
        }

        if (interests.indexOf('General') === -1) interests.push('General');

        container.innerHTML = '';

        // Optimization: Fetch all progress docs in parallel
        const progressRequests = interests.map(async (subject) => {
            const progressRef = doc(db, "users", user.uid, "progress", subject);
            const progressDoc = await getDoc(progressRef);
            return { subject, doc: progressDoc };
        });

        const progressResults = await Promise.all(progressRequests);

        for (const { subject, doc: progressDoc } of progressResults) {
            const completedTopics = progressDoc.exists() ? (progressDoc.data().completed || []) : [];
            const totalTopics = TOPICS_MASTER[subject] ? TOPICS_MASTER[subject].length : 0;

            if (totalTopics === 0) continue;

            const percent = ((completedTopics.length / totalTopics) * 100).toFixed(1);

            const item = document.createElement('div');
            item.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-bold text-dark">${subject}</span>
                    <span class="text-muted small">${completedTopics.length} / ${totalTopics} topics</span>
                </div>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%; background-color: var(--doc-primary);" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            container.appendChild(item);
        }

        if (container.innerHTML === '') {
            container.innerHTML = `<p class="text-muted text-center py-4">No topics tracked yet. Fill your interests and log activity!</p>`;
        }

    } catch (err) {
        console.error("Skill Gap Error:", err);
        container.innerHTML = `<p class="text-danger small">Error loading mastery data.</p>`;
    }
}

function renderStudyChart(data) {
    const ctx = document.getElementById('studyChart');
    if (!ctx) return;

    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const labels = Object.keys(data).map(key => {
        const percent = total > 0 ? ((data[key] / total) * 100).toFixed(1) : "0.0";
        return `${key} (${percent}%)`;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#009d63', '#3b71ca', '#dc3545', '#ffc107', '#17a2b8', '#6610f2', '#fd7e14'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20 }
                }
            }
        }
    });
}

function renderScoreChart(labels, data) {
    const ctx = document.getElementById('scoreChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (1-10)',
                data: data,
                borderColor: '#6610f2',
                backgroundColor: 'rgba(102, 16, 242, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6610f2',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderMonthlyTrend(thisMonth, lastMonth) {
    const container = document.getElementById('monthly-trend-container');
    if (!container) return;

    const diff = thisMonth - lastMonth;
    const isUp = diff >= 0;

    container.innerHTML = `
        <div class="display-5 fw-bold text-dark">${thisMonth.toFixed(1)}h</div>
        <div class="text-muted small mb-2">Total study time this month</div>
        <div class="d-inline-flex align-items-center gap-1 badge ${isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill px-3">
            <i class="fas fa-caret-${isUp ? 'up' : 'down'}"></i>
            ${Math.abs(diff).toFixed(1)}h vs last month
        </div>
    `;
}

function renderProductivityHeatmap(dailyMinutes) {
    const container = document.getElementById('productivity-heatmap');
    if (!container) return;

    container.innerHTML = '';
    const now = new Date();
    // Show last 28 days
    for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const minutes = dailyMinutes[key] || 0;

        let color = '#f8f9fa'; // empty
        if (minutes > 0) color = '#d1e7dd';
        if (minutes > 60) color = '#a3cfbb';
        if (minutes > 180) color = '#198754';
        if (minutes > 300) color = '#0f5132';

        const dot = document.createElement('div');
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.borderRadius = '2px';
        dot.style.backgroundColor = color;
        dot.setAttribute('title', `${d.toLocaleDateString()}: ${Math.round(minutes)} mins`);
        container.appendChild(dot);
    }
}
