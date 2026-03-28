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
import { generateQuestions } from '../src/features/quiz/questionGen';
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
