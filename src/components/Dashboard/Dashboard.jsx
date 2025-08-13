// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import StreakDisplay from './StreakDisplay';
import ActionTracker from './ActionTracker';
import DailyPrompt from './DailyPrompt';  // ADD THIS IMPORT

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">You Thrive</h1>
            <p className="text-gray-600">Hey, {currentUser?.displayName}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
        
        {/* Streak Display */}
        <div className="mb-6">
          <StreakDisplay />
        </div>
        
        {/* Daily Prompts */}
        <div className="mb-6">
          <DailyPrompt />
        </div>
        
        {/* Action Tracker */}
        <div className="mb-6">
          <ActionTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;