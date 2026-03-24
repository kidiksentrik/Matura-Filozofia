import { Philosopher, Era } from '@/lib/types';

interface TimelineEraProps {
  era: Era;
  philosophers: Philosopher[];
  onPhilosopherClick: (p: Philosopher) => void;
}

export default function TimelineEra({ era, philosophers, onPhilosopherClick }: TimelineEraProps) {
  return (
    <div className="mb-10 px-4">
      <div className="flex items-baseline justify-between mb-4 border-l-4 pl-3" style={{ borderColor: era.color }}>
        <h2 className="text-xl font-serif text-[var(--text-primary)]">{era.label}</h2>
        <span className="text-xs text-[var(--text-secondary)]">{era.range}</span>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
        {philosophers.map((p) => {
          const initials = p.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div key={p.id} className="flex flex-col items-center flex-shrink-0 w-20">
              <button
                onClick={() => onPhilosopherClick(p)}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all-fast border-2"
                style={{
                  backgroundColor: p.importance === 'core' ? era.color : 'transparent',
                  borderColor: era.color,
                  color: p.importance === 'core' ? '#fff' : era.color,
                  boxShadow: p.importance === 'core' ? `0 0 10px ${era.color}44` : 'none'
                }}
              >
                <span className="text-sm font-bold">{initials}</span>
              </button>
              <span className="mt-2 text-[10px] text-center text-[var(--text-secondary)] leading-tight h-8 truncate-2-lines overflow-hidden">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
