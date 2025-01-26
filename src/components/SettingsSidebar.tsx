import React from 'react';
import { User, Lock, Upload, Settings, Bell, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose?: () => void;
}

export default function SettingsSidebar({ activeSection, onSectionChange, onClose }: SettingsSidebarProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Information' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'import', icon: Upload, label: 'Import Data' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <aside className="h-full p-4">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeSection === item.id
                ? `${bgColor} ${textColor}`
                : `${textMutedColor} ${hoverBgColor} hover:${textColor}`
            } transition-colors`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Sign Out Button */}
        <button
          onClick={() => onSectionChange('signout')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 ${hoverBgColor} transition-colors mt-4`}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}