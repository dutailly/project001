import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { TodoProvider } from './context/TodoContext';
import { NoteProvider } from './context/NoteContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import Notes from './pages/Notes';
import EditNote from './pages/EditNote';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoProvider>
          <BookmarkProvider>
            <NoteProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <PrivateRoute>
                      <Bookmarks />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <PrivateRoute>
                      <Notes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notes/:id"
                  element={
                    <PrivateRoute>
                      <EditNote />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </NoteProvider>
          </BookmarkProvider>
        </TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;