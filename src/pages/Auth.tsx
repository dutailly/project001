import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import logo from './logo.png';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setSuccess('Account created! Please check your email for verification.');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      setError('Failed to authenticate. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={logo} alt="myPins logo" className="w-8 h-8" />
              <h1 className="text-3xl font-bold text-gray-900">myPins</h1>
            </div>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Create an account to start organizing your digital life'
                : 'Welcome back! Sign in to continue'}
            </p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all ${
                  !isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all ${
                  isSignUp
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>

            {/* Google Auth Button */}
            <div className="mb-6">
              <GoogleAuthButton />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="h-full w-full backdrop-blur-sm bg-gradient-to-br from-blue-600/30 to-indigo-600/30 flex items-center justify-center p-12">
          <div className="max-w-xl text-white text-center">
            <h2 className="text-4xl font-bold mb-6">
              Pin it, Keep it, Find it
            </h2>
            <p className="text-lg opacity-90">
              Your all-in-one platform for tasks, bookmarks, and notes. Organize your digital life with ease and efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}