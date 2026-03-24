export interface Concept {
  term: string;
  definition: string;
}

export interface Quote {
  text: string;
  context: string;
}

export type Importance = 'core' | 'secondary';

export interface Philosopher {
  id: string;
  name: string;
  dates: string;
  era: EraId;
  origin: string;
  tagline: string;
  importance: Importance;
  tags: string[];
  description: string;
  concepts: Concept[];
  works: string[];
  matura_tip: string;
  quotes: Quote[];
}

export interface Era {
  id: EraId;
  label: string;
  range: string;
  color: string;
}

export type EraId = 'starozytnosc' | 'sredniowiecze' | 'nowozytnosc' | 'nowoczesnosc' | 'wspolczesnosc';

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  correct: string;
  options: string[];
  explanation: string;
}

export interface QuoteMatchingQuestion {
  id: string;
  quote: string;
  correct: string;
  options: string[];
  explanation: string;
}

export interface QuizStats {
  lastScore: number;
  lastMode: 'multiple_choice' | 'quote_matching';
  totalPlayed: number;
  totalCorrect: number;
}
