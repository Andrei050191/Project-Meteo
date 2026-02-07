import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6u3SC1eeEoxFZ960MOCNVjVWS1HVfekY",
  authDomain: "weather---dashboard-2a06c.firebaseapp.com",
  projectId: "weather---dashboard-2a06c",
  storageBucket: "weather---dashboard-2a06c.firebasestorage.app",
  messagingSenderId: "467126951387",
  appId: "1:467126951387:web:dcbb886bba54d0ca16dbfe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

// Authentication (anonim)
export const auth = getAuth(app);
signInAnonymously(auth);
