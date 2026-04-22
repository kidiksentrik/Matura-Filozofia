'use client';

import React, { useState } from 'react';
import { Copy, Download, Check, RefreshCw, X } from 'lucide-react';

interface SyncManagerProps {
  onClose: () => void;
}

export default function SyncManager({ onClose }: SyncManagerProps) {
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [status, setStatus] = useState('');

  const exportData = () => {
    try {
      const data = {
        progress: JSON.parse(localStorage.getItem('completed_philosophers') || '[]'),
        notes: JSON.parse(localStorage.getItem('philosopher_notes_v2') || '{}')
      };
      
      const stringified = JSON.stringify(data);
      const encoded = btoa(unescape(encodeURIComponent(stringified)));
      
      navigator.clipboard.writeText(encoded);
      setCopied(true);
      setStatus('Kod został skopiowany do schowka!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setStatus('Błąd podczas generowania kodu.');
    }
  };

  const handleImport = () => {
    try {
      if (!importCode.trim()) return;
      
      const decoded = decodeURIComponent(escape(atob(importCode.trim())));
      const data = JSON.parse(decoded);
      
      if (data.progress || data.notes) {
        if (data.progress) localStorage.setItem('completed_philosophers', JSON.stringify(data.progress));
        if (data.notes) localStorage.setItem('philosopher_notes_v2', JSON.stringify(data.notes));
        
        setStatus('Sukces! Przeładowuję stronę...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      alert('Błędny kod postępu. Spróbuj ponownie.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass w-full max-w-md rounded-2xl p-6 relative border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-teal)]/20 flex items-center justify-center">
            <RefreshCw size={20} className="text-[var(--accent-teal)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Kopia zapasowa</h3>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Synchronizacja między urządzeniami</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Wysyłanie danych</h4>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Wygeneruj kod, aby przenieść swoje notatki i postępy na inne urządzenie. Kod zostanie automatycznie skopiowany.
            </p>
            <button 
              onClick={exportData}
              className="w-full bg-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/90 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Skopiowano!' : 'Kopiuj kod danych'}
            </button>
          </div>

          <div className="h-px bg-white/5" />

          {/* Import Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Odbieranie danych</h4>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Wklej kod wygenerowany na innym urządzeniu, aby przywrócić swoje dane.
            </p>
            <div className="space-y-3">
                <textarea 
                  placeholder="Wklej kod tutaj..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] min-h-[100px] font-mono"
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                />
                <button 
                  onClick={handleImport}
                  disabled={!importCode.trim()}
                  className="w-full bg-white/5 hover:bg-white/10 text-[var(--text-primary)] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Wczytaj dane
                </button>
            </div>
          </div>

          {status && (
            <div className="text-center py-2 text-xs font-bold text-[var(--accent-teal)] animate-pulse">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
