// src/components/Dashboard/StreakDisplay.jsx
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
    }
  };

  const getStreakMessage = () => {
    if (streak === 0) return "START TODAY";
    if (streak === 1) return "DAY ONE WARRIOR";
    if (streak < 7) return "BUILDING MOMENTUM";
    if (streak < 30) return "UNSTOPPABLE FORCE";
    if (streak < 100) return "LEGENDARY STATUS";
    return "ABSOLUTE CHAMPION";
  };

  return (
    <div className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)`
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative">
        <div className="text-slate-900 font-black text-sm mb-2 opacity-90">CURRENT STREAK</div>
        <div className="flex items-baseline space-x-2">
          <div className="text-6xl sm:text-7xl font-black text-slate-900">{streak}</div>
          <div className="text-2xl sm:text-3xl">🔥</div>
        </div>
        <div className="text-slate-900 font-bold text-sm mt-2">{getStreakMessage()}</div>
        
        {streak > 0 && streak % 7 === 0 && (
          <div className="mt-3 bg-slate-900 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
            🏆 WEEK MILESTONE!
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;