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

export type NoteTemplate = 
  | 'quick-note'
  | 'meeting-minutes'
/*  | 'technical-doc'
  | 'blog-post'
  | 'data-analysis'
  | 'project-plan'
  | 'research-note'
  | 'code-snippet'
  | 'checklist'
  | 'brainstorm'*/;

export interface Note {
  id: string;
  title: string;
  content: string;
  template: NoteTemplate;
  tags: string[];
  folder?: string;
  favorite: boolean;
  metadata?: any;
  createdAt: Date;
  userId: string;
}

interface NoteContextType {
  notes: Note[];
  searchQuery: string;
  selectedTag: string | null;
  selectedFolder: string | null;
  selectedView: 'all' | 'favorites';
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedView: (view: 'all' | 'favorites') => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'userId' | 'favorite'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getTagsWithCount: () => Array<{ name: string; count: number }>;
  getFoldersWithCount: () => Array<{ name: string; count: number }>;
  filteredNotes: () => Note[];
}

export const noteTemplates = [
  {
    id: 'quick-note',
    name: 'Quick Note',
    description: 'Simple and fast note-taking, like a digital Post-it',
    icon: 'StickyNote',
  },
  {
    id: 'meeting-minutes',
    name: 'Meeting Minutes',
    description: 'Structured template for meeting notes with attendees, agenda, and action items',
    icon: 'Users',
  },
/*  {
    id: 'technical-doc',
    name: 'Technical Documentation',
    description: 'Detailed template for technical specifications and documentation',
    icon: 'FileCode',
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Template for writing and organizing blog content',
    icon: 'Edit3',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Structure for data analysis reports and findings',
    icon: 'BarChart2',
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Template for project planning and tracking',
    icon: 'Target',
  },
  {
    id: 'research-note',
    name: 'Research Note',
    description: 'Academic-style template for research notes',
    icon: 'BookOpen',
  },
  {
    id: 'code-snippet',
    name: 'Code Snippet',
    description: 'Template for saving and organizing code snippets',
    icon: 'Code',
  },
  {
    id: 'checklist',
    name: 'Checklist',
    description: 'Interactive checklist with items and sub-items',
    icon: 'CheckSquare',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Free-form template for brainstorming sessions',
    icon: 'Cloud',
  },*/
];

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'all' | 'favorites'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notesData.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          template: data.template,
          tags: data.tags,
          folder: data.folder,
          favorite: data.favorite || false,
          metadata: data.metadata,
          createdAt: data.createdAt.toDate(),
          userId: data.userId,
        });
      });
      setNotes(notesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'userId' | 'favorite'>) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'notes'), {
        ...note,
        userId: user.uid,
        createdAt: Timestamp.now(),
        favorite: false,
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (id: string, updatedFields: Partial<Note>) => {
    if (!user) return;

    try {
      const note = notes.find(n => n.id === id);
      if (note && note.userId === user.uid) {
        const noteRef = doc(db, 'notes', id);
        await updateDoc(noteRef, updatedFields);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { favorite: !note.favorite });
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const note = notes.find(n => n.id === id);
      if (note && note.userId === user.uid) {
        await deleteDoc(doc(db, 'notes', id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getTagsWithCount = () => {
    // Filter notes based on current view and folder first
    const filteredByViewAndFolder = notes.filter(note => {
      const matchesView = selectedView === 'all' ? true : note.favorite;
      const matchesFolder = selectedFolder ? note.folder === selectedFolder : true;
      return matchesView && matchesFolder;
    });

    // Then count tags only from the filtered notes
    const tagCounts = new Map<string, number>();
    filteredByViewAndFolder.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getFoldersWithCount = () => {
    const folderCounts = new Map<string, number>();
    notes.forEach(note => {
      if (note.folder) {
        folderCounts.set(note.folder, (folderCounts.get(note.folder) || 0) + 1);
      }
    });
    return Array.from(folderCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const filteredNotes = () => {
    return notes.filter((note) => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      const matchesFolder = selectedFolder ? note.folder === selectedFolder : true;
      const matchesView = selectedView === 'all' ? true : note.favorite;
      return matchesSearch && matchesTag && matchesFolder && matchesView;
    });
  };

  return (
    <NoteContext.Provider value={{
      notes,
      searchQuery,
      selectedTag,
      selectedFolder,
      selectedView,
      setSearchQuery,
      setSelectedTag,
      setSelectedFolder,
      setSelectedView,
      addNote,
      updateNote,
      deleteNote,
      toggleFavorite,
      getTagsWithCount,
      getFoldersWithCount,
      filteredNotes,
    }}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}