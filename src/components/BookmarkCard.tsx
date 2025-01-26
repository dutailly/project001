import React, { useState } from 'react';
import { Star, Tag, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

interface BookmarkCardProps {
  bookmark: {
    id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    folder?: string;
    favicon?: string;
    favorite: boolean;
  };
  onEdit: (bookmark: any) => void;
}

export default function BookmarkCard({ bookmark, onEdit }: BookmarkCardProps) {
  const [showActions, setShowActions] = useState(false);
  const { toggleFavorite, deleteBookmark, selectedTag } = useBookmarks();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const professionalCyberpunkStyles = {
    bgColor: isDark ? 'bg-[#1e1e2f]' : 'bg-[#ffffff]',
    textColor: isDark ? 'text-[#fdfdfd]' : 'text-[#2d2e40]',
    mutedTextColor: isDark ? 'text-[#9b9baf]' : 'text-[#6c6f85]',
    borderColor: isDark ? 'border-[#2b2b40]' : 'border-[#e5e8f0]',
    hoverBgColor: isDark ? 'hover:bg-[#2d2d44]' : 'hover:bg-[#f5f7fa]',
    shadow: isDark ? 'shadow-[0_0_5px_1px_rgba(212,212,247,0.4)]' : 'shadow-[0_1px_4px_rgba(0,0,0,0.1)]',
    actionBgColor: isDark ? 'bg-[#35363c]' : 'bg-gray-100',
  };

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      await deleteBookmark(bookmark.id);
    }
    setShowActions(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bookmark);
    setShowActions(false);
  };

  return (
    <div
      className={`
        rounded-md overflow-hidden border ${professionalCyberpunkStyles.bgColor} ${professionalCyberpunkStyles.borderColor} 
        ${professionalCyberpunkStyles.shadow} ${professionalCyberpunkStyles.hoverBgColor} group hover:shadow-[0_0_10px_2px_rgba(212,212,247,0.5)] 
        transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer relative
      `}
      onClick={() => handleCardClick(bookmark.url)}
    >
      {/* Bookmark Header */}
      <div className="flex items-center justify-between p-2 relative border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0 relative z-10">
          <img
            src={bookmark.favicon}
            alt=""
            className="w-4 h-4 rounded-sm shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=128`;
            }}
          />
          <h3 
            className={`font-medium truncate ${professionalCyberpunkStyles.textColor}`} 
            title={bookmark.title}
          >
            {bookmark.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className={`p-1.5 rounded-md ${professionalCyberpunkStyles.mutedTextColor} hover:${professionalCyberpunkStyles.textColor} transition-colors`}
          >
            {showActions ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <MoreVertical className="w-3.5 h-3.5" />
            )}
          </button>

          {showActions && (
            <div
              className={`
                absolute top-full right-0 mt-1 ${professionalCyberpunkStyles.bgColor} rounded-lg 
                border ${professionalCyberpunkStyles.borderColor} py-1 min-w-[120px] z-10
              `}
            >
              <button
                onClick={handleEdit}
                className={`
                  w-full flex items-center gap-2 px-3 py-1.5 text-sm 
                  ${professionalCyberpunkStyles.mutedTextColor} hover:${professionalCyberpunkStyles.textColor} 
                  ${professionalCyberpunkStyles.hoverBgColor} transition-colors
                `}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`
                  w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#ff2851] 
                  hover:bg-[#ff2851] hover:bg-opacity-20 transition-colors
                `}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(bookmark.id);
            }}
            className={`
              shrink-0 p-1 rounded-full hover:bg-[#d4d4f7] hover:bg-opacity-10 
              transition-colors ${bookmark.favorite ? 'text-[#ffd700]' : professionalCyberpunkStyles.mutedTextColor}
            `}
          >
            <Star
              className="w-3.5 h-3.5"
              fill={bookmark.favorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 relative h-[80px]">
        {bookmark.description && (
          <p className={`${professionalCyberpunkStyles.mutedTextColor} text-sm line-clamp-2`}>
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        <div className="absolute bottom-2 right-2">
          <div className="flex flex-wrap gap-1.5 justify-end">
            {bookmark.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                  ${
                    selectedTag === tag
                      ? 'bg-[#d4d4f7] text-[#1e1e2f]'
                      : isDark
                      ? 'bg-[#9b9baf] text-[#1e1e2f]'
                      : 'bg-[#f0f1f7] text-[#2d2e40]'
                  }
                `}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 2 && (
              <span className={`text-xs ${professionalCyberpunkStyles.mutedTextColor}`}>
                +{bookmark.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}