import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import { Loading } from './Loading';
import Navbar from './Navbar';

interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleAuthResponse) => void;
}

interface GoogleAuthButtonConfig {
  theme: string;
  size: string;
  width: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleAuthButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleAuthResponse {
  credential: string;
}

export const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '963221736370-adpd9i7hsr3sn2f6qhkkctc8j177bghq.apps.googleusercontent.com',
        callback: handleGoogleCallback
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn")!,
        {
          theme: "outline",
          size: "large",
          width: "240",
        }
      );
    }
  }, []);

  const handleGoogleCallback = async (response: GoogleAuthResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/google`, {
        token: response.credential
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal Navbar */}
      {/* <nav className="fixed w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm z-10">
        <div className="text-xl font-medium text-slate-700">
          <Link to={'/'}>IntervAI</Link>
        </div>
      </nav> */}
      <Navbar />

      {/* Simple Content */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-bl from-pink-50 via-lime-50 to-sky-300">
        <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-center text-2xl font-medium text-slate-700 mb-6">
            Sign In
          </h2>

          {isLoading ? (
            <div className="w-full flex justify-center py-4">
              <Loading size="medium" color="slate" message="Processing..." />
            </div>
          ) : (
            <div className="flex justify-center">
              <div id="googleSignIn"></div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};