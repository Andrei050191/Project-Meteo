import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6u3SC1eeEoxFZ960MOCNVjVWS1HVfekY",
  authDomain: "weather---dashboard-2a06c.firebaseapp.com",
  projectId: "weather---dashboard-2a06c",
  storageBucket: "weather---dashboard-2a06c.firebasestorage.app",
  messagingSenderId: "467126951387",
  appId: "1:467126951387:web:dcbb886bba54d0ca16dbfe"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// așteptăm LOGIN-ul anonim (FOARTE IMPORTANT)
export const authReady = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) resolve(user);
    else signInAnonymously(auth);
  });
});
