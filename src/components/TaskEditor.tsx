import React, { useState, useEffect } from 'react';
import { Plus, X, Tag, Folder, Pencil, CheckSquare, Trash2 } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';

interface TaskEditorProps {
  todo?: {
    id: string;
    title: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    labels: string[];
    folder?: string;
    checklist?: { id: string; text: string; completed: boolean; }[];
  };
  onSave: () => void;
  onCancel: () => void;
}

export default function TaskEditor({ todo, onSave, onCancel }: TaskEditorProps) {
  const { addTodo, updateTodo, todos } = useTodo();
  const { theme } = useTheme();
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState('');
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [checklist, setChecklist] = useState<{ id: string; text: string; completed: boolean; }[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Get unique existing labels and folders
  const existingLabels = Array.from(new Set(todos.flatMap(t => t.labels)));
  const existingFolders = Array.from(new Set(todos.map(t => t.folder).filter(Boolean))) as string[];

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = isDark ? 'bg-[#2c2d32]' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgColor = isDark ? 'hover:bg-[#2c2d32]' : 'hover:bg-gray-100';

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority);
      setDueDate(todo.dueDate);
      setSelectedLabels(todo.labels);
      setSelectedFolder(todo.folder || null);
      setChecklist(todo.checklist || []);
    }
  }, [todo]);

  const handleAddLabel = (tag: string) => {
    if (tag.trim() && !selectedLabels.includes(tag.trim())) {
      setSelectedLabels(prev => [...prev, tag.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (tagToRemove: string) => {
    setSelectedLabels(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleCreateFolder = () => {
    if (newFolder.trim()) {
      setSelectedFolder(newFolder.trim());
      setNewFolder('');
      setShowFolderSelect(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
      if (newLabel.trim()) {
        handleAddLabel(capitalizeFirstLetter(newLabel));
      } else if (newFolder.trim()) {
        handleCreateFolder();
      }
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    console.log('Submitting task with checklist:', checklist);

    const taskData = {
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      labels: selectedLabels,
      folder: selectedFolder || undefined,
      checklist: checklist,
      comments: [],
      attachments: [],
    };

    try {
      if (todo) {
        console.log('Updating existing task:', taskData);
        await updateTodo(todo.id, taskData);
      } else {
        console.log('Creating new task:', taskData);
        await addTodo(taskData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
          placeholder="Enter task title"
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
          {selectedLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-700 text-white"
            >
              <Tag className="w-2.5 h-2.5" />
              {label}
              <button
                type="button"
                onClick={() => handleRemoveLabel(label)}
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
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add tags"
              className={`w-full text-sm bg-transparent border-0 ${textColor} focus:ring-0`}
            />
          </div>
        </div>
      </div>

      {/* Priority and Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
            className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${borderColor}`}
            required
          />
        </div>
      </div>

      {/* Checklist Section */}
      <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <label className={`block text-sm font-medium ${textColor}`}>
              Checklist (Sous-tâches)
            </label>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          {checklist.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {
                  const newChecklist = [...checklist];
                  newChecklist[index].completed = !newChecklist[index].completed;
                  setChecklist(newChecklist);
                }}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const newChecklist = [...checklist];
                  newChecklist[index].text = e.target.value;
                  setChecklist(newChecklist);
                }}
                className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setChecklist(checklist.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newChecklistItem.trim()) {
                e.preventDefault();
                setChecklist([
                  ...checklist,
                  {
                    id: crypto.randomUUID(),
                    text: newChecklistItem.trim(),
                    completed: false,
                  },
                ]);
                setNewChecklistItem('');
              }
            }}
            placeholder="Add checklist item"
            className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => {
              if (newChecklistItem.trim()) {
                setChecklist([
                  ...checklist,
                  {
                    id: crypto.randomUUID(),
                    text: newChecklistItem.trim(),
                    completed: false,
                  },
                ]);
                setNewChecklistItem('');
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Action Buttons */}
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
          {todo ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
