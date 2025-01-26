import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface NextMeetingProps {
  date: string;
  time: string;
  location: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export default function NextMeeting({
  date,
  time,
  location,
  onDateChange,
  onTimeChange,
  onLocationChange
}: NextMeetingProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Next Meeting</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className={`w-full ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Time</span>
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className={`w-full ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Meeting location"
            className={`w-full ${bgColor} ${textColor} px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>
    </div>
  );
}