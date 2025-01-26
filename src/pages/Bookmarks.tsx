import React, { useState } from 'react';
import { Plus, Menu, Globe } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useBookmarks } from '../context/BookmarkContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useAuth } from '../context/AuthContext';
import BookmarkCard from '../components/BookmarkCard';
import BookmarkSidebar from '../components/BookmarkSidebar';
import Navigation from '../components/Navigation';
import SettingsMenu from '../components/SettingsMenu';
import BookmarkEditor from '../components/BookmarkEditor';
import logo from './logo.png';

type ViewState = 'list' | 'create' | 'edit';

export default function Bookmarks() {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<any>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { filteredBookmarks, setSearchQuery } = useBookmarks();
  const { user } = useAuth();
  const styles = useThemeStyles();

  const handleCreateBookmark = () => {
    setViewState('create');
  };

  const handleEditBookmark = (bookmark: any) => {
    setEditingBookmark(bookmark);
    setViewState('edit');
  };

  const handleSave = () => {
    setViewState('list');
    setEditingBookmark(null);
  };

  const handleCancel = () => {
    setViewState('list');
    setEditingBookmark(null);
  };

  const filteredItems = filteredBookmarks();

  return (
    <div className={`min-h-screen ${styles.bgColor} ${styles.textColor}`}>
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
              placeholder="Search bookmarks..."
              value={localSearchQuery}
              onChange={(value) => {
                setLocalSearchQuery(value);
                setSearchQuery(value);
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            {viewState === 'list' && (
              <button
                onClick={handleCreateBookmark}
                className={`${styles.newButton} group flex items-center justify-center mr-4`}
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white font-medium hidden sm:inline ml-1">Add Bookmark</span>
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
          placeholder="Search bookmarks..."
          value={localSearchQuery}
          onChange={(value) => {
            setLocalSearchQuery(value);
            setSearchQuery(value);
          }}
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
          <BookmarkSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <Navigation />
          <div className={`${styles.cardBgColor} rounded-lg p-6 shadow-lg border ${styles.borderColor} ${styles.hoverEffect}`}>
            {viewState === 'list' ? (
              <div className="grid grid-cols-1 gap-3">
                {filteredItems.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={handleEditBookmark}
                  />
                ))}

                {filteredItems.length === 0 && (
                  <div className={`col-span-full ${styles.itemBgColor} rounded-lg p-8 text-center ${styles.textMutedColor}`}>
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">No bookmarks found</h3>
                    <p className="text-sm">
                      Start by adding your first bookmark
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <BookmarkEditor
                bookmark={viewState === 'edit' ? editingBookmark : undefined}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}