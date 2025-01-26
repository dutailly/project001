import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileSection() {
  const { user, updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState(user?.displayName || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <p className={`${textMutedColor} mb-6`}>
          Update your profile information and manage your account settings.
        </p>
      </div>

      {success && (
        <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}