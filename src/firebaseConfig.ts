// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // এই লাইনটি যোগ করা হয়েছে

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkB9KKJNHS_Fnv1QR-NjIBVTp8V5xxSRg",
  authDomain: "bhashamitra-auth.firebaseapp.com",
  projectId: "bhashamitra-auth",
  storageBucket: "bhashamitra-auth.firebasestorage.app",
  messagingSenderId: "638249991236",
  appId: "1:638249991236:web:e8620af758bf9468115011",
  measurementId: "G-X6Y4JEMD6G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); // 'export' যোগ করা হয়েছে

// Analytics export করা হয়েছে যাতে 'unused variable' এরর না দেয়
export const analytics = getAnalytics(app); 

// Authentication (এই অংশটি আপনার কোডে মিসিং ছিল)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
