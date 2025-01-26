import React from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ParticipantsProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Participants({ value, onChange }: ParticipantsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Users className="w-4 h-4" />
        <span>Participants</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter participants (one per line)"
        className={`w-full ${bgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]`}
      />
    </div>
  );
}