// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);