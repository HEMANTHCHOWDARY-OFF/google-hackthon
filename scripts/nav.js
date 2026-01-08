export function loadNav() {
    const placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;

    const currentPath = window.location.pathname;

    // Helper to check active state (handling local file paths vs server paths)
    const isActive = (page) => currentPath.includes(page) ? 'active fw-bold primary-text' : 'second-text';

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    const themeIcon = savedTheme === 'dark' ? 'fa-sun' : 'fa-moon';
    // -------------------

    placeholder.innerHTML = `
    <div class="d-flex" id="wrapper">
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <div class="sidebar-heading text-center py-4 fs-4 fw-bold text-uppercase border-bottom">
                <i class="fas fa-graduation-cap me-2"></i>PrepTracker
            </div>
            <div class="list-group list-group-flush my-3">
                <a href="dashboard.html" class="list-group-item list-group-item-action bg-transparent ${isActive('dashboard')}">
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </a>
                <a href="daily-tracker.html" class="list-group-item list-group-item-action bg-transparent ${isActive('daily-tracker')}">
                    <i class="fas fa-calendar-check me-2"></i>Daily Tracker
                </a>
                <a href="analytics.html" class="list-group-item list-group-item-action bg-transparent ${isActive('analytics')}">
                    <i class="fas fa-chart-pie me-2"></i>Analytics
                </a>
                <a href="resume-vault.html" class="list-group-item list-group-item-action bg-transparent ${isActive('resume-vault')}">
                    <i class="fas fa-file-pdf me-2"></i>Resume Vault
                </a>
                <a href="mock-interviews.html" class="list-group-item list-group-item-action bg-transparent ${isActive('mock-interviews')}">
                    <i class="fas fa-user-tie me-2"></i>Mock Interviews
                </a>
                <a href="#" id="menu-logout" class="list-group-item list-group-item-action bg-transparent text-danger fw-bold mt-5">
                    <i class="fas fa-power-off me-2"></i>Logout
                </a>
            </div>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-white py-4 px-4 shadow-sm">
                <div class="d-flex align-items-center">
                    <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
                    <h2 class="fs-2 m-0" id="page-title">Placement Tracker</h2>
                    <button class="btn btn-link text-secondary ms-3" id="theme-toggle">
                        <i class="fas ${themeIcon} fs-4"></i>
                    </button>
                </div>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-user me-2"></i>Student
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#" id="navbar-profile">Profile</a></li>
                                <li><a class="dropdown-item" href="#" id="dropdown-logout">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>

            <div class="container-fluid px-4">
                <!-- Main Content Injection Point -->
                <div id="main-content"></div>
            </div>
        </div>
    </div>
    `;

    // Re-attach sidebar toggle event since we just overwrote the DOM
    const el = document.getElementById("wrapper");
    const toggleButton = document.getElementById("menu-toggle");
    if (toggleButton && el) {
        toggleButton.onclick = function () {
            el.classList.toggle("toggled");
        };
    }

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.onclick = function () {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Toggle Icon
            const icon = themeBtn.querySelector('i');
            if (newTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        };
    }

    // --- Profile Modal Injection ---
    if (!document.getElementById('userProfileModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = `
        <div class="modal fade" id="userProfileModal" tabindex="-1" aria-labelledby="userProfileModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content profile-modal-content">
                    <div class="modal-header border-0 pb-0">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body pt-0 text-center">
                        <div class="profile-avatar-container mb-3">
                            <div class="profile-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>
                        <h4 class="fw-bold mb-1" id="profile-name">Loading...</h4>
                        <p class="text-muted small mb-4" id="profile-email">...</p>
                        
                        <div class="profile-info-grid text-start">
                            <div class="info-item">
                                <label class="text-uppercase small fw-bold text-muted">Joined On</label>
                                <p class="mb-0" id="profile-joined">--</p>
                            </div>
                            <div class="info-item mt-3">
                                <label class="text-uppercase small fw-bold text-muted">Interests</label>
                                <div class="interests-summary d-flex flex-wrap gap-1 mt-1" id="profile-interests">
                                    <span class="text-muted small">Loading interests...</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-3 border-top">
                            <a href="interests.html" class="btn btn-outline-primary btn-sm rounded-pill px-4">
                                Update Interests
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(modalDiv);
    }
}
