import type { QuizSettings, QuizState } from '../../types/index';
import { generateQuestions } from './questionGen';

const SETTINGS_KEY = 'georgian_quiz_settings';

const DEFAULT_SETTINGS: QuizSettings = {
  questionCount: 10,
  verbs: ['be', 'go'],
  tenses: ['present', 'past', 'future'],
};

export function loadSettings(): QuizSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<QuizSettings>;
      // Only restore questionCount — verbs and tenses always default to all-selected on fresh load
      return {
        ...DEFAULT_SETTINGS,
        questionCount: parsed.questionCount ?? DEFAULT_SETTINGS.questionCount,
      };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: QuizSettings): void {
  // Only persist questionCount; verbs/tenses reset to defaults on every reload
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ questionCount: settings.questionCount }));
}

export function createQuizState(settings: QuizSettings): QuizState {
  return {
    settings,
    questions: generateQuestions(settings),
    currentIndex: 0,
    userAnswers: [],
    results: [],
    phase: 'answering',
  };
}

export function submitAnswer(state: QuizState, answer: string): QuizState {
  const trimmed = answer.trim();
  const question = state.questions[state.currentIndex];
  const correct = question.validAnswers
    ? question.validAnswers.includes(trimmed)
    : trimmed === question.answer;
  return {
    ...state,
    userAnswers: [...state.userAnswers, trimmed],
    results: [...state.results, correct],
    phase: 'feedback',
  };
}

export function advanceQuestion(state: QuizState): QuizState {
  return { ...state, currentIndex: state.currentIndex + 1, phase: 'answering' };
}

export function isComplete(state: QuizState): boolean {
  return state.currentIndex >= state.questions.length;
}

export function getScore(state: QuizState) {
  const correct = state.results.filter(Boolean).length;
  return { correct, incorrect: state.results.length - correct, total: state.questions.length };
}
