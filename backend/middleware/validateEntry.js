import { sendError } from '../utils/apiResponse.js';
import { normalizeMood } from '../constants/moodLibrary.js';

const VALID_TAGS = ['work', 'family', 'health', 'study'];

function validateTags(tags) {
  if (tags === undefined) return [];
  if (!Array.isArray(tags)) return null;
  const normalized = tags.map((t) => String(t).replace(/^#/, '').toLowerCase().trim());
  if (normalized.some((t) => !VALID_TAGS.includes(t))) return null;
  return normalized;
}

function resolveMood(body) {
  if (body.mood) return normalizeMood(body.mood);
  if (body.emoji) return normalizeMood(body.emoji);
  return null;
}

export function validateCreateEntry(req, res, next) {
  const { text, intensity, tags, richContent, attachments, location, weather, voiceNote } = req.body;
  const errors = [];
  const mood = resolveMood(req.body);

  if (!mood) errors.push('Valid mood selection is required');

  if (!text || typeof text !== 'string' || !text.trim()) {
    errors.push('Journal text is required');
  } else if (text.trim().length > 5000) {
    errors.push('Entry cannot exceed 5000 characters');
  }

  const parsedIntensity = intensity !== undefined ? Number(intensity) : 5;
  if (Number.isNaN(parsedIntensity) || parsedIntensity < 1 || parsedIntensity > 10) {
    errors.push('Intensity must be between 1 and 10');
  }

  const parsedTags = validateTags(tags);
  if (parsedTags === null) errors.push('Invalid tag provided');

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = {
    mood,
    text: text.trim(),
    richContent: richContent || '',
    intensity: parsedIntensity,
    tags: parsedTags,
    attachments: attachments || [],
    location: location || undefined,
    weather: weather || undefined,
    voiceNote: voiceNote || '',
  };
  next();
}

export function validateUpdateEntry(req, res, next) {
  const { text, intensity, tags, isFavorite, richContent, attachments, location, weather, voiceNote } = req.body;
  const errors = [];
  const sanitized = {};

  const mood = resolveMood(req.body);
  if (req.body.mood !== undefined || req.body.emoji !== undefined) {
    if (!mood) errors.push('Invalid mood selection');
    else sanitized.mood = mood;
  }

  if (text !== undefined) {
    if (typeof text !== 'string' || !text.trim()) errors.push('Journal text is required');
    else if (text.trim().length > 5000) errors.push('Entry cannot exceed 5000 characters');
    else sanitized.text = text.trim();
  }

  if (richContent !== undefined) sanitized.richContent = richContent;
  if (attachments !== undefined) sanitized.attachments = attachments;
  if (location !== undefined) sanitized.location = location;
  if (weather !== undefined) sanitized.weather = weather;
  if (voiceNote !== undefined) sanitized.voiceNote = voiceNote;

  if (intensity !== undefined) {
    const parsed = Number(intensity);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 10) errors.push('Intensity must be between 1 and 10');
    else sanitized.intensity = parsed;
  }

  if (tags !== undefined) {
    const parsedTags = validateTags(tags);
    if (parsedTags === null) errors.push('Invalid tag provided');
    else sanitized.tags = parsedTags;
  }

  if (isFavorite !== undefined) sanitized.isFavorite = Boolean(isFavorite);

  if (!Object.keys(sanitized).length) errors.push('At least one field is required to update');

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = sanitized;
  next();
}
