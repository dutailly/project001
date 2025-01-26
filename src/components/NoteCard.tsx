import React, { useState } from 'react';
import {
  Star,
  Tag,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Hash,
  StickyNote,
  Users,
  FileCode,
  Edit3,
  BarChart2,
  Target,
  BookOpen,
  Code,
  CheckSquare,
  Cloud
} from 'lucide-react';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from './NoteTemplates/QuickNote';

const templateIcons = {
  'quick-note': StickyNote,
  'meeting-minutes': Users,
  'technical-doc': FileCode,
  'blog-post': Edit3,
  'data-analysis': BarChart2,
  'project-plan': Target,
  'research-note': BookOpen,
  'code-snippet': Code,
  'checklist': CheckSquare,
  'brainstorm': Cloud
};

const NoteCard = ({ note, onEdit, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const { toggleFavorite, deleteNote, selectedTag } = useNotes();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const professionalCyberpunkStyles = {
    bgColor: isDark ? 'bg-[#1e1e2f]' : 'bg-[#ffffff]',
    textColor: isDark ? 'text-[#fdfdfd]' : 'text-[#2d2e40]',
    mutedTextColor: isDark ? 'text-[#9b9baf]' : 'text-[#6c6f85]',
    borderColor: isDark ? 'border-[#2b2b40]' : 'border-[#e5e8f0]',
    hoverBgColor: isDark ? 'hover:bg-[#2d2d44]' : 'hover:bg-[#f5f7fa]',
    shadow: isDark ? 'shadow-[0_0_5px_1px_rgba(212,212,247,0.4)]' : 'shadow-[0_1px_4px_rgba(0,0,0,0.1)]',
    quickNoteMuted: note.template === 'quick-note' && !isDark ? 'text-[#6c6f85]' : 'text-[#9b9baf]',
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.id);
    }
    setShowActions(false);
  };

  const colorMatch = COLORS.find(
    (c) => c.name === (note.metadata?.color || 'yellow')
  ) || { darkAccent: '#d4d4f7' };

  const topics = note.template === 'meeting-minutes' ? note.metadata?.topics || [] : [];

  const TemplateIcon = templateIcons[note.template];

  const renderContent = () => {
    if (note.template === 'meeting-minutes' && topics.length > 0) {
      return (
        <div className="space-y-1">
          {topics.slice(0, 2).map((topic) => (
            <div key={topic.id} className="flex items-center gap-1 text-xs">
              <Hash className="w-3 h-3" />
              <span className={professionalCyberpunkStyles.quickNoteMuted}>{topic.name}</span>
            </div>
          ))}
          {topics.length > 2 && (
            <span className={`text-xs ${professionalCyberpunkStyles.mutedTextColor}`}>
              +{topics.length - 2} more topics
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{ __html: note.content }}
        className={`text-sm line-clamp-2 ${professionalCyberpunkStyles.quickNoteMuted}`}
      />
    );
  };

  return (
    <div
      className={`rounded-md overflow-hidden border ${professionalCyberpunkStyles.bgColor} ${professionalCyberpunkStyles.borderColor} ${professionalCyberpunkStyles.shadow} ${professionalCyberpunkStyles.hoverBgColor} group hover:shadow-lg transition-all duration-300 cursor-pointer relative w-full`}
      style={{
        borderLeft: `4px solid ${note.template === 'quick-note' ? colorMatch.darkAccent : isDark ? '#4B5563' : '#e5e8f0'}`
      }}
      onClick={() => onView(note)}
    >
      <div className="flex items-center justify-between p-2 relative border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0 relative z-10">
          {TemplateIcon && (
            <TemplateIcon className={`w-4 h-4 ${professionalCyberpunkStyles.mutedTextColor}`} />
          )}
          <h3 className={`font-medium text-base truncate ${professionalCyberpunkStyles.textColor}`} title={note.title}>
            {note.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="relative">
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
                className={`absolute top-full right-0 mt-1 ${professionalCyberpunkStyles.bgColor} rounded-lg border ${professionalCyberpunkStyles.borderColor} py-1 min-w-[120px] z-10`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                    setShowActions(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm ${professionalCyberpunkStyles.mutedTextColor} hover:${professionalCyberpunkStyles.textColor} ${professionalCyberpunkStyles.hoverBgColor} transition-colors`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#ff2851] hover:bg-[#ff2851] hover:bg-opacity-20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(note.id);
            }}
            className={`shrink-0 p-1 rounded-full hover:bg-[#d4d4f7] hover:bg-opacity-10 transition-colors ${note.favorite ? 'text-[#ffd700]' : professionalCyberpunkStyles.mutedTextColor}`}
          >
            <Star
              className="w-3.5 h-3.5"
              fill={note.favorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      <div className="p-3 relative h-[80px]">
        {renderContent()}

        <div className="absolute bottom-2 right-2">
          <div className="flex flex-wrap gap-1.5 justify-end">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  selectedTag === tag
                    ? 'bg-[#d4d4f7] text-[#1e1e2f]'
                    : isDark
                    ? 'bg-[#9b9baf] text-[#1e1e2f]'
                    : 'bg-[#f0f1f7] text-[#2d2e40]'
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className={`text-xs ${professionalCyberpunkStyles.mutedTextColor}`}>
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;