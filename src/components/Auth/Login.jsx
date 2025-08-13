// src/components/Auth/Login.jsx
import React, { useEffect, useState } from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Force stop loading after 3 seconds

    // Listen for auth state changes
    unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      if (user) {
        navigate('/dashboard');
      }
    });

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('Redirect successful:', result.user.email);
          navigate('/dashboard');
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.code === 'auth/redirect-cancelled-by-user') {
          console.log('User cancelled sign-in');
        } else if (error.code) {
          console.error('Auth error:', error);
          setError(error.message);
        }
        setLoading(false);
      });

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      console.log('Starting sign in...');
      setSigningIn(true);
      setError(null);
      
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">You Thrive 🌟</h1>
        <p className="text-gray-600 mb-8">
          Take ownership. Build habits. Track wins.
        </p>
        
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {signingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;