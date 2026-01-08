// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgGH8SFwNbChPDlDzMZ-kNyUdDfsAD2qs",
    authDomain: "prep-tracker-1aa5a.firebaseapp.com",
    projectId: "prep-tracker-1aa5a",
    storageBucket: "prep-tracker-1aa5a.firebasestorage.app",
    messagingSenderId: "727326849510",
    appId: "1:727326849510:web:969acc279f045102e4be27",
    measurementId: "G-BTZBRRY0E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics };
