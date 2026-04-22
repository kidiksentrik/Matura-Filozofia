'use client';

import { useState } from 'react';
import data from '@/data/philosophers.json';
import { Philosopher, Era } from '@/lib/types';
import PhilosopherCard from '@/components/PhilosopherCard';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useProgress } from '@/lib/useProgress';
import { useNotes } from '@/lib/useNotes';

export default function CodexPage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const { isCompleted } = useProgress();
  const { getPhilosopherData } = useNotes();

  const philosophers = data.philosophers as Philosopher[];
  const eras = data.eras as Era[];

  const handlePhilosopherClick = (p: Philosopher) => {
    const era = eras.find(e => e.id === p.era) || null;
    setSelectedPhilosopher(p);
    setSelectedEra(era);
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[var(--text-primary)]">Kodeks filozofów</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Pełna baza wiedzy o mędrcach</p>
      </header>

      <div className="space-y-12">
        {eras.map((era) => {
          const eraPhilosophers = philosophers.filter(p => p.era === era.id);
          if (eraPhilosophers.length === 0) return null;

          return (
            <section key={era.id}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: era.color }}></span>
                {era.label}
              </h2>
              
              <div className="space-y-3">
                {eraPhilosophers.map((p) => {
                  const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  const phiData = getPhilosopherData(p.id);
                  const concepts = phiData.overrides?.concepts || p.concepts;

                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePhilosopherClick(p)}
                      className="w-full glass rounded-xl p-4 flex flex-col items-stretch gap-4 text-left transition-all-fast active-scale hover:border-white/10 hover:bg-[var(--bg-tertiary)] group animate-in"
                      style={{ animationDelay: `${eraPhilosophers.indexOf(p) * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                          style={{ backgroundColor: `${era.color}22`, color: era.color }}
                        >
                          {initials}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <h3 className="font-bold text-[var(--text-primary)] truncate">{p.name}</h3>
                              {isCompleted(p.id) && (
                                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] shrink-0">{p.dates}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{p.tagline}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {p.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded border border-[var(--border)]">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <ChevronRight size={16} className="text-[var(--text-muted)] self-center" />
                      </div>

                      {concepts.length > 0 && (
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                            <span className="w-0.5 h-3 rounded-full" style={{ backgroundColor: era.color }}></span>
                            Kluczowe pojęcia
                          </h4>
                          <div className="space-y-2">
                            {concepts.map((c, i) => (
                              <div key={i} className="text-[11px] leading-snug">
                                <span className="font-bold text-[var(--text-primary)]">{c.term}</span>
                                <span className="text-[var(--text-secondary)]"> — {c.definition}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <PhilosopherCard
        philosopher={selectedPhilosopher}
        era={selectedEra}
        onClose={() => setSelectedPhilosopher(null)}
      />
    </div>
  );
}
