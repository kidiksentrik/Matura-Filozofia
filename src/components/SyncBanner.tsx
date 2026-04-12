'use client';

import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import { Cloud, ArrowRight, X } from 'lucide-react';

export default function SyncBanner() {
  const { user, signIn } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      setShow(false);
      return;
    }

    // Check if there's any data to migrate
    const notes = localStorage.getItem('philosopher_notes_v2');
    const progress = localStorage.getItem('completed_philosophers');
    const migrated = localStorage.getItem('supabase_migrated');

    const hasData = (notes && notes !== '{}') || (progress && progress !== '[]');
    const notMigrated = migrated !== 'true';

    if (hasData && notMigrated) {
      setShow(true);
    }
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 px-4 py-2.5 shadow-lg animate-in-slide-down">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Cloud size={16} className="text-white fill-white/20" />
          </div>
          <p className="text-[12px] md:text-sm font-medium text-white leading-tight">
            Masz lokalne notatki! <span className="opacity-80">Zsynchronizuj je z chmurą, aby mieć do nich dostęp na każdym urządzeniu.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={signIn}
            className="px-3 py-1.5 bg-white text-indigo-600 text-[11px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all"
          >
            Synchronizuj <ArrowRight size={12} />
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-1.5 text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
