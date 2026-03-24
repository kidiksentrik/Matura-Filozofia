'use client';

import { Philosopher, Era } from '@/lib/types';
import { X, AlertTriangle, Quote as QuoteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PhilosopherCardProps {
  philosopher: Philosopher | null;
  onClose: () => void;
  era: Era | null;
}

export default function PhilosopherCard({ philosopher, onClose, era }: PhilosopherCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (philosopher) {
      // Small delay to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    } else {
      setIsVisible(false);
    }
  }, [philosopher]);

  if (!philosopher || !era) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={handleClose}
      />
      
      {/* Content Drawer */}
      <div 
        className={`relative w-full max-h-[92vh] bg-[var(--bg-secondary)] rounded-t-2xl flex flex-col transition-transform duration-300 ease-out z-10 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header/Close Button */}
        <div className="sticky top-0 right-0 p-4 flex justify-between items-start z-20 bg-[var(--bg-secondary)] rounded-t-2xl">
           <div>
             <span 
               className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
               style={{ backgroundColor: `${era.color}33`, color: era.color }}
              >
               {era.label}
             </span>
             <h2 className="text-2xl font-serif mt-2">{philosopher.name}</h2>
             <p className="text-[var(--text-secondary)] text-xs mt-1">
               {philosopher.dates} • {philosopher.origin}
             </p>
           </div>
           <button 
             onClick={handleClose}
             className="p-2 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)] transition-all-fast"
           >
             <X size={20} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 pb-12 flex-1">
          <p className="text-sm italic text-[var(--text-secondary)] mb-6 border-l-2 pl-3" style={{ borderColor: era.color }}>
            {philosopher.tagline}
          </p>

          <div className="space-y-8">
            {/* Description */}
            <section>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {philosopher.description}
              </p>
            </section>

            {/* Concepts */}
            <section>
              <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: era.color }}></span>
                Kluczowe pojęcia
              </h3>
              <div className="space-y-4">
                {philosopher.concepts.map((c, i) => (
                  <div key={i} className="bg-[var(--bg-tertiary)] p-3 rounded-xl border border-[var(--border)]">
                    <span className="font-bold text-[var(--text-primary)] block mb-1">
                      {c.term}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] leading-snug">
                       – {c.definition}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Works */}
            <section>
              <h3 className="text-lg font-serif mb-3">Główne dzieła</h3>
              <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                {philosopher.works.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </section>

            {/* Matura Tip */}
            {philosopher.matura_tip && (
              <section className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                <div className="text-sm text-amber-200">
                  <strong className="block mb-1">Wskazówka maturalna</strong>
                  {philosopher.matura_tip}
                </div>
              </section>
            )}

            {/* Quotes */}
            {philosopher.quotes.length > 0 && (
              <section>
                <h3 className="text-lg font-serif mb-4">Cytaty</h3>
                <div className="space-y-4">
                  {philosopher.quotes.map((q, i) => (
                    <div key={i} className="relative pl-8">
                      <QuoteIcon className="absolute left-0 top-0 text-[var(--text-muted)] rotate-180" size={16} />
                      <p className="text-sm font-medium mb-1">„{q.text}”</p>
                      <p className="text-xs text-[var(--text-muted)] italic">{q.context}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
