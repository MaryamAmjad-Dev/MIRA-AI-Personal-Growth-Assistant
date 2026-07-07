const SENSITIVE_PATTERNS = [
  /password\s*[:=]/gi,
  /jwt\s*[:=]/gi,
  /bearer\s+[a-z0-9._-]+/gi,
  /mongodb(\+srv)?:\/\//gi,
  /api[_-]?key\s*[:=]/gi,
];

export function sanitizeText(text = '', maxLength = 4000) {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text.slice(0, maxLength);
  SENSITIVE_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '[redacted]');
  });
  return cleaned.trim();
}

export function buildJournalContext(entries = []) {
  return entries.slice(0, 15).map((e) => ({
    date: e.createdAt,
    mood: e.mood?.name || e.emoji,
    category: e.mood?.category,
    intensity: e.intensity,
    text: sanitizeText(e.text, 300),
    tags: e.tags,
  }));
}

export function buildMemoryContext(memory) {
  if (!memory) return 'No stored memory yet.';
  return JSON.stringify({
    personalityInsights: memory.personalityInsights?.slice(0, 5),
    commonMoods: memory.commonMoods?.slice(0, 5),
    emotionalPatterns: memory.emotionalPatterns?.slice(0, 5),
    stressTriggers: memory.stressTriggers?.slice(0, 5),
    positiveTriggers: memory.positiveTriggers?.slice(0, 5),
    habitPatterns: memory.habitPatterns?.slice(0, 5),
    goals: memory.goals?.slice(0, 5),
  });
}

import { getLanguageInstruction } from '../languageHelper.js';

export function buildCoachSystemPrompt(memoryContext, lang = 'en') {
  return `You are MIRA AI, a supportive wellness intelligence coach created by Maryam.
${getLanguageInstruction(lang)}
Use the user's memory and journal context for personalized guidance.
Never mention other users. Never ask for passwords or tokens.
Be empathetic, concise, and actionable. Max 250 words unless generating a report.

User memory: ${memoryContext}`;
}

export function buildAnalysisSystemPrompt() {
  return `Analyze journal entries for wellness insights. Return JSON only:
{
  "sentiment":"positive|negative|neutral",
  "emotions":["..."],
  "stressScore":0-10,
  "energyScore":0-10,
  "positivityScore":0-100,
  "keywords":["..."],
  "triggers":["..."],
  "summary":"...",
  "suggestions":["..."]
}`;
}

export function buildReportSystemPrompt(period) {
  return `Generate a ${period} wellness report as JSON:
{
  "title":"...",
  "moodSummary":"...",
  "emotionalTrends":["..."],
  "habitSuccess":"...",
  "productivity":"...",
  "improvements":["..."],
  "recommendations":["..."],
  "wellnessScore":0-100
}`;
}
