import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

/**
 * Monitors authentication state.
 * - Redirects unauthenticated users to login.html.
 * - Sets up the Logout button listener if the user is logged in.
 * - Invokes a callback (onUserAvailable) when the user is confirmed.
 * - NEW: Checks for "interests" field and redirects to interests.html if missing.
 */
/**
 * Global Event Listeners (Logout & Profile)
 * Initialized immediately when module is loaded.
 */
document.body.addEventListener('click', (e) => {
    // Handle Logout
    if (e.target.closest('#menu-logout') || e.target.closest('#dropdown-logout')) {
        e.preventDefault();
        console.log("[AuthGuard] Logout Clicked");

        signOut(auth).then(() => {
            console.log("[AuthGuard] Signed out successfully");
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error("[AuthGuard] Logout Failed:", error);
            alert("Logout failed: " + error.message);
        });
    }

    // Handle Profile (Modal)
    if (e.target.closest('#navbar-profile')) {
        e.preventDefault();

        const modalEl = document.getElementById('userProfileModal');
        if (!modalEl) return;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        // 1. Show Loading State
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const joinedEl = document.getElementById('profile-joined');
        const interestsEl = document.getElementById('profile-interests');

        nameEl.textContent = "Loading...";
        emailEl.textContent = "...";
        joinedEl.textContent = "--";
        interestsEl.innerHTML = '<span class="text-muted small">Loading interests...</span>';

        // 2. Fetch Fresh Data
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef).then(userSnap => {
                if (userSnap.exists()) {
                    const data = userSnap.data();

                    // Update Name & Email
                    nameEl.textContent = data.displayName || "User";
                    emailEl.textContent = data.email || user.email;

                    // Update Joined Date
                    if (data.createdAt) {
                        const date = new Date(data.createdAt);
                        joinedEl.textContent = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }

                    // Update Interests
                    const allInterests = [];
                    if (data.userInterests) {
                        Object.values(data.userInterests).forEach(topics => {
                            if (Array.isArray(topics)) allInterests.push(...topics);
                        });
                    }

                    if (allInterests.length > 0) {
                        interestsEl.innerHTML = allInterests.map(interest => `<span>${interest}</span>`).join('');
                    } else {
                        interestsEl.innerHTML = '<span class="text-muted small">No interests selected yet.</span>';
                    }
                }
            }).catch(err => {
                console.error("[Profile] Error fetching details:", err);
                nameEl.textContent = "Error Loading";
            });
        }
    }
});

/**
 * Monitors authentication state.
 * - Redirects unauthenticated users to login.html.
 * - Invokes a callback (onUserAvailable) when the user is confirmed.
 */
export function setupAuthObserver(onUserAvailable) {
    console.log("[AuthGuard] Initializing observer...");

    // Set persistence to Local (default, but explicit for clarity)
    setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error("[AuthGuard] Persistence failed:", error);
    });

    onAuthStateChanged(auth, async (user) => {
        const path = window.location.pathname;
        const isAuthPage = path.includes('login.html') || path.includes('register.html') || path === '/' || path.endsWith('index.html');
        const isInterestsPage = path.includes('interests.html');

        if (user) {
            console.log("[AuthGuard] User Authenticated:", user.email);

            // If on login/register page but already logged in, redirect to dashboard
            if (isAuthPage) {
                window.location.href = 'dashboard.html';
                return;
            }

            // Check for interests if NOT on the interests page already
            if (!isInterestsPage) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);

                    const userData = userSnap.data();
                    const hasLegacyInterests = userData.interests && userData.interests.length > 0;
                    const hasNewInterests = userData.userInterests && Object.values(userData.userInterests).some(val => Array.isArray(val) && val.length > 0);

                    if (!userSnap.exists() || (!hasLegacyInterests && !hasNewInterests)) {
                        console.warn("[AuthGuard] Interests not found. Redirecting to interests.html...");
                        window.location.href = 'interests.html';
                        return;
                    }
                } catch (err) {
                    console.error("[AuthGuard] Error checking interests:", err);
                }
            }

            // Run App Logic (Dashboard, Tracker, etc.)
            if (onUserAvailable) {
                onUserAvailable(user);
            }
        } else {
            console.warn("[AuthGuard] No user found. Redirecting to login...");
            if (!isAuthPage) {
                window.location.href = 'login.html';
            }
        }
    });
}
