import type { Language, Screen } from '../../types/index';
import { t, setLang, getLang } from '../../features/i18n/i18n';
import styles from './Nav.module.css';

interface NavCallbacks {
  onNavigate: (screen: Screen) => void;
  onLangChange: () => void;
}

const LANGS: Language[] = ['en', 'de', 'ru'];

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

  const langGroup = document.createElement('div');
  langGroup.className = styles.langGroup;
  langGroup.setAttribute('role', 'group');
  langGroup.setAttribute('aria-label', 'Language');

  const currentLang = getLang();
  for (const lang of LANGS) {
    const btn = document.createElement('button');
    btn.className = styles.langBtn + (lang === currentLang ? ' ' + styles.active : '');
    btn.textContent = lang.toUpperCase();
    btn.setAttribute('aria-pressed', String(lang === currentLang));
    btn.addEventListener('click', () => {
      setLang(lang);
      callbacks.onLangChange();
    });
    langGroup.appendChild(btn);
  }

  nav.append(title, links, langGroup);
  return nav;
}
