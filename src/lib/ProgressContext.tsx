'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

interface ProgressContextType {
  completedIds: string[];
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Local Storage Fallback
  const [localCompletedIds, setLocalCompletedIds] = useLocalStorage<string[]>('completed_philosophers', []);

  // Supabase Queries
  const { data: dbCompletedIds = [], isLoading: isDbLoading } = useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_progress')
        .select('philosopher_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(item => item.philosopher_id);
    },
    enabled: !!user,
  });

  const progressMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string, completed: boolean }) => {
      if (!user) {
        setLocalCompletedIds(prev => 
          completed ? [...prev, id] : prev.filter(i => i !== id)
        );
        return;
      }

      if (completed) {
        const { error } = await supabase
          .from('user_progress')
          .insert({ user_id: user.id, philosopher_id: id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('philosopher_id', id);
        if (error) throw error;
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.id] }),
  });

  const completedIds = user ? dbCompletedIds : localCompletedIds;

  const toggleCompleted = (id: string) => {
    const isCurrentlyCompleted = completedIds.includes(id);
    progressMutation.mutate({ id, completed: !isCurrentlyCompleted });
  };

  const isCompleted = (id: string) => completedIds.includes(id);

  return (
    <ProgressContext.Provider value={{ 
      completedIds, 
      toggleCompleted, 
      isCompleted, 
      isLoading: user ? isDbLoading : false 
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
