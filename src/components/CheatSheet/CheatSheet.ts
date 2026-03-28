import type { GoPrefix, Person, Tense } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import { verbBe } from '../../data/verbBe';
import { verbGoConjugations, goPrefixInfo, GO_PREFIXES } from '../../data/verbGo';
import styles from './CheatSheet.module.css';

type Tab = 'be' | 'go';

const PERSONS: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];
const TENSES: Tense[] = ['present', 'past', 'future'];

const PRONOUNS: Record<Person, string> = {
  '1s': 'მე', '2s': 'შენ', '3s': 'ის',
  '1p': 'ჩვენ', '2p': 'თქვენ', '3p': 'ისინი',
};

export function createCheatSheet(): HTMLElement {
  let activeTab: Tab = 'be';
  let activePrefix: GoPrefix = 'mi';

  const screen = document.createElement('div');
  screen.className = styles.screen;

  function render(): void {
    screen.innerHTML = '';

    const title = document.createElement('h2');
    title.className = styles.title;
    title.textContent = t('cheatsheetTitle');

    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = styles.tabBar;
    tabBar.setAttribute('role', 'tablist');

    for (const tab of (['be', 'go'] as Tab[])) {
      const btn = document.createElement('button');
      btn.className = styles.tabBtn + (tab === activeTab ? ' ' + styles.active : '');
      btn.textContent = t(tab === 'be' ? 'verbBeTab' : 'verbGoTab');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(tab === activeTab));
      btn.addEventListener('click', () => {
        activeTab = tab;
        render();
      });
      tabBar.appendChild(btn);
    }

    screen.append(title, tabBar);

    if (activeTab === 'be') {
      screen.appendChild(buildBeTable());
    } else {
      screen.appendChild(buildGoSection());
    }
  }

  function buildBeTable(): HTMLElement {
    const wrap = document.createElement('div');

    const tableWrap = document.createElement('div');
    tableWrap.className = styles.tableWrap;

    const table = document.createElement('table');
    table.className = styles.table;

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const th0 = document.createElement('th');
    th0.textContent = t('pronoun');
    const th1 = document.createElement('th');
    th1.textContent = t('person');
    const thPresent = document.createElement('th');
    thPresent.textContent = t('present');
    const thPast = document.createElement('th');
    thPast.textContent = t('past');
    const thFuture = document.createElement('th');
    thFuture.textContent = t('future');
    headerRow.append(th0, th1, thPresent, thPast, thFuture);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const person of PERSONS) {
      const row = document.createElement('tr');

      const tdPronoun = document.createElement('td');
      tdPronoun.className = styles.pronounCell;
      tdPronoun.textContent = PRONOUNS[person];

      const tdPerson = document.createElement('td');
      tdPerson.className = styles.personCell;
      tdPerson.textContent = t('p' + person);

      const tdPresent = document.createElement('td');
      tdPresent.className = styles.georgianForm;
      tdPresent.textContent = verbBe.present[person];

      const tdPast = document.createElement('td');
      tdPast.className = styles.georgianForm;
      tdPast.textContent = verbBe.past[person];

      const tdFuture = document.createElement('td');
      tdFuture.className = styles.georgianForm;
      tdFuture.textContent = verbBe.future[person];

      row.append(tdPronoun, tdPerson, tdPresent, tdPast, tdFuture);
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrap.appendChild(tableWrap);
    return wrap;
  }

  function buildGoSection(): HTMLElement {
    const wrap = document.createElement('div');

    // Prefix selector
    const prefixSection = document.createElement('div');
    prefixSection.className = styles.prefixSection;

    const prefixLabel = document.createElement('span');
    prefixLabel.className = styles.prefixLabel;
    prefixLabel.textContent = t('selectPrefix');
    prefixSection.appendChild(prefixLabel);

    const prefixGrid = document.createElement('div');
    prefixGrid.className = styles.prefixGrid;

    const prefixBtns: HTMLButtonElement[] = [];
    for (const prefix of GO_PREFIXES) {
      const info = goPrefixInfo[prefix];
      const btn = document.createElement('button');
      btn.className = styles.prefixBtn + (prefix === activePrefix ? ' ' + styles.active : '');
      btn.innerHTML =
        `<span class="${styles.prefixBtnScript}">${info.script}</span>` +
        `<span class="${styles.prefixBtnLatin}">${info.transliteration}</span>`;
      btn.setAttribute('aria-label', `${info.script} — ${t(info.meaningKey)}`);
      btn.addEventListener('click', () => {
        activePrefix = prefix;
        prefixBtns.forEach((b, i) => {
          const active = GO_PREFIXES[i] === activePrefix;
          b.className = styles.prefixBtn + (active ? ' ' + styles.active : '');
        });
        // Re-render direction note and table only
        directionNote.textContent = t(goPrefixInfo[activePrefix].meaningKey);
        updateGoTable();
      });
      prefixBtns.push(btn);
      prefixGrid.appendChild(btn);
    }
    prefixSection.appendChild(prefixGrid);
    wrap.appendChild(prefixSection);

    // Direction note
    const directionNote = document.createElement('div');
    directionNote.className = styles.directionNote;
    directionNote.textContent = t(goPrefixInfo[activePrefix].meaningKey);
    wrap.appendChild(directionNote);

    // Conjugation table
    const tableWrap = document.createElement('div');
    tableWrap.className = styles.tableWrap;

    const table = document.createElement('table');
    table.className = styles.table;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const th0 = document.createElement('th');
    th0.textContent = t('pronoun');
    const th1 = document.createElement('th');
    th1.textContent = t('person');
    const thPresent = document.createElement('th');
    thPresent.textContent = t('present');
    const thPast = document.createElement('th');
    thPast.textContent = t('past');
    const thFuture = document.createElement('th');
    thFuture.textContent = t('future');
    headerRow.append(th0, th1, thPresent, thPast, thFuture);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrap.appendChild(tableWrap);

    function updateGoTable(): void {
      tbody.innerHTML = '';
      const conj = verbGoConjugations[activePrefix];
      for (const person of PERSONS) {
        const row = document.createElement('tr');

        const tdPronoun = document.createElement('td');
        tdPronoun.className = styles.pronounCell;
        tdPronoun.textContent = PRONOUNS[person];

        const tdPerson = document.createElement('td');
        tdPerson.className = styles.personCell;
        tdPerson.textContent = t('p' + person);

        const tdPresent = document.createElement('td');
        tdPresent.className = styles.georgianForm;
        tdPresent.textContent = conj.present[person];

        const tdPast = document.createElement('td');
        tdPast.className = styles.georgianForm;
        tdPast.textContent = conj.past[person];

        const tdFuture = document.createElement('td');
        tdFuture.className = styles.georgianForm;
        tdFuture.textContent = conj.future[person];

        row.append(tdPronoun, tdPerson, tdPresent, tdPast, tdFuture);
        tbody.appendChild(row);
      }
    }

    updateGoTable();

    // Prefix explanation cards at bottom
    const explainSection = document.createElement('div');
    explainSection.className = styles.prefixExplanation;

    const explainTitle = document.createElement('h3');
    explainTitle.className = styles.prefixExplanationTitle;
    explainTitle.textContent = t('prefixNote');
    explainSection.appendChild(explainTitle);

    const grid = document.createElement('div');
    grid.className = styles.prefixExplainGrid;

    for (const prefix of GO_PREFIXES) {
      const info = goPrefixInfo[prefix];
      const card = document.createElement('div');
      card.className = styles.prefixCard;
      card.innerHTML =
        `<div>` +
        `  <div class="${styles.prefixCardScript}">${info.script}</div>` +
        `  <div class="${styles.prefixCardLatin}">${info.transliteration}</div>` +
        `</div>` +
        `<div>${t(info.meaningKey)}</div>`;
      grid.appendChild(card);
    }

    explainSection.appendChild(grid);
    wrap.appendChild(explainSection);

    return wrap;
  }

  render();
  return screen;
}
