// src/firebase/db.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection, 
  query, 
  where, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from './config';

// Save daily entry (morning or evening)
export const saveDailyEntry = async (userId, entryData) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const entryId = `${date}_${entryData.type}`;
  
  const entryRef = doc(db, 'users', userId, 'entries', entryId);
  await setDoc(entryRef, {
    ...entryData,
    timestamp: new Date().toISOString(),
    date
  });
};

// Get today's entries
export const getTodayEntries = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const entriesRef = collection(db, 'users', userId, 'entries');
  const q = query(entriesRef, where('date', '==', today));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Save daily actions
export const saveDailyActions = async (userId, actions) => {
  const date = new Date().toISOString().split('T')[0];
  const actionsRef = doc(db, 'users', userId, 'actions', date);
  
  await setDoc(actionsRef, {
    actions,
    timestamp: new Date().toISOString(),
    date
  });
};

// Get streak count
export const getStreak = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.data()?.streak || 0;
};

// Update streak
export const updateStreak = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  
  let newStreak = 1;
  
  if (userData.lastActiveDate) {
    const lastDate = new Date(userData.lastActiveDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak = (userData.streak || 0) + 1;
    } else if (diffDays === 0) {
      newStreak = userData.streak || 1;
    }
  }
  
  await setDoc(userRef, {
    ...userData,
    streak: newStreak,
    lastActiveDate: today
  });
  
  return newStreak;
};