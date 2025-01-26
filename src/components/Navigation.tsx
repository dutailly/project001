import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListTodo, Bookmark, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isActive = (path: string): boolean => location.pathname === path;

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const activeColor = 'border-blue-500 text-blue-500 font-semibold';
  const inactiveColor =
    'border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-500 transition duration-300';

  return (
    <div className="w-full flex flex-col ml-3">
      {/* Navigation Bar */}
      <div className="flex flex-wrap space-x-2 md:space-x-4">
        {[
          { path: '/', label: 'myTasks', Icon: ListTodo },
          { path: '/bookmarks', label: 'myBookmarks', Icon: Bookmark },
          { path: '/notes', label: 'myNotes', Icon: FileText },
        ].map(({ path, label, Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center bg-white px-4 py-2 rounded-t-lg relative group ${
              isActive(path) ? activeColor : inactiveColor
            }`}
          >
            <Icon className="w-6 h-6 mr-2" />
            <span className="text-sm">{label}</span>

            {/* Barre bleue pour l'onglet actif */}
            {isActive(path) && (
              <span
                className="absolute bottom-0 left-0 h-[4px] w-full bg-blue-500 rounded-t-lg transition-transform duration-300"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
