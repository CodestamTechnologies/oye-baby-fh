import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
   apiKey: "AIzaSyDMrh2a3eiBllDF77HPr8w4iWIiadlyoVE",
  authDomain: "oye-baby-e3259.firebaseapp.com",
  projectId: "oye-baby-e3259",
  storageBucket: "oye-baby-e3259.firebasestorage.app",
  messagingSenderId: "889126030388",
  appId: "1:889126030388:web:48909fe1cdc1e7bce60e61",
  measurementId: "G-L91FHXJKD9"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
