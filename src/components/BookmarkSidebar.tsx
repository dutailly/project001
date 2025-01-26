import React from 'react';
import { Tag, Star, Folder, X } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

export default function BookmarkSidebar({ onClose }: SidebarProps) {
  const { 
    getTagsWithCount, 
    getFoldersWithCount,
    selectedTag, 
    setSelectedTag,
    selectedFolder,
    setSelectedFolder,
    selectedView, 
    setSelectedView, 
    bookmarks 
  } = useBookmarks();
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const favoriteCount = bookmarks.filter(b => b.favorite).length;

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
        <button
          onClick={() => setSelectedView('all')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
            selectedView === 'all'
              ? `${bgColor} ${textColor}`
              : `${textMutedColor} ${hoverBgColor} hover:${textColor}`
          } transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5" />
            <span>All Bookmarks</span>
          </div>
          <span className={`${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-1 rounded-md text-sm`}>
            {bookmarks.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedView('favorites')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
            selectedView === 'favorites'
              ? `${bgColor} ${textColor}`
              : `${textMutedColor} ${hoverBgColor} hover:${textColor}`
          } transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5" />
            <span>Favorites</span>
          </div>
          {favoriteCount > 0 && (
            <span className={`${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-1 rounded-md text-sm`}>
              {favoriteCount}
            </span>
          )}
        </button>
      </nav>

      {/* Folders Section */}
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

      {/* Tags Section */}
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
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm">{name}</span>
              </div>
              <span className={`text-xs ${theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100'} px-2 py-0.5 rounded-md`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}