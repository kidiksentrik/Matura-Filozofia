'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Book, HelpCircle, Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import SyncManager from './SyncManager';

const navItems = [
  { label: 'Oś czasu', icon: Clock, path: '/timeline' },
  { label: 'Kodeks', icon: Book, path: '/codex' },
  { label: 'Quiz', icon: HelpCircle, path: '/quiz' },
  { label: 'Szukaj', icon: Search, path: '/search' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showSync, setShowSync] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-around pb-[var(--safe-area-inset-bottom)] z-50">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all-fast ${
                isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={() => setShowSync(true)}
          className="flex flex-col items-center justify-center space-y-1 text-[var(--text-muted)] hover:text-[var(--accent-teal)] transition-all-fast"
        >
          <RefreshCw size={20} strokeWidth={2} />
          <span className="text-[10px] font-medium">Sync</span>
        </button>
      </nav>

      {showSync && <SyncManager onClose={() => setShowSync(false)} />}
    </>
  );
}
