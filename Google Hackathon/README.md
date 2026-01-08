# Placement Prep Tracker 🎓

A "Smart Readiness Dashboard" to help students track their placement preparation, built for the Google Hackathon. 

**Tech Stack**: Vanilla JS, Bootstrap 5, Chart.js, Firebase v9 (Auth, Firestore, Storage).

## 📂 File Structure

```text
Google Hackathon/
├── index.html            # Entry point (Redirects to login)
├── login.html            # Google/Email Auth
├── register.html         # User Registration
├── dashboard.html        # Main Stats, Readiness Score, Weak Areas
├── daily-tracker.html    # CRUD Tasks + Study Session Logger
├── resume-vault.html     # PDF Uploads to Firebase Storage
├── mock-interviews.html  # Interview Logs
├── analytics.html        # Future charts placeholder
├── styles/
│   └── main.css          # Glassmorphism & Sidebar styles
└── scripts/
    ├── app.js            # Main router (legacy/helper)
    ├── auth-guard.js     # Security middleware (redirects if not logged in)
    ├── dashboard.js      # Readiness Score & Chart.js logic
    ├── firebase-config.js# Firebase Initialization (API Keys)
    ├── interviews.js     # Firestore logic for Mock Interviews
    ├── nav.js            # Shared Sidebar/Navbar component
    ├── study-logger.js   # Logic to log study hours
    ├── tracker.js        # Logic for Daily Tasks
    └── vault.js          # Logic for Resume Uploads
```

## 🚀 Features

1.  **Readiness Score**: Auto-calculated based on your completed tasks vs. total tasks.
2.  **Weak Area Detection**: Highlights subjects where you have < 50% tasks done or < 2 hours studied.
3.  **Resume Vault**: Securely store and version your CVs using Firebase Storage.
4.  **Mock Logs**: Keep a history of your mock interviews and scores.
5.  **Multi-Page App**: Clean, separable files for easy navigation and maintenance.

## 🛠️ How to Run Locally

Since the project uses ES Modules (`import/export`), you cannot just double-click HTML files. You need a local server.

1.  **Install a server** (if you have Node.js):
    ```bash
    npm install -g http-server
    ```
2.  **Start the server**:
    ```bash
    npx http-server .
    ```
3.  **Open in Browser**:
    Go to `http://localhost:8080`.

## 🔥 Firebase Deployment

This project is ready for Firebase Hosting.

1.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login**:
    ```bash
    firebase login
    ```

3.  **Initialize**:
    ```bash
    firebase init hosting
    ```
    *   **Public directory**: Type `.` (current directory) or `public` if you move files there.
    *   **Configure as single-page app?**: No (since we use distinct .html files).
    *   **Set up automatic builds?**: No.

4.  **Deploy**:
    ```bash
    firebase deploy
    ```

Your app will be live at `https://placement-tracker-code-quartet.web.app`!
