// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { json } from "react-router-dom";

// Your web app's Firebase configuration (replace with your config from Firebase console)
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Set up Google provider
const googleProvider = new GoogleAuthProvider();

// set up Facebook provider
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, signInWithPopup, facebookProvider };
