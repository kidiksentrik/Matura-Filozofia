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

    setNotes((prev) => ({
      ...prev,
      [philosopherId]: {
        ...getPhilosopherData(philosopherId),
        userNotes: [newNote, ...getPhilosopherData(philosopherId).userNotes],
      },
    }));
  };

  const updateUserNote = (philosopherId: string, noteId: string, title: string, body: string) => {
    const data = getPhilosopherData(philosopherId);
    const updatedNotes = data.userNotes.map(n => 
      n.id === noteId ? { ...n, title, body } : n
    );

    setNotes((prev) => ({
      ...prev,
      [philosopherId]: { ...data, userNotes: updatedNotes },
    }));
  };

  const deleteUserNote = (philosopherId: string, noteId: string) => {
    const data = getPhilosopherData(philosopherId);
    const updatedNotes = data.userNotes.filter(n => n.id !== noteId);

    setNotes((prev) => ({
      ...prev,
      [philosopherId]: { ...data, userNotes: updatedNotes },
    }));
  };

  const updateOverride = (
    philosopherId: string, 
    type: 'concepts' | 'quotes' | 'works', 
    newData: any[]
  ) => {
    const data = getPhilosopherData(philosopherId);
    setNotes((prev) => ({
      ...prev,
      [philosopherId]: {
        ...data,
        overrides: {
          ...(data.overrides || {}),
          [type]: newData,
        }
      },
    }));
  };

  return { 
    notes,
    getPhilosopherData, 
    addUserNote, 
    updateUserNote, 
    deleteUserNote, 
    updateOverride 
  };
}
