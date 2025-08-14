import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/config';

const saveDailyActions = async (userId, actions) => {
  const date = new Date().toISOString().split('T')[0];
  const actionsRef = doc(db, 'users', userId, 'actions', date);
  
  await setDoc(actionsRef, {
    actions,
    timestamp: new Date().toISOString(),
    date
  });
};

const DEFAULT_ACTIONS = [
  { id: 1, emoji: '💪', text: 'Moved my body', completed: false },
  { id: 2, emoji: '📚', text: 'Read/learned something', completed: false },
  { id: 3, emoji: '🧘', text: 'Mindful moment', completed: false },
  { id: 4, emoji: '💬', text: 'Reached out to someone', completed: false },
  { id: 5, emoji: '✨', text: 'Did something just for me', completed: false }
];

const ActionTracker = () => {
  const { currentUser } = useAuth();
  const [actions, setActions] = useState(DEFAULT_ACTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayActions();
  }, []);

  const loadTodayActions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const actionsRef = doc(db, 'users', currentUser.uid, 'actions', today);
      const actionsSnap = await getDoc(actionsRef);
      
      if (actionsSnap.exists()) {
        setActions(actionsSnap.data().actions);
      }
    } catch (error) {
      console.error('Error loading actions:', error);
      alert('❌ Could not load actions. Please refresh.');
    }
  };

  const toggleAction = async (actionId) => {
    setLoading(true);
    try {
      const updatedActions = actions.map(action =>
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      );
      
      setActions(updatedActions);
      await saveDailyActions(currentUser.uid, updatedActions);
    } catch (error) {
      console.error('Error saving actions:', error);
      alert('❌ Failed to save. Please try again.');
    }
    setLoading(false);
  };

  const completedCount = actions.filter(a => a.completed).length;

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">
        ✅ Today's Micro-Actions ({completedCount}/5)
      </h3>
      
      <div className="space-y-2">
        {actions.map(action => (
          <label
            key={action.id}
            className="flex items-center p-2 hover:bg-green-100 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => toggleAction(action.id)}
              disabled={loading}
              className="mr-3 w-5 h-5"
            />
            <span className="text-xl mr-2">{action.emoji}</span>
            <span className={action.completed ? 'line-through text-gray-500' : ''}>
              {action.text}
            </span>
          </label>
        ))}
      </div>
      
      {loading && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
      
      {completedCount === 5 && (
        <p className="text-green-600 font-semibold mt-3 text-center">
          🎉 Perfect Day! All actions complete!
        </p>
      )}
    </div>
  );
};

export default ActionTracker;