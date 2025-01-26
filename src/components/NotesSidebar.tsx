import React from 'react';
import { Tag, Star, Folder, X } from 'lucide-react';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

export default function NotesSidebar({ onClose }: SidebarProps) {
  const { 
    getTagsWithCount, 
    getFoldersWithCount,
    selectedTag, 
    setSelectedTag,
    selectedFolder,
    setSelectedFolder,
    selectedView, 
    setSelectedView, 
    notes 
  } = useNotes();
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const favoriteCount = notes.filter(n => n.favorite).length;

  const handleTagClick = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? null : tagName);
    onClose?.();
  };

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(selectedFolder === folderName ? null : folderName);
    onClose?.();
  };

  const tags = getTagsWithCount();
  const folders = getFoldersWithCount();

  const menuItems = [
    { icon: Tag, label: 'All Notes', count: notes.length, view: 'all' as const },
    { icon: Star, label: 'Favorites', count: favoriteCount, view: 'favorites' as const },
  ];

  return (
    <aside className="h-full p-4">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setSelectedView(item.view)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
              selectedView === item.view
                ? `${bgColor} ${textColor}`
                : `${textMutedColor} ${hoverBgColor} hover:${textColor}`
            } transition-colors`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className={`${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-1 rounded-md text-sm`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className={textMutedColor + " text-sm font-medium"}>Folders</h3>
          </div>
          <div className="space-y-2 px-4">
            {folders.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => handleFolderClick(name)}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors ${
                  selectedFolder === name
                    ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                    : `${textMutedColor} hover:${textColor} ${hoverBgColor}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">{name}</span>
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-0.5 rounded-md`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-2">
            <h3 className={textMutedColor + " text-sm font-medium"}>Tags</h3>
          </div>
          <div className="space-y-2 px-4">
            {tags.map(({ name, count }) => (
              <button
                key={name}
                onClick={() => handleTagClick(name)}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors ${
                  selectedTag === name
                    ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                    : `${textMutedColor} hover:${textColor} ${hoverBgColor}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">{name}</span>
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-0.5 rounded-md`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
