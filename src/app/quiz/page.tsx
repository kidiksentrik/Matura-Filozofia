'use client';

import { useState, useEffect, useMemo } from 'react';
import data from '@/data/philosophers.json';
import { MultipleChoiceQuestion, QuoteMatchingQuestion, QuizStats } from '@/lib/types';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { Check, X, ArrowRight, Play, RefreshCw, Trophy } from 'lucide-react';

type QuizMode = 'multiple_choice' | 'quote_matching';

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('multiple_choice');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [stats, setStats] = useLocalStorage<QuizStats>('quiz_stats', {
    lastScore: 0,
    lastMode: 'multiple_choice',
    totalPlayed: 0,
    totalCorrect: 0,
  });

  const startQuiz = () => {
    const rawQuestions = mode === 'multiple_choice' 
      ? data.quiz.multiple_choice 
      : data.quiz.quote_matching;
    
    // Shuffle and pick 10
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentQuestionIndex].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setGameState('end');
    setStats({
      lastScore: score,
      lastMode: mode,
      totalPlayed: stats.totalPlayed + 1,
      totalCorrect: stats.totalCorrect + score,
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[var(--text-primary)]">Quiz</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Sprawdź swoją wiedzę</p>
      </header>

      {gameState === 'start' && (
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center premium-shadow">
             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)' }}>
                <Trophy className="text-white" size={28} />
             </div>
             <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-widest font-bold">Twoje statystyki</p>
             <div className="flex gap-10 mt-5">
                <div>
                   <p className="text-3xl font-bold">{stats.totalPlayed}</p>
                   <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">Gra</p>
                </div>
                <div>
                   <p className="text-3xl font-bold">{stats.totalPlayed === 0 ? 0 : Math.round((stats.totalCorrect / (stats.totalPlayed * 10)) * 100)}%</p>
                   <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">Skuteczność</p>
                </div>
                <div>
                   <p className="text-3xl font-bold">{stats.lastScore}/10</p>
                   <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">Ostatni</p>
                </div>
             </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
             <button
               onClick={() => setMode('multiple_choice')}
               className={`p-5 rounded-2xl border transition-all-fast text-left ${
                 mode === 'multiple_choice'
                   ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]/10'
                   : 'glass hover:border-white/10'
               }`}
             >
               <p className={`font-bold text-sm ${mode === 'multiple_choice' ? 'text-[var(--accent-teal)]' : 'text-[var(--text-primary)]'}`}>4 odpowiedzi</p>
               <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 leading-snug">Wybierz jedną poprawną odpowiedź</p>
             </button>
             <button
               onClick={() => setMode('quote_matching')}
               className={`p-5 rounded-2xl border transition-all-fast text-left ${
                 mode === 'quote_matching'
                   ? 'border-[var(--accent-purple)] bg-[var(--accent-purple)]/10'
                   : 'glass hover:border-white/10'
               }`}
             >
               <p className={`font-bold text-sm ${mode === 'quote_matching' ? 'text-[var(--accent-purple)]' : 'text-[var(--text-primary)]'}`}>Kto to powiedział?</p>
               <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 leading-snug">Dopasuj cytat do autora</p>
             </button>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-white"
            style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0f766e 100%)', boxShadow: '0 4px 20px rgba(13,148,136,0.4)' }}
          >
            <Play size={18} fill="currentColor" /> Rozpocznij naukę
          </button>
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-2">
             <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Pytanie {currentQuestionIndex + 1} z 10</span>
             <span className="text-lg font-bold" style={{ color: '#0D9488' }}>{score}/{currentQuestionIndex + 1}</span>
          </div>

          {/* Question Box */}
          <div className="glass-dark rounded-2xl p-7 min-h-[160px] flex items-center justify-center text-center premium-shadow">
            <h2 className="text-xl font-serif leading-relaxed">
              {mode === 'multiple_choice' ? currentQuestion.question : `„${currentQuestion.quote}"`}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
             {currentQuestion.options.map((option: string) => {
               const isCorrect = option === currentQuestion.correct;
               const isSelected = option === selectedOption;
               
               let variantClass = 'glass hover:border-white/10';
               if (isAnswered) {
                 if (isCorrect) variantClass = 'border-green-500 bg-green-500/10 text-green-400';
                 else if (isSelected) variantClass = 'border-red-500 bg-red-500/10 text-red-400';
                 else variantClass = 'glass opacity-40';
               }

               return (
                 <button
                   key={option}
                   disabled={isAnswered}
                   onClick={() => handleAnswer(option)}
                   className={`w-full p-4 rounded-xl border text-left transition-all-fast flex items-center justify-between ${variantClass}`}
                 >
                   <span className="font-medium text-sm">{option}</span>
                   {isAnswered && isCorrect && <Check size={18} />}
                   {isAnswered && isSelected && !isCorrect && <X size={18} />}
                 </button>
               );
             })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className={`p-4 rounded-xl text-xs animate-in border ${ 
              selectedOption === currentQuestion.correct 
                ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            }`}>
               <p className="font-bold mb-1">
                 {selectedOption === currentQuestion.correct ? 'Poprawnie! ✓' : 'Błędna odpowiedź'}
               </p>
               <p className="text-[var(--text-secondary)]">{currentQuestion.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0f766e 100%)', boxShadow: '0 4px 20px rgba(13,148,136,0.3)' }}
            >
              {currentQuestionIndex === 9 ? 'Zakończ quiz' : 'Następne pytanie'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {gameState === 'end' && (
        <div className="space-y-8 flex flex-col items-center py-10">
          <div className="relative">
             <div className="w-36 h-36 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0f766e 100%)', boxShadow: '0 10px 40px rgba(13,148,136,0.4)' }}>
                <Trophy className="text-white" size={64} />
             </div>
             <div className="absolute -bottom-2 -right-2 font-bold px-3 py-1 rounded-full text-sm text-white" style={{ background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)' }}>
                {score}/10
             </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-serif">Świetna robota!</h2>
            <p className="text-[var(--text-secondary)] mt-2">Ukończyłeś sesję nauki.</p>
          </div>

          <div className="w-full space-y-3">
             <button
                onClick={startQuiz}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-white"
                style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0f766e 100%)', boxShadow: '0 4px 20px rgba(13,148,136,0.3)' }}
             >
                <RefreshCw size={18} /> Zagraj ponownie
             </button>
             <button
                onClick={() => setGameState('start')}
                className="w-full glass border border-white/5 py-4 rounded-2xl font-bold text-[var(--text-secondary)] transition-all-fast hover:border-white/10"
             >
                Powrót do menu
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
