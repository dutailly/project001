import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Preferences</h2>
        <p className={`${textMutedColor} mb-6`}>
          Customize your app experience.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className={`text-sm ${textMutedColor}`}>
              Toggle between dark and light themes
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#d1d5db'
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}