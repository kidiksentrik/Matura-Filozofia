'use client';

import { Philosopher, Era } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { X, AlertTriangle, Quote as QuoteIcon, CheckCircle2, ChevronDown, ChevronUp, StickyNote, Save, Plus, Trash2, Edit2, Check, HelpCircle } from 'lucide-react';
import { useProgress } from '@/lib/useProgress';
import { useNotes, UserNote } from '@/lib/useNotes';

interface PhilosopherCardProps {
  philosopher: Philosopher | null;
  onClose: () => void;
  era: Era | null;
}

export default function PhilosopherCard({ philosopher, onClose, era }: PhilosopherCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isCompleted, toggleCompleted } = useProgress();
  const { notes, addUserNote, updateUserNote, deleteUserNote, updateOverride } = useNotes();
  
  const data = philosopher ? (notes[philosopher.id] || { userNotes: [], overrides: {} }) : { userNotes: [], overrides: {} };
  
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');
  
  const [editingSection, setEditingSection] = useState<'concepts' | 'quotes' | 'works' | null>(null);
  const [tempData, setTempData] = useState<any>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const isDirty = isAddingNote || editingNoteId !== null || editingSection !== null;

  const hasExpansion = philosopher && 
    philosopher.description_full && 
    philosopher.description_full !== philosopher.description_short;

  useEffect(() => {
    if (philosopher) {
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
    if (isDirty) {
      setShowConfirmClose(true);
      return;
    }
    closeCard();
  };

  const closeCard = () => {
    setIsVisible(false);
    setShowConfirmClose(false);
    setTimeout(() => {
      onClose();
      setIsExpanded(false);
      resetEditStates();
    }, 300);
  };

  const resetEditStates = () => {
    setIsAddingNote(false);
    setEditingNoteId(null);
    setEditingSection(null);
    setNewNoteTitle('');
    setNewNoteBody('');
  };

  const currentConcepts = data.overrides?.concepts || philosopher.concepts;
  const currentQuotes = data.overrides?.quotes || philosopher.quotes;
  const currentWorks = data.overrides?.works || philosopher.works;

  return (
    <div className={`fixed inset-0 z-50 flex items-end transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      
      <div className={`relative w-full max-h-[92vh] card-gradient rounded-t-3xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="sticky top-0 right-0 p-5 flex justify-between items-start z-20 bg-gradient-to-b from-[var(--bg-secondary)] rounded-t-3xl backdrop-blur-sm shadow-sm">
           <div>
             <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${era.color}33`, color: era.color }}>{era.label}</span>
             <h2 className="text-[28px] leading-none font-serif mt-3 text-gradient tracking-tight">{philosopher.name}</h2>
             <div className="flex items-center gap-3 mt-1">
               <p className="text-[var(--text-secondary)] text-xs">{philosopher.dates} • {philosopher.origin}</p>
               <button onClick={() => toggleCompleted(philosopher.id)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${isCompleted(philosopher.id) ? 'bg-green-500/20 text-green-400' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                 <CheckCircle2 size={12} className={isCompleted(philosopher.id) ? 'fill-green-500/20' : ''} />
                 {isCompleted(philosopher.id) ? 'Przeczytane' : 'Oznacz jako przeczytane'}
               </button>
             </div>
           </div>
           <button onClick={handleClose} className="p-2 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)] transition-all-fast"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto px-4 pb-12 flex-1">
          <p className="text-sm italic text-[var(--text-secondary)] mb-6 border-l-2 pl-3" style={{ borderColor: era.color }}>{philosopher.tagline}</p>

          <div className="space-y-6">
            <section>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">{philosopher.description_short}</p>
              
              {hasExpansion && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 w-full flex items-center justify-between p-2 px-3.5 border-[0.5px] border-[var(--border)] rounded-lg text-[13px] text-[var(--text-secondary)] bg-transparent transition-all hover:bg-[var(--bg-tertiary)]"
                >
                  <span>{isExpanded ? 'Zwiń ↑' : 'Czytaj więcej ↓'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <StickyNote size={12} className="text-indigo-400" />
                    Moje notatki
                  </h4>
                  <button onClick={() => setIsAddingNote(true)} className="p-1 px-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-1"><Plus size={10} /> Dodaj</button>
                </div>

                {isAddingNote && (
                  <div className="glass-indigo p-4 rounded-xl space-y-3 animate-in-slide-down">
                    <input type="text" placeholder="Tytuł notatki..." value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/50" />
                    <textarea placeholder="Treść..." value={newNoteBody} onChange={(e) => setNewNoteBody(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-[var(--text-secondary)] min-h-[80px] focus:outline-none focus:border-indigo-500/50 resize-none" />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsAddingNote(false)} className="text-[10px] text-[var(--text-muted)] px-2 py-1">Anuluj</button>
                      <button onClick={() => { addUserNote(philosopher.id, newNoteTitle, newNoteBody); resetEditStates(); }} className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg">Zapisz</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {data.userNotes.map((note) => (
                    <div key={note.id} className="glass p-3 rounded-xl relative group">
                      {editingNoteId === note.id ? (
                        <div className="space-y-2">
                          <input type="text" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold" />
                          <textarea value={newNoteBody} onChange={(e) => setNewNoteBody(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs min-h-[60px]" />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingNoteId(null)} className="text-[10px] text-[var(--text-muted)]">Anuluj</button>
                            <button onClick={() => { updateUserNote(philosopher.id, note.id, newNoteTitle, newNoteBody); setEditingNoteId(null); }} className="text-indigo-400 text-[10px] font-bold">Zapisz</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h5 className="text-[12px] font-bold text-[var(--text-primary)] pr-16">{note.title || "Bez tytułu"}</h5>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-1 whitespace-pre-wrap">{note.body}</p>
                          <div className="absolute top-2 right-1.5 flex gap-0.5 opacity-40 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingNoteId(note.id); setNewNoteTitle(note.title); setNewNoteBody(note.body); }} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 text-[var(--text-muted)] hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => deleteUserNote(philosopher.id, note.id)} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 text-[var(--text-muted)] hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div ref={contentRef} className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px', opacity: isExpanded ? 1 : 0 }}>
                <div className="py-4 space-y-6 mt-2 border-t-[0.5px] border-[var(--border)]">
                  {philosopher.description_full && <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{philosopher.description_full}</p>}
                  {philosopher.context && (
                    <div className="pt-4 border-t-[0.5px] border-[var(--border)]">
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Kontekst historyczny</h4>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{philosopher.context}</p>
                    </div>
                  )}
                  {philosopher.legacy && (
                    <div className="pt-4 border-t-[0.5px] border-[var(--border)]">
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Wpływ i dziedzictwo</h4>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{philosopher.legacy}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-serif flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: era.color, boxShadow: `0 0 10px ${era.color}66` }}></span>
                  Kluczowe pojęcia
                </h3>
                <button onClick={() => { setEditingSection('concepts'); setTempData([...currentConcepts]); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-[var(--text-muted)] hover:text-indigo-400 transition-all flex items-center justify-center"><Edit2 size={18} /></button>
              </div>

              {editingSection === 'concepts' ? (
                <div className="space-y-4 animate-in-fade">
                  {tempData.map((c: any, i: number) => (
                    <div key={i} className="glass p-4 rounded-xl space-y-2 border-indigo-500/30">
                      <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm font-bold" value={c.term} onChange={(e) => { const next = [...tempData]; next[i].term = e.target.value; setTempData(next); }} />
                      <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs min-h-[60px]" value={c.definition} onChange={(e) => { const next = [...tempData]; next[i].definition = e.target.value; setTempData(next); }} />
                      <button onClick={() => setTempData(tempData.filter((_: any, idx: number) => idx !== i))} className="text-[10px] text-red-400 flex items-center gap-1"><Trash2 size={10} /> Usuń</button>
                    </div>
                  ))}
                  <button onClick={() => setTempData([...tempData, { term: '', definition: '' }])} className="w-full p-2 rounded-xl border border-dashed border-white/20 text-[var(--text-muted)] text-[10px] font-bold hover:bg-white/5">+ Dodaj nowe pojęcie</button>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setEditingSection(null)} className="text-xs text-[var(--text-muted)]">Anuluj</button>
                    <button onClick={() => { updateOverride(philosopher.id, 'concepts', tempData); setEditingSection(null); }} className="bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-2"><Check size={14} /> Zastosuj zmiany</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentConcepts.map((c, i) => (
                    <div key={i} className="glass p-4 rounded-xl">
                      <span className="font-bold text-[var(--text-primary)] block mb-1">{c.term}</span>
                      <span className="text-sm text-[var(--text-secondary)] leading-snug"> – {c.definition}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-serif">Główne dzieła</h3>
                <button onClick={() => { setEditingSection('works'); setTempData([...currentWorks]); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 text-[var(--text-muted)] hover:text-indigo-400 transition-all"><Edit2 size={16} /></button>
              </div>
              {editingSection === 'works' ? (
                <div className="space-y-2 animate-in-fade">
                  {tempData.map((w: string, i: number) => (
                    <div key={i} className="flex gap-2">
                       <input className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-xs" value={w} onChange={(e) => { const next = [...tempData]; next[i] = e.target.value; setTempData(next); }} />
                       <button onClick={() => setTempData(tempData.filter((_: any, idx: number) => idx !== i))} className="text-red-400"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setTempData([...tempData, ''])} className="w-full p-2 text-[10px] text-[var(--text-muted)] border border-dashed border-white/10 rounded-lg">+ Dodaj</button>
                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={() => setEditingSection(null)} className="text-[10px]">Anuluj</button>
                    <button onClick={() => { updateOverride(philosopher.id, 'works', tempData); setEditingSection(null); }} className="text-indigo-400 font-bold text-[10px]">Zapisz</button>
                  </div>
                </div>
              ) : (
                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                  {currentWorks.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </section>

            {philosopher.matura_tip && (
              <section className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex gap-3 text-sm text-amber-200">
                <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                <div>
                  <strong className="block mb-1">Wskazówka maturalna</strong>
                  {philosopher.matura_tip}
                </div>
              </section>
            )}

            {currentQuotes.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif">Cytaty</h3>
                  <button onClick={() => { setEditingSection('quotes'); setTempData([...currentQuotes]); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 text-[var(--text-muted)] hover:text-indigo-400 transition-all"><Edit2 size={16} /></button>
                </div>
                {editingSection === 'quotes' ? (
                  <div className="space-y-4 animate-in-fade">
                    {tempData.map((q: any, i: number) => (
                      <div key={i} className="glass p-3 rounded-xl space-y-2 border-indigo-500/20">
                        <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-medium" value={q.text} onChange={(e) => { const n = [...tempData]; n[i].text = e.target.value; setTempData(n); }} />
                        <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[10px] italic" value={q.context} onChange={(e) => { const n = [...tempData]; n[i].context = e.target.value; setTempData(n); }} />
                        <button onClick={() => setTempData(tempData.filter((_: any, idx: number) => idx !== i))} className="text-red-400 p-1"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => setTempData([...tempData, { text: '', context: '' }])} className="w-full p-2 text-[10px] text-[var(--text-muted)] border border-dashed border-white/10 rounded-lg">+ Dodaj</button>
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button onClick={() => setEditingSection(null)}>Anuluj</button>
                      <button onClick={() => { updateOverride(philosopher.id, 'quotes', tempData); setEditingSection(null); }} className="text-indigo-400 font-bold">Zapisz</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentQuotes.map((q, i) => (
                      <div key={i} className="relative pl-8">
                        <QuoteIcon className="absolute left-0 top-0 text-[var(--text-muted)] rotate-180" size={16} />
                        <p className="text-sm font-medium mb-1">„{q.text}”</p>
                        <p className="text-xs text-[var(--text-muted)] italic">{q.context}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {showConfirmClose && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowConfirmClose(false)} />
          <div className="relative glass p-6 rounded-2xl w-full max-w-xs text-center space-y-4 shadow-2xl border border-white/10 animate-in-scale">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto"><HelpCircle size={28} /></div>
            <div>
              <h3 className="text-lg font-bold">Unsaved changes</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Czy na pewno chcesz zamknąć bez zapisywania zmian?</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmClose(false)} className="flex-1 p-3 rounded-xl bg-[var(--bg-tertiary)] text-xs font-bold">Anuluj</button>
              <button onClick={closeCard} className="flex-1 p-3 rounded-xl bg-red-500/20 text-red-500 text-xs font-bold">Zamknij</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
