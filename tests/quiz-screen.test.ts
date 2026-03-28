import { describe, expect, it, vi } from 'vitest';
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

  it('keeps the feedback screen after a correct answer on coarse-pointer devices', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;

    const state: QuizState = {
      settings: {
        questionCount: 10,
        verbs: ['go'],
        tenses: ['present', 'past', 'future'],
      },
      questions: [
        {
          verb: 'go',
          tense: 'present',
          person: '1s',
          prefix: 'mi',
          answer: 'მივდივარ',
        },
        {
          verb: 'go',
          tense: 'past',
          person: '2s',
          prefix: 'mo',
          answer: 'მოხვედი',
        },
      ],
      currentIndex: 0,
      userAnswers: [],
      results: [],
      phase: 'answering',
    };

    const screen = createQuizScreen(state, { onComplete() {} });
    document.body.appendChild(screen.element);

    const input = screen.element.querySelector('input') as HTMLInputElement;
    input.value = 'მივდივარ';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const checkBtn = Array.from(screen.element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Check',
    );
    checkBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(screen.element.textContent).toContain('Correct!');
    expect(screen.element.textContent).toContain('Present');

    window.matchMedia = originalMatchMedia;
  });
});
