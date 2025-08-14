import React, { useState, useEffect } from 'react';
import { saveDailyEntry, getTodayEntries } from '../../firebase/db';
import { useAuth } from '../../contexts/AuthContext';

const DailyPrompt = () => {
  const { currentUser } = useAuth();
  const [morningEntry, setMorningEntry] = useState('');
  const [eveningEntry, setEveningEntry] = useState('');
  const [todayEntries, setTodayEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const isEvening = new Date().getHours() >= 17;

  useEffect(() => {
    loadTodayEntries();
  }, []);

  const loadTodayEntries = async () => {
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
  };

  const handleSave = async (type) => {
    setLoading(true);
    try {
      const text = type === 'morning' ? morningEntry : eveningEntry;
      await saveDailyEntry(currentUser.uid, {
        type,
        text
      });
      await loadTodayEntries();
      alert('✅ Saved!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('❌ Failed to save. Please try again.');
    }
    setLoading(false);
  };

  const hasMorningEntry = todayEntries.some(e => e.type === 'morning');
  const hasEveningEntry = todayEntries.some(e => e.type === 'evening');

  return (
    <div className="space-y-4">
      {/* Morning Prompt */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">
          🌅 Morning: One thing I'll own today
        </h3>
        <textarea
          value={morningEntry}
          onChange={(e) => setMorningEntry(e.target.value)}
          placeholder="What will you take responsibility for today?"
          className="w-full p-2 border rounded"
          rows="3"
          disabled={hasMorningEntry}
        />
        {!hasMorningEntry && (
          <button
            onClick={() => handleSave('morning')}
            disabled={loading || !morningEntry.trim()}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Morning Intention'}
          </button>
        )}
      </div>

      {/* Evening Prompt - Show after 5pm or if morning is complete */}
      {(isEvening || hasMorningEntry) && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            🌙 Evening: One win I'm proud of
          </h3>
          <textarea
            value={eveningEntry}
            onChange={(e) => setEveningEntry(e.target.value)}
            placeholder="What's one thing you're proud of from today?"
            className="w-full p-2 border rounded"
            rows="3"
            disabled={hasEveningEntry}
          />
          {!hasEveningEntry && (
            <button
              onClick={() => handleSave('evening')}
              disabled={loading || !eveningEntry.trim()}
              className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Evening Win'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyPrompt;