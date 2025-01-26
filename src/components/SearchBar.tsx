import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ placeholder = "Search...", value, onChange }: SearchBarProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const placeholderColor = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      input.focus();
    }
  };

  return (
    <div className="relative w-full">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textMutedColor} w-5 h-5`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full ${bgColor} ${textColor} ${placeholderColor} pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
  );
}