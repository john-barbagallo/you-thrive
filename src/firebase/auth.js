// src/firebase/auth.js
import { signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

// Detect if mobile device
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detect Safari
const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const signInWithGoogle = async () => {
  try {
    let result;
    
    // Use redirect for mobile devices and Safari
    if (isMobile() || isSafari()) {
      console.log('Using redirect method for mobile/Safari');
      await signInWithRedirect(auth, googleProvider);
      // Page will redirect, no result returned here
      return;
    } else {
      // Use popup for desktop Chrome/Firefox/Edge
      console.log('Using popup method for desktop');
      result = await signInWithPopup(auth, googleProvider);
    }
    
    if (result) {
      const user = result.user;
      
      // Create/update user document
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          streak: 0,
          lastActiveDate: null
        });
      }
      
      return user;
    }
  } catch (error) {
    console.error('Error signing in:', error);
    
    // Fallback to redirect if popup fails
    if (error.code === 'auth/popup-blocked') {
      console.log('Popup blocked, using redirect');
      await signInWithRedirect(auth, googleProvider);
      return;
    }
    
    throw error;
  }
};

export const logout = () => signOut(auth);