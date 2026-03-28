export type Language = 'en' | 'de' | 'ru';
export type Verb = 'be' | 'go';
export type Tense = 'present' | 'past' | 'future';
export type Person = '1s' | '2s' | '3s' | '1p' | '2p' | '3p';
export type GoPrefix = 'mi' | 'mo' | 'she' | 'ga' | 'a' | 'cha' | 'gada' | 'tsa' | 'da';
export type Screen = 'start' | 'quiz' | 'result' | 'cheatsheet';

export interface ConjugationTable {
  present: Record<Person, string>;
  past: Record<Person, string>;
  future: Record<Person, string>;
}

export interface GoPrefixInfo {
  script: string;
  transliteration: string;
  meaningKey: string;
}

export interface Question {
  verb: Verb;
  tense: Tense;
  person: Person;
  prefix?: GoPrefix;
  answer: string;
}

export interface QuizSettings {
  questionCount: 10 | 20 | 30;
  verbs: Verb[];
}

export interface QuizState {
  settings: QuizSettings;
  questions: Question[];
  currentIndex: number;
  userAnswers: string[];
  results: boolean[];
  phase: 'answering' | 'feedback';
}
