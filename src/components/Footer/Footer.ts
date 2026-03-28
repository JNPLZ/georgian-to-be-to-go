import { t } from '../../features/i18n/i18n';
import styles from './Footer.module.css';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = styles.footer;

  const name = document.createElement('span');
  name.innerHTML =
    t('footerPrefix') +
    `<a href="https://github.com/JNPLZ" target="_blank" rel="noopener noreferrer" class="${styles.footerLink}">JNPLZ</a>` +
    t('footerSuffix');

  const privacy = document.createElement('span');
  privacy.className = styles.privacy;
  privacy.textContent = t('footerPrivacy');

  footer.append(name, privacy);
  return footer;
}
