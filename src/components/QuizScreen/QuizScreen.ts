import type { QuizState } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import { submitAnswer, advanceQuestion, isComplete, getScore } from '../../features/quiz/quiz';
import { goPrefixInfo } from '../../data/verbGo';
import styles from './QuizScreen.module.css';

const PRONOUNS: Record<string, string> = {
  '1s': 'მე', '2s': 'შენ', '3s': 'ის',
  '1p': 'ჩვენ', '2p': 'თქვენ', '3p': 'ისინი',
};

interface QuizCallbacks {
  onComplete: (state: QuizState) => void;
}

export function createQuizScreen(initialState: QuizState, callbacks: QuizCallbacks): HTMLElement {
  let state = initialState;

  // Key listener for "Next" phase — stored so we can remove it when done
  let keyListener: ((e: KeyboardEvent) => void) | null = null;

  const screen = document.createElement('div');
  screen.className = styles.screen;

  function render(): void {
    // Remove previous key listener if any
    if (keyListener) {
      document.removeEventListener('keydown', keyListener);
      keyListener = null;
    }
    screen.innerHTML = '';

    const question = state.questions[state.currentIndex];
    const score = getScore(state);
    const displayNum = state.currentIndex + 1;
    const total = state.questions.length;
    const answered = state.results.length;

    // Progress row
    const progressRow = document.createElement('div');
    progressRow.className = styles.progressRow;

    const progressLabel = document.createElement('span');
    progressLabel.className = styles.progressLabel;
    progressLabel.textContent = `${t('question')} ${displayNum} ${t('of')} ${total}`;

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

    // Question meta
    const meta = document.createElement('div');
    meta.className = styles.questionMeta;

    const verbName = document.createElement('div');
    verbName.className = styles.verbName;
    verbName.textContent = t(question.verb === 'be' ? 'verbBe' : 'verbGo');

    const tensePersonRow = document.createElement('div');
    tensePersonRow.className = styles.tensePersonRow;
    tensePersonRow.textContent = `${t(question.tense)} · ${t('p' + question.person)}`;

    meta.append(verbName, tensePersonRow);

    if (question.verb === 'go' && question.prefix) {
      const info = goPrefixInfo[question.prefix];
      const tag = document.createElement('div');
      tag.className = styles.directionTag;
      tag.innerHTML =
        `<span class="${styles.prefixScript} georgian">${info.script}</span>` +
        `<span>${t(info.meaningKey)}</span>`;
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
      // Check button
      const checkBtn = document.createElement('button');
      checkBtn.className = styles.checkBtn;
      checkBtn.textContent = t('checkAnswer');

      const doCheck = () => {
        if (!input.value.trim()) return;
        state = submitAnswer(state, input.value);
        render();
      };

      checkBtn.addEventListener('click', doCheck);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doCheck();
      });

      card.appendChild(checkBtn);
      setTimeout(() => input.focus(), 40);

    } else {
      // Feedback phase
      const lastAnswer = state.userAnswers[state.userAnswers.length - 1];
      const wasCorrect = state.results[state.results.length - 1];

      input.value = lastAnswer;
      input.disabled = true;
      input.className =
        styles.input + ' ' + (wasCorrect ? styles.inputCorrect : styles.inputIncorrect);

      const feedback = document.createElement('div');
      feedback.className =
        styles.feedback + ' ' + (wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect);
      feedback.textContent = wasCorrect ? t('correct') : t('incorrect');

      if (!wasCorrect) {
        const line = document.createElement('div');
        line.className = styles.correctAnswerLine;
        line.textContent = t('correctAnswer') + ' ';
        const form = document.createElement('span');
        form.className = styles.correctForm;
        form.textContent = question.answer;
        line.appendChild(form);
        feedback.appendChild(line);
      }

      card.appendChild(feedback);

      const nextBtn = document.createElement('button');
      nextBtn.className = styles.nextBtn;
      nextBtn.textContent = t('next');

      const doNext = () => {
        if (keyListener) {
          document.removeEventListener('keydown', keyListener);
          keyListener = null;
        }
        const nextState = advanceQuestion(state);
        if (isComplete(nextState)) {
          callbacks.onComplete(nextState);
        } else {
          state = nextState;
          render();
        }
      };

      nextBtn.addEventListener('click', doNext);
      keyListener = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'ArrowRight') doNext();
      };
      document.addEventListener('keydown', keyListener);

      card.appendChild(nextBtn);
    }

    screen.append(progressRow, progressTrack, card);
  }

  render();
  return screen;
}
