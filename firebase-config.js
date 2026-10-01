// ===== FIREBASE CONFIG =====
// This connects the website to your Firebase project's database.
const firebaseConfig = {
  apiKey: "AIzaSyCSn69GMg96JXPgsMjDy3kZINmLbHQlWtA",
  authDomain: "welcome-party-bdf41.firebaseapp.com",
  projectId: "welcome-party-bdf41",
  storageBucket: "welcome-party-bdf41.firebasestorage.app",
  messagingSenderId: "861528089296",
  appId: "1:861528089296:web:8cb65540aaa79b38e474d5"
};

// Initialize Firebase and create a reference to the database
// "db" will be used in script.js to save registrations
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();