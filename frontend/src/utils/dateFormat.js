import { getCurrentLanguage } from '../i18n';

export function formatLocalizedDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const locale = getCurrentLanguage();
  const defaults = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  try {
    return new Intl.DateTimeFormat(locale, defaults).format(d);
  } catch {
    return new Intl.DateTimeFormat('en', defaults).format(d);
  }
}

export function formatLocalizedTime(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const locale = getCurrentLanguage();
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(d);
  }
}

export function formatLocalizedDateTime(date) {
  return `${formatLocalizedDate(date)} ${formatLocalizedTime(date)}`;
}
