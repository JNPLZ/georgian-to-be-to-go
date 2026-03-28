import { beforeEach, describe, expect, it } from 'vitest';
import {
  advanceQuestion,
  createQuizState,
  getScore,
  isComplete,
  loadSettings,
  saveSettings,
  submitAnswer,
} from '../src/features/quiz/quiz';
import { canonicalGoPrefixForTense, generateQuestions } from '../src/features/quiz/questionGen';
import { verbGoConjugations } from '../src/data/verbGo';
import type { Question } from '../src/types/index';

function questionKey(question: Question): string {
  return [
    question.verb,
    question.tense,
    question.person,
    question.prefix ?? '-',
  ].join('|');
}

describe('quiz settings persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses the expected defaults on first load', () => {
    expect(loadSettings()).toEqual({
      questionCount: 10,
      verbs: ['be', 'go'],
      tenses: ['present', 'past', 'future'],
    });
  });

  it('only restores question count from storage', () => {
    localStorage.setItem(
      'georgian_quiz_settings',
      JSON.stringify({
        questionCount: 30,
        verbs: ['be'],
        tenses: ['past'],
      }),
    );

    expect(loadSettings()).toEqual({
      questionCount: 30,
      verbs: ['be', 'go'],
      tenses: ['present', 'past', 'future'],
    });
  });

  it('only persists question count when saving', () => {
    saveSettings({
      questionCount: 20,
      verbs: ['be'],
      tenses: ['past'],
    });

    expect(localStorage.getItem('georgian_quiz_settings')).toBe(
      JSON.stringify({ questionCount: 20 }),
    );
  });
});

describe('question generation', () => {
  it('canonicalizes general-going prefixes by tense', () => {
    expect(canonicalGoPrefixForTense('mi', 'present')).toBe('mi');
    expect(canonicalGoPrefixForTense('mi', 'future')).toBe('tsa');
    expect(canonicalGoPrefixForTense('tsa', 'past')).toBe('tsa');
    expect(canonicalGoPrefixForTense('tsa', 'present')).toBe('mi');
  });

  it('never generates the same question twice in a row', () => {
    for (let run = 0; run < 40; run++) {
      const questions = generateQuestions({
        questionCount: 30,
        verbs: ['be', 'go'],
        tenses: ['present', 'past', 'future'],
      });

      for (let i = 1; i < questions.length; i++) {
        expect(questionKey(questions[i])).not.toBe(questionKey(questions[i - 1]));
      }
    }
  });

  it('never keeps მი- as the canonical answer prefix in past or future questions', () => {
    for (let run = 0; run < 40; run++) {
      const questions = generateQuestions({
        questionCount: 30,
        verbs: ['go'],
        tenses: ['present', 'past', 'future'],
      });

      for (const question of questions) {
        if (question.verb !== 'go' || !question.prefix) continue;

        if (question.prefix === 'mi') {
          expect(question.tense).toBe('present');
          expect(question.answer).toBe(verbGoConjugations.mi.present[question.person]);
        }

        if (question.prefix === 'tsa') {
          expect(question.tense).not.toBe('present');
          expect(question.answer).toBe(verbGoConjugations.tsa[question.tense][question.person]);
        }
      }
    }
  });
});

describe('quiz state flow', () => {
  it('tracks answers, score, and completion correctly', () => {
    const [question] = generateQuestions({
      questionCount: 10,
      verbs: ['be'],
      tenses: ['present'],
    });

    let state = createQuizState({
      questionCount: 10,
      verbs: ['be'],
      tenses: ['present'],
    });

    state.questions = [question];

    const answered = submitAnswer(state, question.answer);
    expect(answered.phase).toBe('feedback');
    expect(answered.results).toEqual([true]);
    expect(getScore(answered)).toEqual({ correct: 1, incorrect: 0, total: 1 });

    const advanced = advanceQuestion(answered);
    expect(isComplete(advanced)).toBe(true);
  });
});
