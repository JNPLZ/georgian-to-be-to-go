import type { GoPrefix, Person } from '../../types/index';
import { t } from '../../features/i18n/i18n';
import { verbBe } from '../../data/verbBe';
import { verbGoConjugations, goPrefixInfo, GO_PREFIXES } from '../../data/verbGo';
import { prefixIcons } from '../../utils/prefixIcons';
import styles from './CheatSheet.module.css';

type Tab = 'be' | 'go';

// In the cheatsheet, მი- and წა- share a combined entry because they use the same
// conjugation pattern — but წა- has no present-tense forms.
type CheatPrefix = 'mi_tsa' | Exclude<GoPrefix, 'mi' | 'tsa'>;
const CHEAT_PREFIXES: CheatPrefix[] = ['mi_tsa', 'mo', 'a', 'cha', 'she', 'ga', 'gada', 'da'];

const PERSONS: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];

const PRONOUNS: Record<Person, string> = {
  '1s': 'მე', '2s': 'შენ', '3s': 'ის',
  '1p': 'ჩვენ', '2p': 'თქვენ', '3p': 'ისინი',
};

function getPrefixLabel(cp: CheatPrefix): string {
  if (cp === 'mi_tsa') return 'მი- / წა-';
  return goPrefixInfo[cp].script;
}

function getPrefixIcon(cp: CheatPrefix): string {
  if (cp === 'mi_tsa') return prefixIcons.mi;
  return prefixIcons[cp];
}

export function createCheatSheet(): HTMLElement {
  let activeTab: Tab = 'be';
  let activeCheatPrefix: CheatPrefix = 'mi_tsa';

  const screen = document.createElement('div');
  screen.className = styles.screen;

  function render(): void {
    screen.innerHTML = '';

    const title = document.createElement('h2');
    title.className = styles.title;
    title.textContent = t('cheatsheetTitle');

    const tabBar = document.createElement('div');
    tabBar.className = styles.tabBar;
    tabBar.setAttribute('role', 'tablist');

    for (const tab of (['be', 'go'] as Tab[])) {
      const btn = document.createElement('button');
      btn.className = styles.tabBtn + (tab === activeTab ? ' ' + styles.active : '');
      btn.textContent = t(tab === 'be' ? 'verbBeTab' : 'verbGoTab');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(tab === activeTab));
      btn.addEventListener('click', () => { activeTab = tab; render(); });
      tabBar.appendChild(btn);
    }

    screen.append(title, tabBar);
    screen.appendChild(activeTab === 'be' ? buildBeTable() : buildGoSection());
  }

  type Tense = 'present' | 'past' | 'future';

  /** Returns a table wrapped in a scroll-fade container. */
  function buildConjugationTable(
    getForm: (person: Person, tense: Tense) => string,
    tenses: Tense[] = ['present', 'past', 'future'],
  ): HTMLElement {
    const outer = document.createElement('div');
    outer.className = styles.tableOuter;

    const tableWrap = document.createElement('div');
    tableWrap.className = styles.tableWrap;

    const fadeLeft = document.createElement('div');
    fadeLeft.className = styles.tableFadeLeft;
    fadeLeft.setAttribute('aria-hidden', 'true');

    const fadeRight = document.createElement('div');
    fadeRight.className = styles.tableFadeRight;
    fadeRight.setAttribute('aria-hidden', 'true');

    const table = document.createElement('table');
    table.className = styles.table;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (const key of ['pronoun', ...tenses]) {
      const th = document.createElement('th');
      th.textContent = t(key);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const person of PERSONS) {
      const row = document.createElement('tr');

      const tdPronoun = document.createElement('td');
      tdPronoun.className = styles.pronounCell;
      tdPronoun.textContent = PRONOUNS[person];
      row.appendChild(tdPronoun);

      for (const tense of tenses) {
        const td = document.createElement('td');
        td.className = styles.georgianForm;
        td.textContent = getForm(person, tense);
        row.appendChild(td);
      }

      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableWrap.appendChild(table);

    outer.append(tableWrap, fadeLeft, fadeRight);

    // Scroll fade logic
    requestAnimationFrame(() => {
      const hasOverflow = tableWrap.scrollWidth > tableWrap.clientWidth + 2;
      fadeRight.style.opacity = hasOverflow ? '1' : '0';
      fadeLeft.style.opacity = '0';
    });

    tableWrap.addEventListener('scroll', () => {
      const { scrollLeft, scrollWidth, clientWidth } = tableWrap;
      fadeLeft.style.opacity = scrollLeft > 2 ? '1' : '0';
      fadeRight.style.opacity = scrollLeft + clientWidth < scrollWidth - 2 ? '1' : '0';
    }, { passive: true });

    return outer;
  }

  function buildBeTable(): HTMLElement {
    return buildConjugationTable((person, tense) => verbBe[tense][person]);
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
    for (const cp of CHEAT_PREFIXES) {
      const btn = document.createElement('button');
      btn.className = styles.prefixBtn + (cp === activeCheatPrefix ? ' ' + styles.active : '');
      btn.setAttribute('aria-label', getPrefixLabel(cp));
      btn.innerHTML =
        `<span class="${styles.prefixBtnScript}">${getPrefixLabel(cp)}</span>` +
        `<span class="${styles.prefixBtnIcon}">${getPrefixIcon(cp)}</span>`;
      btn.addEventListener('click', () => {
        activeCheatPrefix = cp;
        prefixBtns.forEach((b, i) => {
          b.className = styles.prefixBtn + (CHEAT_PREFIXES[i] === activeCheatPrefix ? ' ' + styles.active : '');
        });
        updateContent();
      });
      prefixBtns.push(btn);
      prefixGrid.appendChild(btn);
    }
    prefixSection.appendChild(prefixGrid);
    wrap.appendChild(prefixSection);

    // Direction note + table container (swapped on prefix change)
    const directionNote = document.createElement('div');
    directionNote.className = styles.directionNote;
    const tableContainer = document.createElement('div');
    const tsaCallout = document.createElement('div');
    tsaCallout.className = styles.tsaCallout;
    const daCallout = document.createElement('div');
    daCallout.className = styles.tsaCallout;

    wrap.append(directionNote, tableContainer, tsaCallout, daCallout);

    function updateContent(): void {
      tsaCallout.style.display = 'none';
      daCallout.style.display = 'none';

      if (activeCheatPrefix === 'mi_tsa') {
        directionNote.innerHTML =
          `<span class="${styles.directionIcon}">${prefixIcons.mi}</span>` +
          `<span>${t(goPrefixInfo.mi.meaningKey)}</span>`;

        tableContainer.innerHTML = '';
        tableContainer.appendChild(
          buildConjugationTable((person, tense) => verbGoConjugations.mi[tense][person]),
        );

        tsaCallout.textContent = t('tsaNote');
        tsaCallout.style.display = '';
      } else if (activeCheatPrefix === 'da') {
        directionNote.innerHTML =
          `<span class="${styles.directionIcon}">${prefixIcons.da}</span>` +
          `<span>${t(goPrefixInfo.da.meaningKey)}</span>`;

        tableContainer.innerHTML = '';
        tableContainer.appendChild(
          buildConjugationTable(
            (person, tense) => verbGoConjugations.da[tense][person],
            ['present'],
          ),
        );

        daCallout.textContent = t('daNote');
        daCallout.style.display = '';
      } else {
        const info = goPrefixInfo[activeCheatPrefix as GoPrefix];
        directionNote.innerHTML =
          `<span class="${styles.directionIcon}">${prefixIcons[activeCheatPrefix as GoPrefix]}</span>` +
          `<span>${t(info.meaningKey)}</span>`;

        tableContainer.innerHTML = '';
        tableContainer.appendChild(
          buildConjugationTable(
            (person, tense) => verbGoConjugations[activeCheatPrefix as GoPrefix][tense][person],
          ),
        );
      }
    }

    updateContent();

    // Prefix explanation cards
    const explainSection = document.createElement('div');
    explainSection.className = styles.prefixExplanation;

    const explainTitle = document.createElement('h3');
    explainTitle.className = styles.prefixExplanationTitle;
    explainTitle.textContent = t('prefixNote');
    explainSection.appendChild(explainTitle);

    const grid = document.createElement('div');
    grid.className = styles.prefixExplainGrid;

    for (const cp of CHEAT_PREFIXES) {
      const card = document.createElement('div');
      card.className = styles.prefixCard;

      const left = document.createElement('div');
      left.className = styles.prefixCardLeft;
      left.innerHTML =
        `<span class="${styles.prefixCardScript}">${getPrefixLabel(cp)}</span>` +
        `<span class="${styles.prefixCardIcon}">${getPrefixIcon(cp)}</span>`;

      const meaning = document.createElement('span');
      meaning.className = styles.prefixCardMeaning;

      if (cp === 'mi_tsa') {
        meaning.innerHTML =
          `${t(goPrefixInfo.mi.meaningKey)}<br>` +
          `<small style="opacity:.7">${t(goPrefixInfo.tsa.meaningKey)}</small>`;
      } else {
        meaning.textContent = t(goPrefixInfo[cp as GoPrefix].meaningKey);
      }

      card.append(left, meaning);
      grid.appendChild(card);
    }

    explainSection.appendChild(grid);
    wrap.appendChild(explainSection);
    return wrap;
  }

  render();
  return screen;
}
