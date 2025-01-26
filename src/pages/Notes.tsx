import React, { useState } from 'react';
import { Plus, Menu, Bell, Book } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useNotes, NoteTemplate } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import NoteCard from '../components/NoteCard';
import NotesSidebar from '../components/NotesSidebar';
import NoteTemplateSelector from '../components/NoteTemplateSelector';
import NoteEditor from '../components/NoteEditor';
import NoteViewer from '../components/NoteViewer';
import Navigation from '../components/Navigation';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import SettingsMenu from '../components/SettingsMenu';
import { useAuth } from '../context/AuthContext';
import logo from './logo.png';

type ViewState = 
  | { type: 'list' }
  | { type: 'template-selector' }
  | { type: 'editor'; template: NoteTemplate; note?: any }
  | { type: 'viewer'; note: any };

export default function Notes() {
  const { notes, filteredNotes, searchQuery, setSearchQuery } = useNotes();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [viewState, setViewState] = useState<ViewState>({ type: 'list' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const styles = useThemeStyles();

  const handleCreateNote = () => {
    setViewState({ type: 'template-selector' });
  };

  const handleSelectTemplate = (templateId: string) => {
    setViewState({ 
      type: 'editor', 
      template: templateId as NoteTemplate 
    });
  };

  const handleViewNote = (note: any) => {
    setViewState({ type: 'viewer', note });
  };

  const handleEditNote = (note: any) => {
    setViewState({ 
      type: 'editor',
      template: note.template,
      note 
    });
  };

  const handleSaveNote = () => {
    setViewState({ type: 'list' });
  };

  const handleCancel = () => {
    setViewState({ type: 'list' });
  };

  const renderContent = () => {
    switch (viewState.type) {
      case 'template-selector':
        return (
          <NoteTemplateSelector 
            onSelectTemplate={handleSelectTemplate} 
            onBack={handleCancel}
          />
        );

      case 'editor':
        return (
          <NoteEditor
            template={viewState.template}
            note={viewState.note}
            onSave={handleSaveNote}
            onCancel={handleCancel}
          />
        );

      case 'viewer':
        return (
          <NoteViewer
            note={viewState.note}
            onEdit={() => handleEditNote(viewState.note)}
            onBack={handleCancel}
          />
        );

      default:
        return (
          <div className="flex flex-col gap-3">
            {filteredNotes().map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onView={() => handleViewNote(note)}
                onEdit={() => handleEditNote(note)}
              />
            ))}

            {filteredNotes().length === 0 && (
              <div className={`${styles.itemBgColor} rounded-lg p-8 text-center ${styles.textMutedColor}`}>
                <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No notes found</h3>
                <p className="text-sm">
                  Start by creating your first note
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${styles.bgColor} ${styles.textColor}`}>
      <EmailVerificationBanner />
      
      {/* Header */}
      <header className={`${styles.cardBgColor} border-b ${styles.borderColor} sticky top-0 z-50 shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden ${styles.textMutedColor} hover:${styles.textColor}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="myPins logo" className="w-6 h-6" />
              <h1 className="text-xl font-bold">myPins</h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <SearchBar
              placeholder="Search notes..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex items-center gap-4">
            {viewState.type === 'list' && (
              <button
                onClick={handleCreateNote}
                className={`${styles.newButton} group flex items-center justify-center mr-4`}
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white font-medium hidden sm:inline ml-1">Add Note</span>
              </button>
            )}
            
            <span className={`hidden md:block ${styles.textColor}`}>
              {user?.displayName}
            </span>
            <SettingsMenu />
          </div>
        </div>
      </header>

      {/* Search bar for mobile */}
      <div className="md:hidden px-4 py-3">
        <SearchBar
          placeholder="Search notes..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${styles.cardBgColor} lg:bg-transparent
          overflow-y-auto 
        `}>
          <NotesSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <Navigation />
          <div className={`${styles.cardBgColor} rounded-lg p-6 shadow-lg border ${styles.borderColor} ${styles.hoverEffect}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}