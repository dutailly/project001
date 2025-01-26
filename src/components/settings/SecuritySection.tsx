import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SecuritySection() {
  const { updateUserPassword } = useAuth();
  const { theme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Security Settings</h2>
        <p className={`${textMutedColor} mb-6`}>
          Manage your password and security preferences.
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

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}