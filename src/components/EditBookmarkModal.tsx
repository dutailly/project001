import React, { useState, useEffect } from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';

interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: {
    id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    folder?: string;
    favicon?: string;
  } | null;
}

export default function EditBookmarkModal({ isOpen, onClose, bookmark }: EditBookmarkModalProps) {
  const { updateBookmark, bookmarks } = useBookmarks();
  const { theme } = useTheme();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isEditingFolder, setIsEditingFolder] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setDescription(bookmark.description);
      setSelectedTags(bookmark.tags);
      setSelectedFolder(bookmark.folder || null);
    }
  }, [bookmark]);

  // Get unique existing tags from bookmarks
  const existingTags = Array.from(new Set(
    bookmarks.flatMap(bookmark => bookmark.tags)
  ));

  // Get unique existing folders from bookmarks
  const existingFolders = Array.from(new Set(
    bookmarks.map(bookmark => bookmark.folder).filter(Boolean)
  )) as string[];

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleAddFolder = () => {
    if (newFolder.trim()) {
      setSelectedFolder(newFolder.trim());
      setNewFolder('');
      setIsEditingFolder(false);
    }
  };

  const handleEditFolder = () => {
    if (selectedFolder) {
      setNewFolder(selectedFolder);
      setSelectedFolder(null);
      setIsEditingFolder(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'tag' | 'folder') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') {
        handleAddTag();
      } else {
        handleAddFolder();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmark || !url.trim() || !title.trim()) return;

    try {
      await updateBookmark(bookmark.id, {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        tags: selectedTags,
        folder: selectedFolder,
      });

      onClose();
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (!isOpen || !bookmark) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColor} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${textColor}`}>Edit Bookmark</h2>
          <button onClick={onClose} className={`${textMutedColor} hover:${textColor}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Bookmark title"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Folder
            </label>
            <div className="space-y-2">
              {/* Existing folders */}
              <div className="flex flex-wrap gap-2 mb-2">
                {existingFolders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => {
                      if (!isEditingFolder) {
                        setSelectedFolder(selectedFolder === folder ? null : folder);
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedFolder === folder
                        ? 'bg-blue-500 text-white'
                        : `${inputBgColor} ${textMutedColor} hover:${textColor}`
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>

              {/* Selected or new folder input */}
              <div className="flex gap-2">
                {selectedFolder && !isEditingFolder ? (
                  <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-lg bg-blue-500 bg-opacity-20">
                    <span className="text-blue-500">{selectedFolder}</span>
                    <button
                      type="button"
                      onClick={handleEditFolder}
                      className="p-1 hover:bg-blue-500 hover:bg-opacity-20 rounded-full transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'folder')}
                      placeholder="Add new folder"
                      className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                    />
                    <button
                      type="button"
                      onClick={handleAddFolder}
                      disabled={!newFolder.trim()}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : `${inputBgColor} ${textMutedColor} hover:${textColor}`
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.map((tag) => (
                !existingTags.includes(tag) && (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white"
                  >
                    {tag}
                  </button>
                )
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'tag')}
                placeholder="Add custom tag"
                className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 ${textMutedColor} hover:${textColor} transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}