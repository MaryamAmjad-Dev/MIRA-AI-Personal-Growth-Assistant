export const SUPPORTED_LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English', nativeName: 'English' },
  { code: 'it', short: 'IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'de', short: 'DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', short: 'JA', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', short: 'KO', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', short: 'HI', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ur', short: 'UR', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ar', short: 'AR', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', short: 'ZH', name: 'Chinese', nativeName: '中文' },
  { code: 'es', short: 'ES', name: 'Spanish', nativeName: 'Español' },
];

export const RTL_LANGUAGES = ['ar', 'ur'];

export const LANGUAGE_STORAGE_KEY = 'mira_language';
const LEGACY_LANGUAGE_KEYS = ['mira-language'];

/** Read stored language and migrate legacy keys to mira_language */
export function readStoredLanguage() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) return stored.split('-')[0];

  for (const key of LEGACY_LANGUAGE_KEYS) {
    const legacy = localStorage.getItem(key);
    if (legacy) {
      const code = legacy.split('-')[0];
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      localStorage.removeItem(key);
      return code;
    }
  }

  return null;
}

export function isRtlLanguage(code) {
  return RTL_LANGUAGES.includes(code);
}
