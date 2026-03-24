'use client';

import { useState, useMemo } from 'react';
import data from '@/data/philosophers.json';
import { Philosopher, Era } from '@/lib/types';
import PhilosopherCard from '@/components/PhilosopherCard';
import { Search as SearchIcon, X, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);

  const philosophers = data.philosophers as Philosopher[];
  const eras = data.eras as Era[];

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    
    const q = query.toLowerCase();
    return philosophers.filter(p => {
      const inName = p.name.toLowerCase().includes(q);
      const inTagline = p.tagline.toLowerCase().includes(q);
      const inTags = p.tags.some(t => t.toLowerCase().includes(q));
      const inConcepts = p.concepts.some(c => 
        c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q)
      );
      return inName || inTagline || inTags || inConcepts;
    });
  }, [query, philosophers]);

  const handlePhilosopherClick = (p: Philosopher) => {
    const era = eras.find(e => e.id === p.era) || null;
    setSelectedPhilosopher(p);
    setSelectedEra(era);
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-serif text-[var(--text-primary)]">Szukaj</h1>
        <div className="relative mt-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wpisz imię filozofa lub pojęcie..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[var(--accent-teal)] transition-all-fast"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="space-y-3">
        {query.trim().length > 0 && query.trim().length < 2 && (
          <div className="text-center py-20 text-[var(--text-muted)] text-sm">
             Wpisz co najmniej 2 znaki...
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)] text-sm">
             Brak wyników dla „{query}”
          </div>
        )}

        {results.map((p) => {
          const era = eras.find(e => e.id === p.era);
          const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          
          return (
            <button
              key={p.id}
              onClick={() => handlePhilosopherClick(p)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex items-start gap-4 text-left transition-all-fast active:scale-[0.98]"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                style={{ backgroundColor: `${era?.color}22`, color: era?.color }}
              >
                {initials}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[var(--text-primary)] truncate">{p.name}</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{p.tagline}</p>
              </div>
              
              <ChevronRight size={16} className="text-[var(--text-muted)] self-center" />
            </button>
          );
        })}

        {query.trim().length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)] text-sm flex flex-col items-center gap-3">
            <SearchIcon size={40} className="opacity-20" />
            Wyszukaj po nazwisku, pojęciu lub tagu
          </div>
        )}
      </div>

      <PhilosopherCard
        philosopher={selectedPhilosopher}
        era={selectedEra}
        onClose={() => setSelectedPhilosopher(null)}
      />
    </div>
  );
}
