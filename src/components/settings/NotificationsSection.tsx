import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function NotificationsSection() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <p className={`${textMutedColor} mb-6`}>
          Manage your notification preferences.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" />
          <div>
            <h3 className="font-medium">Task Notifications</h3>
            <p className={`text-sm ${textMutedColor}`}>
              Receive notifications for task reminders and updates
            </p>
          </div>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{
            backgroundColor: notifications ? '#3b82f6' : '#d1d5db'
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}