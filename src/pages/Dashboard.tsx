import React, { useState } from 'react';
import { Plus, Menu } from 'lucide-react';
import TodoList from '../components/TodoList';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import Navigation from '../components/Navigation';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import SettingsMenu from '../components/SettingsMenu';
import { useAuth } from '../context/AuthContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useTodo } from '../context/TodoContext';
import TaskEditor from '../components/TaskEditor';
import logo from './logo.png';

type ViewState = 'list' | 'create' | 'edit';

export default function Dashboard() {
  const [viewState, setViewState] = useState<ViewState>('list');
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useTodo();
  const styles = useThemeStyles();

  const handleCreateTask = () => {
    setViewState('create');
  };

  const handleEditTask = (todo: any) => {
    setEditingTodo(todo);
    setViewState('edit');
  };

  const handleSave = () => {
    setViewState('list');
    setEditingTodo(null);
  };

  const handleCancel = () => {
    setViewState('list');
    setEditingTodo(null);
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
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex items-center gap-4">
            {viewState === 'list' && (
              <button
                onClick={handleCreateTask}
                className={`${styles.newButton} group flex items-center justify-center mr-4`}
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white font-medium hidden sm:inline ml-1">Add Task</span>
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
          placeholder="Search tasks..."
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
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <Navigation />
          <div className={`${styles.cardBgColor} rounded-lg p-6 shadow-lg border ${styles.borderColor} ${styles.hoverEffect}`}>
            {viewState === 'list' ? (
              <TodoList onEditTask={handleEditTask} />
            ) : (
              <TaskEditor
                todo={viewState === 'edit' ? editingTodo : undefined}
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