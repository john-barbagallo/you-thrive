// src/components/Dashboard/MindRewire.jsx
import React, { useState, useEffect, useMemo } from 'react';

const MindRewire = ({ text, onRewrite, inputRef }) => {
  const [showRewrite, setShowRewrite] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [detectedPhrase, setDetectedPhrase] = useState('');

  const victimPatterns = useMemo(() => [
    { find: /i can't/gi, replace: "I choose not to", phrase: "I can't" },
    { find: /i have to/gi, replace: "I get to", phrase: "I have to" },
    { find: /i need to/gi, replace: "I want to", phrase: "I need to" },
    { find: /it's too hard/gi, replace: "it's challenging and I'm growing", phrase: "It's too hard" },
    { find: /i'm bad at/gi, replace: "I'm learning", phrase: "I'm bad at" },
    { find: /i failed/gi, replace: "I learned", phrase: "I failed" },
    { find: /they made me/gi, replace: "I chose to", phrase: "They made me" },
    { find: /i'm stuck/gi, replace: "I'm finding a way", phrase: "I'm stuck" },
    { find: /always happens to me/gi, replace: "is teaching me something", phrase: "always happens to me" },
    { find: /never works out/gi, replace: "hasn't worked out yet", phrase: "never works out" }
  ], []);

  useEffect(() => {
    if (!text) {
      setShowRewrite(false);
      return;
    }

    for (const pattern of victimPatterns) {
      if (pattern.find.test(text)) {
        const newText = text.replace(pattern.find, pattern.replace);
        setSuggestion(newText);
        setDetectedPhrase(pattern.phrase);
        setShowRewrite(true);
        return;
      }
    }
    setShowRewrite(false);
  }, [text, victimPatterns]);

  const applyRewrite = () => {
    onRewrite(suggestion);
    setShowRewrite(false);
    
    // Celebrate the mindset shift
    const celebration = document.createElement('div');
    celebration.innerHTML = '⚡ OWNERSHIP ACTIVATED! ⚡';
    celebration.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-500 animate-ping z-50';
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 1000);
  };

  if (!showRewrite) return null;

  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg animate-pulse">
      <div className="text-white">
        <p className="font-bold text-lg mb-2">🧠 MIND REWIRE DETECTED!</p>
        <p className="text-sm opacity-90 mb-3">
          Victim phrase detected: <span className="font-bold">"{detectedPhrase}"</span>
        </p>
        <div className="bg-white/20 rounded-lg p-3 mb-3">
          <p className="text-sm font-semibold mb-1">POWERFUL VERSION:</p>
          <p className="text-lg font-bold">"{suggestion}"</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyRewrite}
            className="flex-1 bg-white text-orange-600 font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition"
          >
            Use Powerful Version ⚡
          </button>
          <button
            onClick={() => setShowRewrite(false)}
            className="px-4 py-2 text-white/70 hover:text-white"
          >
            Keep Original
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindRewire;