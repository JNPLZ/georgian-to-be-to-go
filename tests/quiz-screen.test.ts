import { describe, expect, it } from 'vitest';
import { createQuizScreen } from '../src/components/QuizScreen/QuizScreen';
import type { QuizState } from '../src/types/index';

function makeState(prefix: 'mi' | 'tsa'): QuizState {
  return {
    settings: {
      questionCount: 10,
      verbs: ['go'],
      tenses: ['present', 'past', 'future'],
    },
    questions: [
      {
        verb: 'go',
        tense: prefix === 'mi' ? 'present' : 'past',
        person: '1s',
        prefix,
        answer: prefix === 'mi' ? 'მივდივარ' : 'წავედი',
      },
    ],
    currentIndex: 0,
    userAnswers: [],
    results: [],
    phase: 'answering',
  };
}

describe('quiz prefix display', () => {
  it('shows the same general-going label for მი and წა', () => {
    const miScreen = createQuizScreen(makeState('mi'), { onComplete() {} });
    const tsaScreen = createQuizScreen(makeState('tsa'), { onComplete() {} });

    expect(miScreen.element.textContent).toContain('general going');
    expect(tsaScreen.element.textContent).toContain('general going');
    expect(tsaScreen.element.textContent).not.toContain('alternate basic go-prefix');
  });
});
