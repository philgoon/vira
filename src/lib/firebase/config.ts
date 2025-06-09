// [R7.1] Firebase SDK Setup: Initializes and exports Firebase services.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIc096gr0JnkPv8LIa-AVFbwQ8kQBXfG0",
  authDomain: "sys-84555235347505089885409240.firebaseapp.com",
  projectId: "sys-84555235347505089885409240",
  storageBucket: "sys-84555235347505089885409240.appspot.com",
  messagingSenderId: "192857518020",
  appId: "1:192857518020:web:27d7c16a1e5334c3bd3e91",
  measurementId: "G-FZ3P0392EL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, db, analytics };
