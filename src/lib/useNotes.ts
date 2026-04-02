'use client';

import { useLocalStorage } from './useLocalStorage';

type NotesMap = Record<string, string>;

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<NotesMap>('philosopher_notes', {});

  const getNote = (id: string) => {
    return notes[id] || '';
  };

  const updateNote = (id: string, text: string) => {
    setNotes((prev: NotesMap) => ({
      ...prev,
      [id]: text,
    }));
  };

  return { getNote, updateNote };
}
