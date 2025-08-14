import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';

const StreakDisplay = () => {
  const { currentUser } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadStreak();
    }
  }, [currentUser]);

  const loadStreak = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentStreak = userData.streak || 0;
        setStreak(currentStreak);
        
        const today = new Date().toISOString().split('T')[0];
        let newStreak = 1;
        
        if (userData.lastActiveDate) {
          const lastDate = new Date(userData.lastActiveDate);
          const todayDate = new Date(today);
          const diffTime = Math.abs(todayDate - lastDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak = currentStreak + 1;
          } else if (diffDays === 0) {
            newStreak = currentStreak;
          }
        }
        
        await setDoc(userRef, {
          ...userData,
          streak: newStreak,
          lastActiveDate: today
        });
        
        setStreak(newStreak);
      } else {
        await setDoc(doc(db, 'users', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          streak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0]
        });
        setStreak(1);
      }
    } catch (error) {
      console.error('Error loading streak:', error);
      alert('❌ Could not load streak. Please refresh.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-lg text-center">
      <div className="text-4xl mb-2">🔥</div>
      <div className="text-3xl font-bold">{streak}</div>
      <div className="text-sm">Day Streak</div>
    </div>
  );
};

export default StreakDisplay;