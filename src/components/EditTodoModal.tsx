import React, { useState, useEffect } from 'react';
import { X, Plus, Pencil, CheckSquare, MessageSquare, Paperclip, Trash2 } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { useTheme } from '../context/ThemeContext';

import { Todo, ChecklistItem, Comment, Attachment } from '../context/TodoContext';

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export default function EditTodoModal({ isOpen, onClose, todo }: EditTodoModalProps) {
  const { updateTodo, todos } = useTodo();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setPriority(todo.priority);
      setDueDate(todo.dueDate);
      setSelectedLabels(todo.labels);
      setSelectedFolder(todo.folder || null);
      setChecklist(todo.checklist || []);
      setComments(todo.comments || []);
      setAttachments(todo.attachments || []);
    }
  }, [todo]);

  // Get unique existing labels from todos
  const existingLabels = Array.from(new Set(
    todos.flatMap(todo => todo.labels)
  ));

  // Get unique existing folders from todos
  const existingFolders = Array.from(new Set(
    todos.map(todo => todo.folder).filter(Boolean)
  )) as string[];

  const bgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const inputBgColor = theme === 'dark' ? 'bg-[#2c2d32]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const handleAddLabel = () => {
    if (newLabel.trim() && !selectedLabels.includes(newLabel.trim())) {
      setSelectedLabels(prev => [...prev, newLabel.trim()]);
      setNewLabel('');
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

  const handleKeyPress = (e: React.KeyboardEvent, type: 'label' | 'folder') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'label') {
        handleAddLabel();
      } else {
        handleAddFolder();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !title.trim() || !dueDate) return;

    try {
      await updateTodo(todo.id, {
        title: title.trim(),
        priority,
        dueDate,
        labels: selectedLabels,
        folder: selectedFolder || undefined,
        checklist,
        comments,
        attachments,
      });

      onClose();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (!isOpen || !todo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColor} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${textColor}`}>Edit Task</h2>
          <button onClick={onClose} className={`${textMutedColor} hover:${textColor}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
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
              {existingLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setSelectedLabels(prev =>
                      prev.includes(label)
                        ? prev.filter(l => l !== label)
                        : [...prev, label]
                    );
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedLabels.includes(label)
                      ? 'bg-blue-500 text-white'
                      : `${inputBgColor} ${textMutedColor} hover:${textColor}`
                  }`}
                >
                  {label}
                </button>
              ))}
              {selectedLabels.map((label) => (
                !existingLabels.includes(label) && (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedLabels(prev => prev.filter(l => l !== label))}
                    className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white"
                  >
                    {label}
                  </button>
                )
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'label')}
                placeholder="Add custom tag"
                className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              <button
                type="button"
                onClick={handleAddLabel}
                disabled={!newLabel.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

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
            <div className="flex gap-2 mt-4">
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
                  Ajouter une sous-tâche
                </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Comments
            </label>
            <div className="space-y-2 mb-2">
              {comments.map((comment) => (
                <div key={comment.id} className={`${inputBgColor} p-3 rounded-lg`}>
                  <div className="flex justify-between items-start">
                    <p className={`${textColor} text-sm`}>{comment.text}</p>
                    <button
                      type="button"
                      onClick={() => setComments(comments.filter(c => c.id !== comment.id))}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`${textMutedColor} text-xs mt-1`}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    e.preventDefault();
                    setComments([
                      ...comments,
                      {
                        id: crypto.randomUUID(),
                        text: newComment.trim(),
                        createdAt: new Date(),
                        userId: 'current-user',
                      },
                    ]);
                    setNewComment('');
                  }
                }}
                placeholder="Add a comment"
                className={`flex-1 ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => {
                  if (newComment.trim()) {
                    setComments([
                      ...comments,
                      {
                        id: crypto.randomUUID(),
                        text: newComment.trim(),
                        createdAt: new Date(),
                        userId: 'current-user',
                      },
                    ]);
                    setNewComment('');
                  }
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textMutedColor} mb-1`}>
              Attachments
            </label>
            <div className="space-y-2 mb-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className={`flex items-center gap-2 ${inputBgColor} p-3 rounded-lg`}>
                  <Paperclip className="w-4 h-4" />
                  <span className={`flex-1 ${textColor} text-sm`}>{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAttachments([
                    ...attachments,
                    {
                      id: crypto.randomUUID(),
                      name: file.name,
                      url: URL.createObjectURL(file),
                      type: file.type,
                    },
                  ]);
                }
              }}
              className={`w-full ${inputBgColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
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
