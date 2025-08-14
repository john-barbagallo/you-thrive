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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">You Thrive 🌟</h1>
        <p className="text-gray-600 mb-8">
          Take ownership. Build habits. Track wins.
        </p>
        
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <p className="mt-6 text-xs text-gray-500">
          Note: Safari users may need to allow popups
        </p>
      </div>
    </div>
  );
};

export default Login;