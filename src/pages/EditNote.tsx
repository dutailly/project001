import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import MeetingNote from '../components/NoteTemplates/MeetingNote';
import TechnicalDoc from '../components/NoteTemplates/TechnicalDoc';
import BlogPost from '../components/NoteTemplates/BlogPost';
import DataAnalysis from '../components/NoteTemplates/DataAnalysis';
import CodeSnippet from '../components/NoteTemplates/CodeSnippet';

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote } = useNotes();
  const { theme } = useTheme();
  const [note, setNote] = useState<any>(null);
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const bgColor = theme === 'dark' ? 'bg-[#1a1b1e]' : 'bg-gray-100';
  const headerBgColor = theme === 'dark' ? 'bg-[#25262b]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textMutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    const currentNote = notes.find(n => n.id === id);
    if (currentNote) {
      setNote(currentNote);
      setContent(currentNote.content);
      setMetadata(currentNote.metadata || {});
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!note) return;

    setIsSaving(true);
    try {
      await updateNote(note.id, {
        content,
        metadata,
      });
      navigate('/notes');
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!note) return null;

  const renderTemplate = () => {
    const props = {
      content,
      onContentChange: setContent,
      metadata,
      onMetadataChange: setMetadata,
    };

    switch (note.template) {
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
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header */}
      <header className={`${headerBgColor} border-b ${borderColor} sticky top-0 z-50`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notes')}
              className={`${textMutedColor} hover:${textColor} transition-colors`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">{note.title}</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {renderTemplate()}
      </div>
    </div>
  );
}