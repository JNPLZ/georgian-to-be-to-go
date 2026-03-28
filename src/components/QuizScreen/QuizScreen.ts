import type { QuizState } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import { submitAnswer, advanceQuestion, isComplete, getScore } from '../../features/quiz/quiz';
import { goPrefixInfo } from '../../data/verbGo';
import { prefixIcons } from '../../utils/prefixIcons';
import styles from './QuizScreen.module.css';

const PRONOUNS: Record<string, string> = {
  '1s': 'მე', '2s': 'შენ', '3s': 'ის',
  '1p': 'ჩვენ', '2p': 'თქვენ', '3p': 'ისინი',
};

interface QuizCallbacks {
  onComplete: (state: QuizState) => void;
  onStateChange?: (state: QuizState) => void;
}

export interface QuizScreenInstance {
  element: HTMLElement;
  destroy: () => void;
  pause: () => void;
  resume: () => void;
}

export function createQuizScreen(initialState: QuizState, callbacks: QuizCallbacks): QuizScreenInstance {
  let state = initialState;
  let keyListener: ((e: KeyboardEvent) => void) | null = null;
  let draftAnswer = '';
  // Timer for auto-advancing after a correct answer
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

  const screen = document.createElement('div');
  screen.className = styles.screen;

  function cleanup(): void {
    if (keyListener) { document.removeEventListener('keydown', keyListener); keyListener = null; }
    if (autoAdvanceTimer !== null) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  }

  function doNext(): void {
    cleanup();
    const nextState = advanceQuestion(state);
    if (isComplete(nextState)) {
      callbacks.onComplete(nextState);
    } else {
      state = nextState;
      draftAnswer = '';
      callbacks.onStateChange?.(state);
      render();
    }
  }

  function render(): void {
    cleanup();
    screen.innerHTML = '';

    const question = state.questions[state.currentIndex];
    const score = getScore(state);
    const total = state.questions.length;
    const answered = state.results.length;

    // Progress
    const progressRow = document.createElement('div');
    progressRow.className = styles.progressRow;

    const progressLabel = document.createElement('span');
    progressLabel.className = styles.progressLabel;
    progressLabel.textContent = `${t('question')} ${state.currentIndex + 1} ${t('of')} ${total}`;

    const statsDiv = document.createElement('div');
    statsDiv.className = styles.stats;
    statsDiv.innerHTML =
      `<span class="${styles.statCorrect}">✓ ${score.correct}</span>` +
      `<span class="${styles.statIncorrect}">✗ ${score.incorrect}</span>`;

    progressRow.append(progressLabel, statsDiv);

    const progressTrack = document.createElement('div');
    progressTrack.className = styles.progressTrack;
    progressTrack.setAttribute('role', 'progressbar');
    progressTrack.setAttribute('aria-valuenow', String(answered));
    progressTrack.setAttribute('aria-valuemax', String(total));
    const progressFill = document.createElement('div');
    progressFill.className = styles.progressFill;
    progressFill.style.width = `${(answered / total) * 100}%`;
    progressTrack.appendChild(progressFill);

    // Card
    const card = document.createElement('div');
    card.className = styles.card;

    // Question meta — show verb + tense only (person is visible via pronoun)
    const meta = document.createElement('div');
    meta.className = styles.questionMeta;

    const verbName = document.createElement('div');
    verbName.className = styles.verbName;
    verbName.textContent = t(question.verb === 'be' ? 'verbBe' : 'verbGo');

    const tenseRow = document.createElement('div');
    tenseRow.className = styles.tensePersonRow;
    tenseRow.textContent = t(question.tense);

    meta.append(verbName, tenseRow);

    // For "go" questions: icon + direction meaning (no Georgian script — accept any form)
    if (question.verb === 'go' && question.prefix) {
      const info = goPrefixInfo[question.prefix];
      const tag = document.createElement('div');
      tag.className = styles.directionTag;

      const iconSpan = document.createElement('span');
      iconSpan.className = styles.directionIcon;
      iconSpan.innerHTML = prefixIcons[question.prefix];

      const textSpan = document.createElement('span');
      textSpan.textContent = t(info.meaningKey);

      tag.append(iconSpan, textSpan);
      meta.appendChild(tag);
    }

    card.appendChild(meta);

    // Input row
    const inputRow = document.createElement('div');
    inputRow.className = styles.inputRow;

    const pronounHint = document.createElement('span');
    pronounHint.className = styles.pronounHint;
    pronounHint.setAttribute('aria-hidden', 'true');
    pronounHint.textContent = PRONOUNS[question.person];

    const input = document.createElement('input');
    input.type = 'text';
    input.className = styles.input;
    input.placeholder = t('typeAnswer');
    input.setAttribute('aria-label', 'Answer in Georgian');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.lang = 'ka';

    inputRow.append(pronounHint, input);
    card.appendChild(inputRow);

    const hint = document.createElement('p');
    hint.className = styles.hint;
    hint.textContent = t('typeHint');
    card.appendChild(hint);

    if (state.phase === 'answering') {
      input.value = draftAnswer;
      const checkBtn = document.createElement('button');
      checkBtn.className = styles.checkBtn;
      checkBtn.textContent = t('checkAnswer');

      const doCheck = () => {
        if (!input.value.trim()) return;
        draftAnswer = input.value;
        state = submitAnswer(state, input.value);
        callbacks.onStateChange?.(state);
        render();
      };

      input.addEventListener('input', () => {
        draftAnswer = input.value;
      });
      checkBtn.addEventListener('click', doCheck);
      // stopPropagation prevents the Enter event from bubbling to any document listener
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.stopPropagation(); doCheck(); }
      });

      card.appendChild(checkBtn);
      setTimeout(() => input.focus(), 40);

    } else {
      // ── Feedback phase ──────────────────────────────────────────────
      const lastAnswer = state.userAnswers[state.userAnswers.length - 1];
      const wasCorrect = state.results[state.results.length - 1];

      input.value = lastAnswer;
      input.disabled = true;
      input.className =
        styles.input + ' ' + (wasCorrect ? styles.inputCorrect : styles.inputIncorrect);

      const feedback = document.createElement('div');
      feedback.className =
        styles.feedback + ' ' + (wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect);
      feedback.setAttribute('role', 'status');
      feedback.textContent = wasCorrect ? t('correct') : t('incorrect');

      if (!wasCorrect) {
        const line = document.createElement('div');
        line.className = styles.correctAnswerLine;
        const label = question.validAnswers ? t('oneCorrectAnswer') : t('correctAnswer');
        line.textContent = label + ' ';
        const form = document.createElement('span');
        form.className = styles.correctForm;
        form.textContent = question.answer;
        line.appendChild(form);
        feedback.appendChild(line);
      }

      card.appendChild(feedback);

      if (wasCorrect) {
        // Auto-advance after 1.2 s — no button, no key listener needed
        autoAdvanceTimer = setTimeout(doNext, 1200);
      } else {
        // Incorrect: require explicit confirmation so the user can read the answer
        const nextBtn = document.createElement('button');
        nextBtn.className = styles.nextBtn;
        nextBtn.textContent = t('next');
        nextBtn.addEventListener('click', doNext);

        // Add key listener with a small delay so the current Enter keydown
        // (if that's how the answer was submitted) doesn't immediately fire it
        setTimeout(() => {
          keyListener = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === 'ArrowRight') doNext();
          };
          document.addEventListener('keydown', keyListener);
        }, 80);

        card.appendChild(nextBtn);
      }
    }

    screen.append(progressRow, progressTrack, card);
  }

  render();
  return {
    element: screen,
    destroy: cleanup,
    pause: cleanup,
    resume: render,
  };
}
