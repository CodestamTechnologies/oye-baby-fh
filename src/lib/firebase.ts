import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCY0D1N2Tm1ZEXFhyTf94Tsuaz6xpMxaPA",
  authDomain: "femeie-ab6bf.firebaseapp.com",
  projectId: "femeie-ab6bf",
  storageBucket: "femeie-ab6bf.firebasestorage.app",
  messagingSenderId: "794214773299",
  appId: "1:794214773299:web:6046aaf4bc3a1fc2ba6946",
  measurementId: "G-F9GDK0KK71"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
