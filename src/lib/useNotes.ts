'use client';

import { useLocalStorage } from './useLocalStorage';
import { Concept, Quote } from './types';

export interface UserNote {
  id: string;
  title: string;
  body: string;
  createdAt: number;
}

export interface PhilosopherData {
  userNotes: UserNote[];
  overrides?: {
    concepts?: Concept[];
    quotes?: Quote[];
    works?: string[];
  };
}

type NotesMap = Record<string, PhilosopherData>;

export function useNotes() {
  // Local Storage only
  const [notes, setNotes] = useLocalStorage<NotesMap>('philosopher_notes_v2', {});

  const getPhilosopherData = (id: string): PhilosopherData => {
    return notes[id] || { userNotes: [] };
  };

  const addUserNote = (philosopherId: string, title: string, body: string) => {
    const newNote: UserNote = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      body,
      createdAt: Date.now(),
    };
    
    const currentData = getPhilosopherData(philosopherId);
    const updatedNotes = [newNote, ...currentData.userNotes];
    
    setNotes(prev => ({
      ...prev,
      [philosopherId]: { ...currentData, userNotes: updatedNotes }
    }));
  };

  const updateUserNote = (philosopherId: string, noteId: string, title: string, body: string) => {
    const currentData = getPhilosopherData(philosopherId);
    const updatedNotes = currentData.userNotes.map(n => 
      n.id === noteId ? { ...n, title, body } : n
    );
    
    setNotes(prev => ({
      ...prev,
      [philosopherId]: { ...currentData, userNotes: updatedNotes }
    }));
  };

  const deleteUserNote = (philosopherId: string, noteId: string) => {
    const currentData = getPhilosopherData(philosopherId);
    const updatedNotes = currentData.userNotes.filter(n => n.id !== noteId);
    
    setNotes(prev => ({
      ...prev,
      [philosopherId]: { ...currentData, userNotes: updatedNotes }
    }));
  };

  const updateOverride = (phiId: string, type: 'concepts' | 'quotes' | 'works', newData: any[]) => {
    const currentData = getPhilosopherData(phiId);
    setNotes(prev => ({
      ...prev,
      [phiId]: {
        ...currentData,
        overrides: { ...(currentData.overrides || {}), [type]: newData }
      }
    }));
  };

  return { 
    notes,
    getPhilosopherData, 
    addUserNote, 
    updateUserNote, 
    deleteUserNote, 
    updateOverride,
    isLoading: false
  };
}
