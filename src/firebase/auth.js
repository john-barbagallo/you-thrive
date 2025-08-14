// src/firebase/auth.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

googleProvider.setCustomParameters({ 
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    console.log('Starting popup sign in...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Sign in successful, user:', user.email);
    console.log('User ID:', user.uid);
    
    // Create/update user document
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('Creating new user document...');
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        streak: 0,
        lastActiveDate: null
      });
    } else {
      console.log('User document already exists');
    }
    
    // Check if auth persisted
    console.log('Current auth user:', auth.currentUser?.email);
    
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const logout = () => signOut(auth);