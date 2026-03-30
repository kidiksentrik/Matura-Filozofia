'use client';

import { Philosopher, Era } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { X, AlertTriangle, Quote as QuoteIcon, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useProgress } from '@/lib/useProgress';

interface PhilosopherCardProps {
  philosopher: Philosopher | null;
  onClose: () => void;
  era: Era | null;
}

export default function PhilosopherCard({ philosopher, onClose, era }: PhilosopherCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isCompleted, toggleCompleted } = useProgress();
  const contentRef = useRef<HTMLDivElement>(null);

  const hasExpansion = philosopher && 
    philosopher.description_full && 
    philosopher.description_full !== philosopher.description_short;

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
    setTimeout(() => {
      onClose();
      setIsExpanded(false);
    }, 300);
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
        className={`relative w-full max-h-[92vh] card-gradient rounded-t-3xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header/Close Button */}
        <div className="sticky top-0 right-0 p-5 flex justify-between items-start z-20 bg-gradient-to-b from-[var(--bg-secondary)] to-transparent rounded-t-3xl backdrop-blur-sm shadow-sm">
           <div>
             <span 
               className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
               style={{ backgroundColor: `${era.color}33`, color: era.color }}
              >
               {era.label}
             </span>
             <h2 className="text-[28px] leading-none font-serif mt-3 text-gradient tracking-tight">{philosopher.name}</h2>
             <div className="flex items-center gap-3 mt-1">
               <p className="text-[var(--text-secondary)] text-xs">
                 {philosopher.dates} • {philosopher.origin}
               </p>
               <button 
                 onClick={() => toggleCompleted(philosopher.id)}
                 className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                   isCompleted(philosopher.id) 
                   ? 'bg-green-500/20 text-green-400' 
                   : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                 }`}
               >
                 <CheckCircle2 size={12} className={isCompleted(philosopher.id) ? 'fill-green-500/20' : ''} />
                 {isCompleted(philosopher.id) ? 'Przeczytane' : 'Oznacz jako przeczytane'}
               </button>
             </div>
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

          <div className="space-y-6">
            {/* Description Section */}
            <section>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {philosopher.description_short}
              </p>
              
              {hasExpansion && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 w-full flex items-center justify-between p-2 px-3.5 border-[0.5px] border-[var(--border)] rounded-lg text-[13px] text-[var(--text-secondary)] bg-transparent transition-all hover:bg-[var(--bg-tertiary)]"
                >
                  <span>{isExpanded ? 'Zwiń ↑' : 'Czytaj więcej ↓'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}

              <div 
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ 
                  maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
                  opacity: isExpanded ? 1 : 0
                }}
              >
                <div className="py-4 space-y-6 mt-2 border-t-[0.5px] border-[var(--border)]">
                  {philosopher.description_full && (
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {philosopher.description_full}
                    </p>
                  )}

                  {philosopher.context && (
                    <div className="pt-4 border-t-[0.5px] border-[var(--border)]">
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Kontekst historyczny
                      </h4>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                        {philosopher.context}
                      </p>
                    </div>
                  )}

                  {philosopher.legacy && (
                    <div className="pt-4 border-t-[0.5px] border-[var(--border)]">
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Wpływ i dziedzictwo
                      </h4>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                        {philosopher.legacy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Concepts */}
            <section>
              <h3 className="text-xl font-serif mb-5 flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: era.color, boxShadow: `0 0 10px ${era.color}66` }}></span>
                Kluczowe pojęcia
              </h3>
              <div className="space-y-4">
                {philosopher.concepts.map((c, i) => (
                  <div key={i} className="glass p-4 rounded-xl">
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
