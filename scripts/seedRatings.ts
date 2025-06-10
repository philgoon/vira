// scripts/seedRatings.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration from src/lib/firebase/config.ts
const firebaseConfig = {
  apiKey: "AIzaSyCIc096gr0JnkPv8LIa-AVFbwQ8kQBXfG0",
  authDomain: "sys-84555235347505089885409240.firebaseapp.com",
  projectId: "sys-84555235347505089885409240",
  storageBucket: "sys-84555235347505089885409240.appspot.com",
  messagingSenderId: "192857518020",
  appId: "1:192857518020:web:27d7c16a1e5334c3bd3e91",
  measurementId: "G-FZ3P0392EL" // Optional
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simple test first
async function testConnection() {
  console.log('Testing database connection...');

  try {
    const testData = {
      vendorId: 'TEST',
      quality: 5,
      communication: 5,
      reliability: 5,
      turnaroundTime: 5,
      feedback: 'This is a test rating',
      createdAt: new Date().toISOString() // Use ISO string for consistency
    };

    const docRef = await addDoc(collection(db, 'vendorRatings'), testData);
    console.log('Success! Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
