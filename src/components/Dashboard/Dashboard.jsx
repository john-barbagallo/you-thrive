// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import DailyPrompt from './DailyPrompt';
import ActionTracker from './ActionTracker';
import StreakDisplay from './StreakDisplay';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Mobile App Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-black text-xl">Y</span>
              </div>
              <div>
                <h1 className="text-white font-black text-lg sm:text-xl tracking-tight">YOU THRIVE</h1>
                <p className="text-yellow-500 text-xs font-bold">BOLD MENTOR</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-yellow-500 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            WELCOME BACK, <span className="text-yellow-500">{currentUser?.displayName?.toUpperCase() || 'CHAMPION'}</span>
          </h2>
          <p className="text-slate-400 font-semibold">Time to dominate your day.</p>
        </div>

        {/* Grid Layout for Desktop, Stack for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Streak - Full Width on Mobile, 1/3 on Desktop */}
          <div className="lg:col-span-1">
            <StreakDisplay />
          </div>
          
          {/* Stats Cards - Hidden on Mobile, Shown on Desktop */}
          <div className="hidden lg:block">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 h-full">
              <div className="text-yellow-500 text-sm font-bold mb-2">TODAY'S FOCUS</div>
              <div className="text-white text-3xl font-black mb-2">5</div>
              <div className="text-slate-400 text-sm">Power Actions Remaining</div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 h-full">
              <div className="text-yellow-500 text-sm font-bold mb-2">THIS WEEK</div>
              <div className="text-white text-3xl font-black mb-2">87%</div>
              <div className="text-slate-400 text-sm">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Main Action Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Daily Prompts */}
          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-500/10">
              <h3 className="text-yellow-500 font-black text-sm mb-4 tracking-wider">DAILY DECLARATIONS</h3>
              <DailyPrompt />
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-500/10">
              <h3 className="text-yellow-500 font-black text-sm mb-4 tracking-wider">POWER ACTIONS</h3>
              <ActionTracker />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-slate-900/95 backdrop-blur-lg border-t border-yellow-500/20">
          <div className="grid grid-cols-4 h-16">
            <button className="flex flex-col items-center justify-center text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs mt-1">Today</span>
            </button>
            
            <button className="flex flex-col items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Stats</span>
            </button>
            
            <button className="flex flex-col items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs mt-1">Learn</span>
            </button>
            
            <button className="flex flex-col items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>

        {/* Add padding at bottom for mobile nav */}
        <div className="h-20 lg:h-0"></div>
      </div>
    </div>
  );
};

export default Dashboard;