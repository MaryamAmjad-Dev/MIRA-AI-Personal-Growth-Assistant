import { normalizeLanguage } from '../services/languageHelper.js';

export function getRequestLanguage(req) {
  if (req.user?.language) return normalizeLanguage(req.user.language);
  if (req.headers['x-mira-language']) return normalizeLanguage(req.headers['x-mira-language']);
  const accept = req.headers['accept-language'];
  if (accept) return normalizeLanguage(String(accept).split(',')[0].trim());
  return 'en';
}
