import React, { useState, useEffect } from 'react';
import { X, Tag, Folder } from 'lucide-react';
import { useNotes, NoteTemplate } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import QuickNote from './NoteTemplates/QuickNote';
import MeetingNote from './NoteTemplates/MeetingNote';
import TechnicalDoc from './NoteTemplates/TechnicalDoc';
import BlogPost from './NoteTemplates/BlogPost';
import DataAnalysis from './NoteTemplates/DataAnalysis';
import CodeSnippet from './NoteTemplates/CodeSnippet';

interface NoteEditorProps {
  template: NoteTemplate;
  note?: {
    id: string;
    title: string;
    content: string;
    template: NoteTemplate;
    tags: string[];
    folder?: string;
    metadata?: any;
  } | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function NoteEditor({ template, note, onSave, onCancel }: NoteEditorProps) {
  const { addNote, updateNote, notes } = useNotes();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgColor = isDark ? 'hover:bg-[#35363c]' : 'hover:bg-gray-50';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [metadata, setMetadata] = useState<any>({ color: 'yellow' });
  const [isColorChange, setIsColorChange] = useState(false);

  // Get unique existing tags and folders
  const existingTags = Array.from(new Set(notes.flatMap(note => note.tags)));
  const existingFolders = Array.from(new Set(notes.map(note => note.folder).filter(Boolean))) as string[];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedTags(note.tags);
      setSelectedFolder(note.folder);
      setMetadata(note.metadata || {});
    }
  }, [note]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags(prev => [...prev, tag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
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

  const handleCreateFolder = () => {
    if (newFolder.trim()) {
      setSelectedFolder(newFolder.trim());
      setNewFolder('');
      setShowFolderSelect(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // If this was just a color change, don't save
    if (isColorChange) {
      setIsColorChange(false);
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        content,
        template,
        tags: selectedTags,
        folder: selectedFolder,
        metadata,
      };

      if (note) {
        await updateNote(note.id, noteData);
      } else {
        await addNote(noteData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const renderTemplate = () => {
    const props = {
      content,
      onContentChange: setContent,
      metadata,
      onMetadataChange: (newMetadata: any) => {
        setMetadata(newMetadata);
        // If this is a color change, don't trigger save
        if ('color' in newMetadata && metadata.color !== newMetadata.color) {
          setIsColorChange(true);
        }
      },
      editable: true,
    };

    switch (template) {
      case 'quick-note':
        return <QuickNote {...props} />;
      case 'meeting-minutes':
        return <MeetingNote {...props} />;
      case 'technical-doc':
        return <TechnicalDoc {...props} />;
      case 'blog-post':
        return <BlogPost {...props} />;
      case 'data-analysis':
        return <DataAnalysis {...props} />;
      case 'code-snippet':
        return <CodeSnippet {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full mx-auto ${bgColor} rounded-lg border ${borderColor} shadow-sm p-6`}>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full text-2xl font-medium px-0 py-2 mb-6 bg-transparent border-0 border-b
            ${isDark ? 'border-gray-800 text-white' : 'border-gray-200 text-gray-900'}
            focus:ring-0 focus:border-blue-500 transition-colors placeholder-gray-400/50`}
          placeholder="Untitled"
          required
        />

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Folder Selection */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFolderSelect(!showFolderSelect)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                ${selectedFolder ? 'bg-blue-500 bg-opacity-10 text-blue-500' : `${mutedTextColor} ${hoverBgColor}`}
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
                        ${selectedFolder === folder ? 'bg-blue-500 bg-opacity-10 text-blue-500' : `${mutedTextColor} ${hoverBgColor}`}`}
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
                    className={`w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-800
                      border-none focus:ring-1 focus:ring-blue-500 ${textColor}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="flex-1 flex items-center gap-2">
            {/* Tags Display */}
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

        {/* Note Content */}
        <div className="mb-6" >
          {renderTemplate()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium
              ${mutedTextColor} ${hoverBgColor} transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium
              hover:bg-blue-600 transition-colors"
          >
            {note ? 'Save Changes' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
}