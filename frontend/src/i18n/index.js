import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { isRtlLanguage, LANGUAGE_STORAGE_KEY, readStoredLanguage } from './languages';

import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import it from './locales/it.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';

function applyDocumentLanguage(lng) {
  const lang = lng?.split('-')[0] || 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtlLanguage(lang) ? 'rtl' : 'ltr';
}

readStoredLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      ar: { translation: ar },
      hi: { translation: hi },
      es: { translation: es },
      it: { translation: it },
      de: { translation: de },
      ja: { translation: ja },
      ko: { translation: ko },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur', 'ar', 'hi', 'es', 'it', 'de', 'ja', 'ko', 'zh'],
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', (lng) => {
  applyDocumentLanguage(lng);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng.split('-')[0]);
});

export function getCurrentLanguage() {
  return i18n.language?.split('-')[0] || 'en';
}

export default i18n;
