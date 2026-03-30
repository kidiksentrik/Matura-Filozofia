'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface ProgressContextType {
  completedIds: string[];
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useLocalStorage<string[]>('completed_philosophers', []);

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isCompleted = (id: string) => completedIds.includes(id);

  return (
    <ProgressContext.Provider value={{ completedIds, toggleCompleted, isCompleted }}>
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
