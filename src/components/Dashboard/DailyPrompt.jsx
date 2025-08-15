// src/components/Dashboard/DailyPrompt.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveDailyEntry, getTodayEntries } from '../../firebase/db';
import { useAuth } from '../../contexts/AuthContext';
import MindRewire from './MindRewire';

const DailyPrompt = () => {
  const { currentUser } = useAuth();
  const [morningEntry, setMorningEntry] = useState('');
  const [eveningEntry, setEveningEntry] = useState('');
  const [todayEntries, setTodayEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const morningInputRef = useRef(null);
  const eveningInputRef = useRef(null);
  
  const isEvening = new Date().getHours() >= 17;

  const loadTodayEntries = useCallback(async () => {
    try {
      const entries = await getTodayEntries(currentUser.uid);
      const morning = entries.find(e => e.type === 'morning');
      const evening = entries.find(e => e.type === 'evening');
      
      if (morning) setMorningEntry(morning.text);
      if (evening) setEveningEntry(evening.text);
      setTodayEntries(entries);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    loadTodayEntries();
  }, [loadTodayEntries]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSave = async (type) => {
    setLoading(true);
    setMessage('');
    try {
      const text = type === 'morning' ? morningEntry : eveningEntry;
      await saveDailyEntry(currentUser.uid, {
        type,
        text
      });
      await loadTodayEntries();
      setMessage('✅ Saved successfully!');
    } catch (error) {
      console.error('Error saving entry:', error);
      setMessage('❌ Failed to save. Please try again.');
    }
    setLoading(false);
  };

  const hasMorningEntry = todayEntries.some(e => e.type === 'morning');
  const hasEveningEntry = todayEntries.some(e => e.type === 'evening');

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-center ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      {/* Morning Prompt */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-5 rounded-2xl shadow-xl">
        <h3 className="font-bold text-xl text-white mb-3 flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Morning Power Declaration
        </h3>
        <textarea
          ref={morningInputRef}
          value={morningEntry}
          onChange={(e) => setMorningEntry(e.target.value)}
          placeholder="What will you OWN today? What will make you proud tonight?"
          className="w-full p-3 border-2 border-white/30 bg-white/90 rounded-lg text-gray-800 font-medium"
          rows="3"
          disabled={hasMorningEntry}
        />
        
        {!hasMorningEntry && (
          <MindRewire 
            text={morningEntry} 
            onRewrite={setMorningEntry}
            inputRef={morningInputRef}
          />
        )}
        
        {!hasMorningEntry && (
          <button
            onClick={() => handleSave('morning')}
            disabled={loading || !morningEntry.trim()}
            className="mt-3 bg-white text-orange-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-100 disabled:opacity-50 transition w-full"
          >
            {loading ? 'Locking in...' : 'LOCK IN MY DECLARATION 🔥'}
          </button>
        )}
        
        {hasMorningEntry && (
          <div className="mt-3 p-3 bg-white/20 rounded-lg">
            <p className="text-white font-bold">Today's Declaration:</p>
            <p className="text-white text-lg">"{morningEntry}"</p>
          </div>
        )}
      </div>

      {/* Evening Prompt */}
      {(isEvening || hasMorningEntry) && (
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-5 rounded-2xl shadow-xl">
          <h3 className="font-bold text-xl text-white mb-3 flex items-center">
            <span className="text-2xl mr-2">🌟</span>
            Evening Victory Log
          </h3>
          <textarea
            ref={eveningInputRef}
            value={eveningEntry}
            onChange={(e) => setEveningEntry(e.target.value)}
            placeholder="What's ONE WIN from today? Big or small, it counts!"
            className="w-full p-3 border-2 border-white/30 bg-white/90 rounded-lg text-gray-800 font-medium"
            rows="3"
            disabled={hasEveningEntry}
          />
          
          {!hasEveningEntry && (
            <MindRewire 
              text={eveningEntry} 
              onRewrite={setEveningEntry}
              inputRef={eveningInputRef}
            />
          )}
          
          {!hasEveningEntry && (
            <button
              onClick={() => handleSave('evening')}
              disabled={loading || !eveningEntry.trim()}
              className="mt-3 bg-white text-purple-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-100 disabled:opacity-50 transition w-full"
            >
              {loading ? 'Saving Victory...' : 'SAVE MY VICTORY 👑'}
            </button>
          )}
          
          {hasEveningEntry && (
            <div className="mt-3 p-3 bg-white/20 rounded-lg">
              <p className="text-white font-bold">Today's Victory:</p>
              <p className="text-white text-lg">"{eveningEntry}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyPrompt;