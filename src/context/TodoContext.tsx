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

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  labels: string[];
  folder?: string;
  createdAt: Date;
  userId: string;
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
}

interface TodoContextType {
  todos: Todo[];
  searchQuery: string;
  selectedLabel: string | null;
  selectedFolder: string | null;
  selectedView: 'all' | 'important' | 'today' | 'tasks';
  setSearchQuery: (query: string) => void;
  setSelectedLabel: (label: string | null) => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedView: (view: 'all' | 'important' | 'today' | 'tasks') => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<void>;
  filteredTodos: (filter: 'all' | 'active' | 'completed') => Todo[];
  getLabelsWithCount: () => Array<{ name: string; count: number }>;
  getFoldersWithCount: () => Array<{ name: string; count: number }>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'all' | 'important' | 'today' | 'tasks'>('tasks');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Loading todo from Firebase:', data);
        todosData.push({
          id: doc.id,
          title: data.title,
          completed: data.completed,
          priority: data.priority,
          dueDate: data.dueDate,
          labels: data.labels,
          folder: data.folder,
        createdAt: data.createdAt.toDate(),
        userId: data.userId,
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        comments: data.comments?.map((c: any) => ({
          ...c,
          createdAt: c.createdAt.toDate()
        })) || [],
        attachments: data.attachments || [],
        });
      });
      setTodos(todosData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'todos'), {
        ...todo,
        userId: user.uid,
        createdAt: Timestamp.now(),
        checklist: todo.checklist || [],
        comments: todo.comments || [],
        attachments: todo.attachments || [],
      });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;

    try {
      const todoRef = doc(db, 'todos', id);
      const todo = todos.find(t => t.id === id);
      if (todo && todo.userId === user.uid) {
        await updateDoc(todoRef, {
          completed: !todo.completed
        });
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todo = todos.find(t => t.id === id);
      if (todo && todo.userId === user.uid) {
        const folder = todo.folder;
        await deleteDoc(doc(db, 'todos', id));

        // Si c'était la dernière tâche du folder, réinitialiser la vue
        if (folder) {
          const remainingTodosInFolder = todos.filter(t => t.folder === folder && t.id !== id);
          if (remainingTodosInFolder.length === 0) {
            setSelectedFolder(null);
            setSelectedView('tasks');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    if (!user) return;

    try {
      const todo = todos.find(t => t.id === id);
      if (todo && todo.userId === user.uid) {
        const todoRef = doc(db, 'todos', id);
        // Ensure arrays are properly initialized when updating
        const fieldsToUpdate = {
          ...updatedFields,
          checklist: updatedFields.checklist || todo.checklist || [],
          comments: updatedFields.comments || todo.comments || [],
          attachments: updatedFields.attachments || todo.attachments || [],
        };
        await updateDoc(todoRef, fieldsToUpdate);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const filteredTodos = (filter: 'all' | 'active' | 'completed') => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLabel = selectedLabel ? todo.labels.includes(selectedLabel) : true;
      const matchesFolder = selectedFolder ? todo.folder === selectedFolder : true;
      const matchesStatus = filter === 'all' ? true : filter === 'active' ? !todo.completed : todo.completed;
      const today = new Date().toISOString().split('T')[0];

      let matchesView = true;
      switch (selectedView) {
        case 'important':
          matchesView = todo.priority === 'high';
          break;
        case 'today':
          matchesView = todo.dueDate === today;
          break;
        case 'tasks':
          matchesView = !todo.completed;
          break;
        default:
          matchesView = true;
      }

      return matchesSearch && matchesLabel && matchesFolder && matchesStatus && matchesView;
    });
  };

  const getLabelsWithCount = () => {
    // Filtrer d'abord les todos selon la vue actuelle et le dossier sélectionné
    const filteredByViewAndFolder = todos.filter(todo => {
      const today = new Date().toISOString().split('T')[0];
      let matchesView = true;
      switch (selectedView) {
        case 'important':
          matchesView = todo.priority === 'high';
          break;
        case 'today':
          matchesView = todo.dueDate === today;
          break;
        case 'tasks':
          matchesView = !todo.completed;
          break;
        default:
          matchesView = true;
      }
      const matchesFolder = selectedFolder ? todo.folder === selectedFolder : true;
      return matchesView && matchesFolder;
    });

    // Compter les tags uniquement pour les todos filtrés
    const labelCounts = new Map<string, number>();
    filteredByViewAndFolder.forEach(todo => {
      todo.labels.forEach(label => {
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
      });
    });

    return Array.from(labelCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getFoldersWithCount = () => {
    const folderCounts = new Map<string, number>();
    todos.forEach(todo => {
      if (todo.folder) {
        folderCounts.set(todo.folder, (folderCounts.get(todo.folder) || 0) + 1);
      }
    });
    return Array.from(folderCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <TodoContext.Provider value={{
      todos,
      searchQuery,
      selectedLabel,
      selectedFolder,
      selectedView,
      setSearchQuery,
      setSelectedLabel,
      setSelectedFolder,
      setSelectedView,
      addTodo,
      toggleTodo,
      deleteTodo,
      updateTodo,
      filteredTodos,
      getLabelsWithCount,
      getFoldersWithCount,
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
