// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaq-f_NT57qSa65ilGe_OPwNNIa4ayvZc",
  authDomain: "you-thrive.firebaseapp.com",
  projectId: "you-thrive",
  storageBucket: "you-thrive.firebasestorage.app",
  messagingSenderId: "1010853640313",
  appId: "1:1010853640313:web:95b2eb1275334c68a8fca8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();