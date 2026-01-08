# Placement Prep Tracker 🎓

A **Smart Readiness Dashboard** designed to help students track and optimize their placement preparation journey.

> **Status**: 🟢 Feature Complete (MVP Ready)
> 
> **Live Demo**: [https://google-hackthon-final.vercel.app/](https://google-hackthon-final.vercel.app/)

## 🚀 Key Features

*   **📊 Smart Dashboard**: Auto-calculates your "Readiness Score" and automatically flags weak areas (subjects with < 2 hours study).
*   **📝 Activity Tracker**: 
    *   **Daily Tasks**: Manage your to-do list with 'DSA', 'Aptitude', and 'Core CS' categories.
    *   **Study Logger**: Log hours to feed the readiness algorithm.
    *   **Code Submissions**: Upload daily code snippets directly to the cloud.
*   **💼 Resume Vault**: Securely store and manage multiple versions of your CV.
*   **🗣️ Mock Interview Log**: Track your interview performance and feedback.
*   **🎨 Modern UI**: Features a "Deep Violet" aesthetic with Neumorphic cards and smooth animations.

## 🛠️ Tech Stack

*   **Frontend**: Vanilla JavaScript (ES Modules), HTML5
*   **Styling**: Bootstrap 5 + Custom Design System (`modern-theme.css`)
*   **Backend**: Firebase v9 (Auth, Firestore, Storage)
*   **Visualization**: Chart.js

## 💻 How to Run Locally

Since this project uses ES Modules, it requires a local server.

1.  **install http-server**:
    ```bash
    npm install -g http-server
    ```

2.  **Start the server**:
    ```bash
    npx http-server . -p 8080
    ```

3.  **Open in Browser**:
    Go to `http://localhost:8080`

## 🔥 Firebase Configuration

This app uses Firebase for backend services. Configuration is handled in `scripts/firebase-config.js`.

**Security Note**: For production, ensure Firestore Security Rules are configured to allow access only to the data owner:
```javascript
allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
```
