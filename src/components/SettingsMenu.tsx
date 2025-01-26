import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function SettingsMenu() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-[#35363c]' : 'hover:bg-gray-100';

  return (
    <button
      onClick={() => navigate('/settings')}
      className={`flex items-center gap-2 ${textMutedColor} hover:${textColor} transition-colors p-2 rounded-lg ${hoverBgColor}`}
    >
      <Settings className="w-5 h-5" />
      <span className="hidden lg:inline">Settings</span>
    </button>
  );
}