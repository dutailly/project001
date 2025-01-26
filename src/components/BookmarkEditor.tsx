import React, { useState, useEffect } from 'react';
import { Plus, X, Tag, Folder, Pencil } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

interface BookmarkEditorProps {
  bookmark?: {
    id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    folder?: string;
    favicon?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export default function BookmarkEditor({ bookmark, onSave, onCancel }: BookmarkEditorProps) {
  const { addBookmark, updateBookmark, bookmarks } = useBookmarks();
  const { theme } = useTheme();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState('');
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);

  // Get unique existing tags and folders
  const existingTags = Array.from(new Set(bookmarks.flatMap(b => b.tags)));
  const existingFolders = Array.from(new Set(bookmarks.map(b => b.folder).filter(Boolean))) as string[];

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgColor = isDark ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setDescription(bookmark.description);
      setSelectedTags(bookmark.tags);
      setSelectedFolder(bookmark.folder || null);
    }
  }, [bookmark]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags(prev => [...prev, tag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleCreateFolder = () => {
    if (newFolder.trim()) {
      setSelectedFolder(newFolder.trim());
      setNewFolder('');
      setShowFolderSelect(false);
    }
  };

  const handleEditFolder = () => {
    if (selectedFolder) {
      setNewFolder(selectedFolder);
      setSelectedFolder(null);
      setIsEditingFolder(true);
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
      if (newTag.trim()) {
        handleAddTag(capitalizeFirstLetter(newTag));
      } else if (newFolder.trim()) {
        handleCreateFolder();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    try {
      const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
      const bookmarkData = {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        tags: selectedTags,
        folder: selectedFolder,
        favicon,
      };

      if (bookmark) {
        await updateBookmark(bookmark.id, bookmarkData);
      } else {
        await addBookmark(bookmarkData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
          placeholder="Bookmark title"
          required
        />
      </div>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Folder Selection */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFolderSelect(!showFolderSelect)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              ${selectedFolder ? 'bg-blue-500 bg-opacity-10 text-blue-500' : `${textMutedColor} ${hoverBgColor}`}
              transition-colors`}
          >
            <Folder className="w-4 h-4" />
            <span>{selectedFolder || 'Add to folder'}</span>
          </button>

          {showFolderSelect && (
            <div className={`absolute z-10 mt-1 w-56 rounded-lg shadow-lg ${bgColor} border ${borderColor}`}>
              <div className="p-2">
                {existingFolders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => {
                      setSelectedFolder(folder);
                      setShowFolderSelect(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm
                      ${selectedFolder === folder ? 'bg-blue-500 bg-opacity-10 text-blue-500' : `${textMutedColor} hover:${textColor} ${hoverBgColor}`}`}
                  >
                    {folder}
                  </button>
                ))}
                <input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Create new folder"
                  className={`w-full mt-1 px-3 py-2 rounded-lg text-sm ${inputBgColor} ${textColor}
                    border-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="flex-1 flex items-center gap-2">
          {/* Selected Tags */}
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-700 text-white"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {/* Tags Input */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${hoverBgColor} max-w-[200px]`}>
            <Tag className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add tags"
              className={`w-full text-sm bg-transparent border-0 ${textColor} focus:ring-0`}
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 ${textMutedColor} hover:${textColor} transition-colors`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {bookmark ? 'Save Changes' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  );
}