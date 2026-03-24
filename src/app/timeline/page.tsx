'use client';

import { useState } from 'react';
import data from '@/data/philosophers.json';
import { Philosopher, Era } from '@/lib/types';
import TimelineEra from '@/components/TimelineEra';
import PhilosopherCard from '@/components/PhilosopherCard';

export default function TimelinePage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);

  const philosophers = data.philosophers as Philosopher[];
  const eras = data.eras as Era[];

  const handlePhilosopherClick = (p: Philosopher) => {
    const era = eras.find(e => e.id === p.era) || null;
    setSelectedPhilosopher(p);
    setSelectedEra(era);
  };

  return (
    <div className="min-h-screen pt-8">
      <header className="px-6 mb-8">
        <h1 className="text-3xl font-serif text-[var(--text-primary)] leading-tight">
          Oś czasu<br />filozofii
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Poznaj wielkie idee chronologicznie
        </p>
      </header>

      <div className="space-y-4">
        {eras.map((era) => (
          <TimelineEra
            key={era.id}
            era={era}
            philosophers={philosophers.filter((p) => p.era === era.id)}
            onPhilosopherClick={handlePhilosopherClick}
          />
        ))}
      </div>

      <PhilosopherCard
        philosopher={selectedPhilosopher}
        era={selectedEra}
        onClose={() => setSelectedPhilosopher(null)}
      />
    </div>
  );
}
