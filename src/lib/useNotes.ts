'use client';

import { useLocalStorage } from './useLocalStorage';
import { Concept, Quote } from './types';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Local Storage Fallback
  const [localNotes, setLocalNotes] = useLocalStorage<NotesMap>('philosopher_notes_v2', {});

  // Supabase Queries
  const { data: dbNotes = {}, isLoading: isDbLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return {};
      
      const { data: notes, error: notesError } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: overrides, error: ovError } = await supabase
        .from('user_overrides')
        .select('*')
        .eq('user_id', user.id);

      if (notesError || ovError) throw notesError || ovError;

      const map: NotesMap = {};
      notes?.forEach(n => {
        map[n.philosopher_id] = { ...map[n.philosopher_id], userNotes: n.content };
      });
      overrides?.forEach(o => {
        map[o.philosopher_id] = { ...map[o.philosopher_id], overrides: o.content };
      });
      
      return map;
    },
    enabled: !!user,
  });

  // Decide which data source to use
  const notes = user ? dbNotes : localNotes;

  const getPhilosopherData = (id: string): PhilosopherData => {
    return notes[id] || { userNotes: [] };
  };

  // Mutations
  const noteMutation = useMutation({
    mutationFn: async ({ phiId, updatedNotes }: { phiId: string, updatedNotes: UserNote[] }) => {
      if (!user) {
        setLocalNotes(prev => ({ ...prev, [phiId]: { ...getPhilosopherData(phiId), userNotes: updatedNotes } }));
        return;
      }
      
      const { error } = await supabase
        .from('user_notes')
        .upsert({ user_id: user.id, philosopher_id: phiId, content: updatedNotes });
      
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notes', user?.id] }),
  });

  const overrideMutation = useMutation({
    mutationFn: async ({ phiId, type, newData }: { phiId: string, type: string, newData: any[] }) => {
      if (!user) {
        const current = getPhilosopherData(phiId);
        setLocalNotes(prev => ({
          ...prev,
          [phiId]: {
            ...current,
            overrides: { ...(current.overrides || {}), [type]: newData }
          }
        }));
        return;
      }

      const currentData = getPhilosopherData(phiId);
      const newOverrides = { ...(currentData.overrides || {}), [type]: newData };

      const { error } = await supabase
        .from('user_overrides')
        .upsert({ user_id: user.id, philosopher_id: phiId, content: newOverrides });
      
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notes', user?.id] }),
  });

  const addUserNote = (philosopherId: string, title: string, body: string) => {
    const newNote: UserNote = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      body,
      createdAt: Date.now(),
    };
    const updatedNotes = [newNote, ...getPhilosopherData(philosopherId).userNotes];
    noteMutation.mutate({ phiId: philosopherId, updatedNotes });
  };

  const updateUserNote = (philosopherId: string, noteId: string, title: string, body: string) => {
    const updatedNotes = getPhilosopherData(philosopherId).userNotes.map(n => 
      n.id === noteId ? { ...n, title, body } : n
    );
    noteMutation.mutate({ phiId: philosopherId, updatedNotes });
  };

  const deleteUserNote = (philosopherId: string, noteId: string) => {
    const updatedNotes = getPhilosopherData(philosopherId).userNotes.filter(n => n.id !== noteId);
    noteMutation.mutate({ phiId: philosopherId, updatedNotes });
  };

  const updateOverride = (phiId: string, type: 'concepts' | 'quotes' | 'works', newData: any[]) => {
    overrideMutation.mutate({ phiId, type, newData });
  };

  return { 
    notes,
    getPhilosopherData, 
    addUserNote, 
    updateUserNote, 
    deleteUserNote, 
    updateOverride,
    isLoading: user ? isDbLoading : false
  };
}
