import { beforeEach, describe, expect, it } from 'vitest';
import { getLang, initLang, setLang, t } from '../src/features/i18n/i18n';

describe('i18n defaults and persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts in English when no language has been stored', () => {
    initLang();

    expect(getLang()).toBe('en');
    expect(t('home')).toBe('Quiz');
  });

  it('restores a valid stored language', () => {
    localStorage.setItem('georgian_lang', 'de');

    initLang();

    expect(getLang()).toBe('de');
    expect(t('cheatsheet')).toBe('Spickzettel');
  });

  it('ignores invalid stored values and falls back to English', () => {
    localStorage.setItem('georgian_lang', 'fr');

    initLang();

    expect(getLang()).toBe('en');
    expect(t('home')).toBe('Quiz');
  });

  it('persists language changes', () => {
    setLang('ru');

    expect(localStorage.getItem('georgian_lang')).toBe('ru');
    expect(getLang()).toBe('ru');
  });
});
