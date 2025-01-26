import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  Timestamp,
  where 
} from 'firebase/firestore';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
  userId: string;
  favicon?: string;
  favorite: boolean;
  folder?: string;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  searchQuery: string;
  selectedTag: string | null;
  selectedFolder: string | null;
  selectedView: 'all' | 'favorites';
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedView: (view: 'all' | 'favorites') => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'userId' | 'favorite'>) => Promise<void>;
  updateBookmark: (id: string, bookmark: Partial<Bookmark>) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getTagsWithCount: () => Array<{ name: string; count: number }>;
  getFoldersWithCount: () => Array<{ name: string; count: number }>;
  filteredBookmarks: () => Bookmark[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'all' | 'favorites'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookmarksData: Bookmark[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        bookmarksData.push({
          id: doc.id,
          title: data.title,
          url: data.url,
          description: data.description,
          tags: data.tags,
          createdAt: data.createdAt.toDate(),
          userId: data.userId,
          favicon: data.favicon,
          favorite: data.favorite || false,
          folder: data.folder,
        });
      });
      setBookmarks(bookmarksData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return () => unsubscribe();
  }, [user]);

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'userId' | 'favorite'>) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'bookmarks'), {
        ...bookmark,
        userId: user.uid,
        createdAt: Timestamp.now(),
        favorite: false,
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const updateBookmark = async (id: string, updatedFields: Partial<Bookmark>) => {
    if (!user) return;

    try {
      const bookmark = bookmarks.find(b => b.id === id);
      if (bookmark && bookmark.userId === user.uid) {
        const bookmarkRef = doc(db, 'bookmarks', id);
        await updateDoc(bookmarkRef, updatedFields);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id);
    if (bookmark) {
      await updateBookmark(id, { favorite: !bookmark.favorite });
    }
  };

  const deleteBookmark = async (id: string) => {
    if (!user) return;

    try {
      const bookmark = bookmarks.find(b => b.id === id);
      if (bookmark && bookmark.userId === user.uid) {
        await deleteDoc(doc(db, 'bookmarks', id));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const filteredBookmarks = () => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch = 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? bookmark.tags.includes(selectedTag) : true;
      const matchesFolder = selectedFolder ? bookmark.folder === selectedFolder : true;
      const matchesView = selectedView === 'all' ? true : bookmark.favorite;
      return matchesSearch && matchesTag && matchesFolder && matchesView;
    });
  };

  const getTagsWithCount = () => {
    // Filtrer d'abord les bookmarks selon la vue actuelle et le dossier sélectionné
    const filteredByViewAndFolder = bookmarks.filter(bookmark => {
      const matchesView = selectedView === 'all' ? true : bookmark.favorite;
      const matchesFolder = selectedFolder ? bookmark.folder === selectedFolder : true;
      return matchesView && matchesFolder;
    });

    // Compter les tags uniquement pour les bookmarks filtrés
    const tagCounts = new Map<string, number>();
    filteredByViewAndFolder.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getFoldersWithCount = () => {
    const folderCounts = new Map<string, number>();
    bookmarks.forEach(bookmark => {
      if (bookmark.folder) {
        folderCounts.set(bookmark.folder, (folderCounts.get(bookmark.folder) || 0) + 1);
      }
    });
    return Array.from(folderCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      searchQuery,
      selectedTag,
      selectedFolder,
      selectedView,
      setSearchQuery,
      setSelectedTag,
      setSelectedFolder,
      setSelectedView,
      addBookmark,
      updateBookmark,
      deleteBookmark,
      toggleFavorite,
      getTagsWithCount,
      getFoldersWithCount,
      filteredBookmarks,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}