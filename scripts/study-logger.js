import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export function setupStudyLogger() {
    const form = document.getElementById('study-log-form');
    if (!form) return;

    // Remove old listeners if any by cloning (simple hack) or just add new one if careful. 
    // Since we re-render HTML, the element is fresh, so just adding listener is fine.

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("Please wait for login...");
            return;
        }

        const subject = document.getElementById('study-subject').value;
        const hours = document.getElementById('study-hours').value;
        const btn = document.getElementById('log-study-btn');

        if (!hours) { alert("Please enter hours"); return; }

        try {
            btn.disabled = true;
            btn.innerHTML = 'Saving...';
            await addDoc(collection(db, "users", user.uid, "dailyLogs"), {
                subject: subject,
                hours: parseFloat(hours || 0),
                timestamp: serverTimestamp()
            });
            alert("Study session logged!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert("Error logging study session");
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Log Session';
        }
    });
}
