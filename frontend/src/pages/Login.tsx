import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
// import Header from './Header';
import { Loading } from './Loading';
// import { FaArrowDown } from 'react-icons/fa';

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
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
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
          width: "100%",

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');
  //   try {
  //     const response = await axios.post(`${API_URL}/auth/login`, {
  //       email,
  //       password,
  //     });
  //     login(response.data.token, response.data.user);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.log(err);
  //     setError('Invalid email or password');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
    <nav className="fixed w-full flex justify-between items-center px-6 py-4 bg-gray-100/80 backdrop-blur-sm z-10">
        <div className="text-xl font-bold tracking-tight text-black">
          <Link to={'/'}>IntervAI</Link>
        </div>

      </nav>
      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  py-12 px-4 sm:px-6 lg:px-8">
        <div className="min-w-5 w-full space-y-8">
          <div>
            <div className='flex max-w-full justify-center items-center gap-3'>
              {/* <img src='p.png' alt="Logo" className='w-10'/> */}
              {/* <h1 className='text-4xl font-bold'>Chat0sm</h1> */}
            </div>
            <h2 className="mt-6 text-center text-4xl md:text-7xl font-extrabold text-gray-900">
              Before you Start In !!!!
            </h2>

           {/* <div className='w-screen flex justify-center'>
           <h2 className='text-center w-full'><FaArrowDown /></h2>
           </div> */}
          </div>
          {/* <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loading size="small" color="white" />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-amber-100 to-rose-100 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>



              <Link
                to="/register"
                className={`text-center text-sm text-indigo-600 hover:text-indigo-500 ${
                  isLoading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                Don't have an account? Register
              </Link>
            </div>
          </form> */}

          {isLoading ? (
                <div className="w-full flex justify-center py-2">
                  <Loading size="medium" color="indigo" message="Processing..." />
                </div>
              ) : (
                <div className='flex justify-center'>

                  <div id="googleSignIn" className='border border-black'></div>
                </div>
              )}

{error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
        </div>

      </div>
    </>
  );
};