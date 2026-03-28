import type { QuizState } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import { getScore } from '../../features/quiz/quiz';
import styles from './ResultScreen.module.css';

interface ResultCallbacks {
  onNewRound: () => void;
}

export function createResultScreen(state: QuizState, callbacks: ResultCallbacks): HTMLElement {
  const score = getScore(state);
  const screen = document.createElement('div');
  screen.className = styles.screen;

  const title = document.createElement('h2');
  title.className = styles.title;
  title.textContent = t('roundComplete');

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = styles.scoreDisplay;
  scoreDisplay.textContent = `${score.correct}/${score.total}`;

  const scoreSub = document.createElement('p');
  scoreSub.className = styles.scoreSub;
  scoreSub.textContent = `${score.total} ${t('questionCount').toLowerCase()}`;

  const statsRow = document.createElement('div');
  statsRow.className = styles.statsRow;

  const correctBlock = document.createElement('div');
  correctBlock.className = styles.statBlock;
  correctBlock.innerHTML =
    `<div class="${styles.statNum} ${styles.statNumCorrect}">${score.correct}</div>` +
    `<div class="${styles.statLabel}">${t('correct')}</div>`;

  const incorrectBlock = document.createElement('div');
  incorrectBlock.className = styles.statBlock;
  incorrectBlock.innerHTML =
    `<div class="${styles.statNum} ${styles.statNumIncorrect}">${score.incorrect}</div>` +
    `<div class="${styles.statLabel}">${t('incorrect')}</div>`;

  statsRow.append(correctBlock, incorrectBlock);

  // Result dots
  const dotsRow = document.createElement('div');
  dotsRow.className = styles.dotsRow;
  dotsRow.setAttribute('aria-label', 'Results per question');

  state.results.forEach((correct, i) => {
    const dot = document.createElement('span');
    dot.className = styles.dot + ' ' + (correct ? styles.dotCorrect : styles.dotIncorrect);
    dot.setAttribute('title', `Q${i + 1}: ${correct ? t('correct') : t('incorrect')}`);
    dot.textContent = correct ? '✓' : '✗';
    dotsRow.appendChild(dot);
  });

  const newRoundBtn = document.createElement('button');
  newRoundBtn.className = styles.newRoundBtn;
  newRoundBtn.textContent = t('newRound');
  newRoundBtn.addEventListener('click', callbacks.onNewRound);

  screen.append(title, scoreDisplay, scoreSub, statsRow, dotsRow, newRoundBtn);
  return screen;
}
