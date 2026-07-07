import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import i18n, { getCurrentLanguage } from '../i18n';
import { LANGUAGE_STORAGE_KEY, readStoredLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages';

const LanguageContext = createContext(null);

/**
 * Language provider — wraps react-i18next with language, setLanguage, and t().
 * Persists to localStorage (mira_language) and applies RTL for Urdu/Arabic.
 */
export function LanguageProvider({ children }) {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const [language, setLanguageState] = useState(() => getCurrentLanguage());

  useEffect(() => {
    const onChange = (lng) => setLanguageState(lng?.split('-')[0] || 'en');
    i18nInstance.on('languageChanged', onChange);
    return () => i18nInstance.off('languageChanged', onChange);
  }, [i18nInstance]);

  const setLanguage = useCallback(async (code) => {
    const lang = code?.split('-')[0] || 'en';
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    await i18nInstance.changeLanguage(lang);
    setLanguageState(lang);
  }, [i18nInstance]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      isRtl: language === 'ur' || language === 'ar',
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: getCurrentLanguage(),
      setLanguage: (code) => i18n.changeLanguage(code),
      t: (key, opts) => i18n.t(key, opts),
      languages: SUPPORTED_LANGUAGES,
      isRtl: ['ur', 'ar'].includes(getCurrentLanguage()),
    };
  }
  return ctx;
}

/** Apply stored language on boot (before auth profile may override). */
export function bootstrapLanguage() {
  const stored = readStoredLanguage();
  if (stored && stored !== getCurrentLanguage()) {
    i18n.changeLanguage(stored);
  }
}

export default LanguageContext;
