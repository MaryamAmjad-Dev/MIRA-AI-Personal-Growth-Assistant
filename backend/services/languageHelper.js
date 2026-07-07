const LANGUAGE_NAMES = {
  en: 'English',
  ur: 'Urdu',
  ar: 'Arabic',
  hi: 'Hindi',
  es: 'Spanish',
  it: 'Italian',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
};

export function normalizeLanguage(code) {
  if (!code) return 'en';
  const base = String(code).split('-')[0].toLowerCase();
  return LANGUAGE_NAMES[base] ? base : 'en';
}

export function getLanguageInstruction(lang) {
  const code = normalizeLanguage(lang);
  if (code === 'en') return 'Respond entirely in English.';
  const name = LANGUAGE_NAMES[code] || code;
  return `Respond entirely in ${name}. Use natural, fluent ${name}. Do not switch to English unless the user writes in English.`;
}

export { LANGUAGE_NAMES };
