import type { Language } from '../../types/index';
import { en } from './en';
import { de } from './de';
import { ru } from './ru';

const STORAGE_KEY = 'georgian_lang';

const translations: Record<Language, Record<string, string>> = { en, de, ru };

let currentLang: Language = 'en';

export function initLang(): void {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && stored in translations) {
    currentLang = stored;
  }
}

export function setLang(lang: Language): void {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function getLang(): Language {
  return currentLang;
}

/** Translate a key. Falls back to English, then the key itself. */
export function t(key: string): string {
  return translations[currentLang][key] ?? translations.en[key] ?? key;
}
