import { Philosopher, Era } from '@/lib/types';
import { useProgress } from '@/lib/useProgress';
import { CheckCircle2 } from 'lucide-react';

interface TimelineEraProps {
  era: Era;
  philosophers: Philosopher[];
  onPhilosopherClick: (p: Philosopher) => void;
}

export default function TimelineEra({ era, philosophers, onPhilosopherClick }: TimelineEraProps) {
  const { isCompleted } = useProgress();
  return (
    <div className="mb-12 px-4 group/era">
      <div className="flex items-baseline justify-between mb-5 border-l-4 pl-4 transition-all duration-500 group-hover/era:pl-6" style={{ borderColor: era.color }}>
        <div>
          <h2 className="text-xl font-serif text-[var(--text-primary)] tracking-tight">{era.label}</h2>
          <div className="h-0.5 w-8 mt-1 rounded-full opacity-50 group-hover/era:w-12 transition-all duration-500" style={{ backgroundColor: era.color }}></div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md border border-[var(--border)]">
          {era.range}
        </span>
      </div>
      
      <div className="flex gap-7 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x">
        {philosophers.map((p) => {
          const initials = p.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const isCore = p.importance === 'core';

          return (
            <div key={p.id} className="flex flex-col items-center flex-shrink-0 w-24 snap-center">
              <div className="relative group/phil">
                <button
                  onClick={() => onPhilosopherClick(p)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-[1.5px] relative overflow-hidden active:scale-95 ${
                    isCore 
                    ? 'shadow-lg shadow-[var(--era-color-alpha)]' 
                    : 'hover:border-[var(--era-color)]'
                  }`}
                  style={{
                    backgroundColor: isCore ? `${era.color}` : 'var(--bg-secondary)',
                    borderColor: isCore ? 'transparent' : 'var(--border)',
                    color: isCore ? '#fff' : 'var(--text-secondary)',
                    '--era-color': era.color,
                    '--era-color-alpha': `${era.color}44`
                  } as React.CSSProperties}
                >
                  {/* Subtle Gradient for Core */}
                  {isCore && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                  )}
                  
                  <span className={`text-base font-bold transition-transform duration-300 group-hover/phil:scale-110 ${isCore ? 'text-white' : 'group-hover/phil:text-[var(--era-color)]'}`}>
                    {initials}
                  </span>
                </button>
                
                {isCompleted(p.id) && (
                  <div className="absolute -top-1.5 -right-1.5 bg-[var(--bg-primary)] rounded-full p-1 border-2 border-[var(--bg-primary)] shadow-sm z-10">
                    <CheckCircle2 size={14} className="text-green-500 fill-green-500/10" />
                  </div>
                )}
              </div>
              <span className={`mt-3 text-[11px] text-center leading-tight h-10 line-clamp-2 px-1 transition-colors duration-300 ${
                isCore ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'
              }`}>
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
