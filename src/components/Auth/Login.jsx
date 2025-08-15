// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl mb-4">
              <span className="text-slate-900 font-black text-4xl">Y</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-2">
              YOU THRIVE
            </h1>
            <p className="text-yellow-500 font-bold text-lg tracking-wider">
              BOLD MENTOR SYSTEM
            </p>
          </div>

          {/* Taglines */}
          <div className="space-y-3 mb-12 text-center">
            <div className="text-slate-300 font-semibold text-lg">
              Stop Playing Small.
            </div>
            <div className="text-slate-300 font-semibold text-lg">
              Start Owning Your Life.
            </div>
            <div className="text-yellow-500 font-black text-xl">
              Your Transformation Starts NOW.
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-black text-lg py-4 rounded-xl shadow-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                INITIATING GREATNESS...
              </span>
            ) : (
              'START YOUR JOURNEY →'
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="text-slate-400">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs font-semibold">Daily Power</div>
            </div>
            <div className="text-slate-400">
              <div className="text-2xl mb-1">🧠</div>
              <div className="text-xs font-semibold">Mind Rewire</div>
            </div>
            <div className="text-slate-400">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-semibold">Bold Action</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-slate-500 text-xs">
        <p>Transform your mindset. Control your destiny.</p>
      </div>
    </div>
  );
};

export default Login;