
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcTYDGhd1u3thpI7pOuDilV-cj7ZoyAu8",
  authDomain: "studio-7414263376-fc0fd.firebaseapp.com",
  projectId: "studio-7414263376-fc0fd",
  storageBucket: "studio-7414263376-fc0fd.firebasestorage.app",
  messagingSenderId: "527954872834",
  appId: "1:527954872834:web:b9bdaad9f001397c93b51b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
