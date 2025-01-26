import React from 'react';
import {
  Edit2,
  Calendar,
  Folder,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NoteTemplate } from '../context/NoteContext';
import QuickNote from './NoteTemplates/QuickNote';
import MeetingNote from './NoteTemplates/MeetingNote';
import TechnicalDoc from './NoteTemplates/TechnicalDoc';
import BlogPost from './NoteTemplates/BlogPost';
import DataAnalysis from './NoteTemplates/DataAnalysis';
import CodeSnippet from './NoteTemplates/CodeSnippet';
import { COLORS } from './NoteTemplates/QuickNote';

interface NoteViewerProps {
  note: {
    id: string;
    title: string;
    content: string;
    template: NoteTemplate;
    tags: string[];
    folder?: string;
    metadata?: any;
    createdAt?: string;
  };
  onEdit: () => void;
  onBack: () => void;
}

export default function NoteViewer({ note, onEdit, onBack }: NoteViewerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colorDef = COLORS.find((c) => c.name === (note.metadata?.color || 'yellow')) || COLORS[0];
  const accentColor = isDark ? colorDef.darkAccent : colorDef.accent;

  const bgColor = isDark ? 'bg-[#2c2d32]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const renderTemplate = () => {
    const props = {
      content: note.content,
      onContentChange: () => {},
      metadata: note.metadata || {},
      onMetadataChange: () => {},
      editable: false,
    };

    switch (note.template) {
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 p-2 ${textMutedColor} hover:${textColor} rounded-lg transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex-1 flex items-start justify-between">
            <h1 className={`text-2xl font-medium ${textColor}`}>
              {note.title}
            </h1>
            <button
              onClick={onEdit}
              className={`p-2 rounded-lg ${textMutedColor} hover:${textColor} transition-colors`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata & Tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {note.createdAt && (
              <div className={`flex items-center gap-2 ${textMutedColor}`}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {note.folder && (
              <div className={`flex items-center gap-2 ${textMutedColor}`}>
                <Folder className="w-4 h-4" />
                <span className="text-sm">{note.folder}</span>
              </div>
            )}
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-700 text-white"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
        {renderTemplate()}
      </div>
    </div>
  );
}