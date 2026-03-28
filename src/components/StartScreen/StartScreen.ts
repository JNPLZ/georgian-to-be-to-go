import type { QuizSettings, Verb, Tense } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import styles from './StartScreen.module.css';

interface StartCallbacks {
  onStart: (settings: QuizSettings) => void;
}

const COUNTS: Array<10 | 20 | 30> = [10, 20, 30];

export function createStartScreen(
  initialSettings: QuizSettings,
  callbacks: StartCallbacks,
): HTMLElement {
  let selectedCount = initialSettings.questionCount;
  let selectedVerbs = new Set<Verb>(initialSettings.verbs);
  let selectedTenses = new Set<Tense>(initialSettings.tenses);
  let errorVisible = false;

  const screen = document.createElement('div');
  screen.className = styles.screen;

  // Header
  const header = document.createElement('header');
  header.className = styles.header;
  const title = document.createElement('h1');
  title.className = styles.title;
  title.textContent = t('startTitle');
  const subtitle = document.createElement('p');
  subtitle.className = styles.subtitle;
  subtitle.textContent = t('startSubtitle');
  header.append(title, subtitle);

  // Verb section
  const verbSection = document.createElement('section');
  verbSection.className = styles.section;
  const verbLabel = document.createElement('span');
  verbLabel.className = styles.sectionLabel;
  verbLabel.textContent = t('selectVerbs');
  const checkboxList = document.createElement('div');
  checkboxList.className = styles.checkboxList;

  const VERBS: Array<{ key: Verb; labelKey: string }> = [
    { key: 'be', labelKey: 'verbBe' },
    { key: 'go', labelKey: 'verbGo' },
  ];

  for (const { key, labelKey } of VERBS) {
    const label = document.createElement('label');
    label.className = styles.checkboxLabel;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedVerbs.has(key);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedVerbs.add(key);
      else selectedVerbs.delete(key);
      errorMsg.textContent = '';
    });
    const text = document.createTextNode(t(labelKey));
    label.append(checkbox, text);
    checkboxList.appendChild(label);
  }

  verbSection.append(verbLabel, checkboxList);

  // Tense section
  const tenseSection = document.createElement('section');
  tenseSection.className = styles.section;
  const tenseLabel = document.createElement('span');
  tenseLabel.className = styles.sectionLabel;
  tenseLabel.textContent = t('selectTenses');
  const tenseCheckboxList = document.createElement('div');
  tenseCheckboxList.className = styles.checkboxList;

  const TENSES: Array<{ key: Tense; labelKey: string }> = [
    { key: 'present', labelKey: 'present' },
    { key: 'past',    labelKey: 'past' },
    { key: 'future',  labelKey: 'future' },
  ];

  for (const { key, labelKey } of TENSES) {
    const label = document.createElement('label');
    label.className = styles.checkboxLabel;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedTenses.has(key);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedTenses.add(key);
      else selectedTenses.delete(key);
      errorMsg.textContent = '';
    });
    const text = document.createTextNode(t(labelKey));
    label.append(checkbox, text);
    tenseCheckboxList.appendChild(label);
  }

  tenseSection.append(tenseLabel, tenseCheckboxList);

  // Question count section
  const countSection = document.createElement('section');
  countSection.className = styles.section;
  const countLabel = document.createElement('span');
  countLabel.className = styles.sectionLabel;
  countLabel.textContent = t('questionCount');

  const countRow = document.createElement('div');
  countRow.className = styles.countRow;
  countRow.setAttribute('role', 'group');
  countRow.setAttribute('aria-label', t('questionCount'));

  const countBtns: HTMLButtonElement[] = [];
  for (const n of COUNTS) {
    const btn = document.createElement('button');
    btn.textContent = String(n);
    btn.className = styles.countBtn + (n === selectedCount ? ' ' + styles.selected : '');
    btn.setAttribute('aria-pressed', String(n === selectedCount));
    btn.addEventListener('click', () => {
      selectedCount = n;
      countBtns.forEach((b, i) => {
        const active = COUNTS[i] === selectedCount;
        b.className = styles.countBtn + (active ? ' ' + styles.selected : '');
        b.setAttribute('aria-pressed', String(active));
      });
    });
    countBtns.push(btn);
    countRow.appendChild(btn);
  }

  countSection.append(countLabel, countRow);

  // Error
  const errorMsg = document.createElement('p');
  errorMsg.className = styles.error;
  errorMsg.setAttribute('role', 'alert');

  // Start button
  const startBtn = document.createElement('button');
  startBtn.className = styles.startBtn;
  startBtn.textContent = t('startQuiz');
  startBtn.addEventListener('click', () => {
    if (selectedVerbs.size === 0) {
      errorMsg.textContent = t('selectAtLeastOne');
      return;
    }
    if (selectedTenses.size === 0) {
      errorMsg.textContent = t('selectAtLeastOneTense');
      return;
    }
    callbacks.onStart({ questionCount: selectedCount, verbs: [...selectedVerbs], tenses: [...selectedTenses] });
  });

  screen.append(header, verbSection, tenseSection, countSection, errorMsg, startBtn);
  return screen;
}
