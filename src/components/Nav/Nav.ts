import type { Language, Screen } from '../../types/index';
import { t, setLang, getLang } from '../../features/i18n/i18n';
import styles from './Nav.module.css';

interface NavCallbacks {
  onNavigate: (screen: Screen) => void;
  onLangChange: () => void;
}

const LANGS: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'de', label: 'DE' },
  { value: 'ru', label: 'RU' },
];

export function createNav(activeScreen: Screen, callbacks: NavCallbacks): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = styles.nav;
  nav.setAttribute('aria-label', 'Main navigation');

  const title = document.createElement('span');
  title.className = styles.title;
  title.textContent = t('appTitle');

  const links = document.createElement('div');
  links.className = styles.links;

  const homeBtn = document.createElement('button');
  homeBtn.className =
    styles.navBtn + (activeScreen !== 'cheatsheet' ? ' ' + styles.active : '');
  homeBtn.textContent = t('home');
  homeBtn.addEventListener('click', () => callbacks.onNavigate('start'));

  const cheatBtn = document.createElement('button');
  cheatBtn.className =
    styles.navBtn + (activeScreen === 'cheatsheet' ? ' ' + styles.active : '');
  cheatBtn.textContent = t('cheatsheet');
  cheatBtn.addEventListener('click', () => callbacks.onNavigate('cheatsheet'));

  links.append(homeBtn, cheatBtn);

  // Language dropdown
  const langSelect = document.createElement('select');
  langSelect.className = styles.langSelect;
  langSelect.setAttribute('aria-label', 'Language');

  const currentLang = getLang();
  for (const { value, label } of LANGS) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = value === currentLang;
    langSelect.appendChild(option);
  }

  langSelect.addEventListener('change', () => {
    setLang(langSelect.value as Language);
    callbacks.onLangChange();
  });

  nav.append(title, links, langSelect);
  return nav;
}
