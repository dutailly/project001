import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Theme-based colors
  const bgColor = theme === 'dark' ? 'bg-[#1a1b1e]' : 'bg-gray-100';
  const cardBgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(name);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password. Please check your current password.');
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 ${textMutedColor} hover:${textColor} mb-6`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

          {error && (
            <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div className={`${cardBgColor} rounded-xl p-6 shadow-lg`}>
              <div className="flex items-center gap-2 text-lg font-medium mb-4">
                <User className="w-5 h-5" />
                <h2>Profile Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg opacity-50 cursor-not-allowed border ${borderColor}`}
                    disabled
                  />
                  <p className={`text-sm ${textMutedColor} mt-1`}>
                    Email cannot be changed
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Profile
                </button>
              </form>
            </div>

            <div className={`${cardBgColor} rounded-xl p-6 shadow-lg`}>
              <div className="flex items-center gap-2 text-lg font-medium mb-4">
                <Lock className="w-5 h-5" />
                <h2>Change Password</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}