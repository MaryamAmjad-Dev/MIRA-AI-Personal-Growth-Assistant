import DigitalTwin from '../../models/DigitalTwin.js';
import JournalEntry from '../../models/JournalEntry.js';
import { getUserStatsForAnalytics } from '../achievementService.js';
import { getUserContext, updateUserMemory } from '../aiMemoryService.js';
import { getLanguageInstruction } from '../languageHelper.js';
import { isAiEnabled, callOpenAIJson, callOpenAIText } from '../ai/openaiClient.js';
import { sanitizeText } from '../ai/promptBuilder.js';
import { getLocalAIResponse } from '../localAIService.js';

function buildLocalTwin(stats, entries) {
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const negative = entries.filter((e) => e.mood?.category === 'negative').length;
  const avgLen = entries.reduce((s, e) => s + (e.text?.length || 0), 0) / Math.max(entries.length, 1);

  return {
    personalityType: positive > negative ? 'Optimistic Realist' : negative > positive ? 'Deep Reflector' : 'Balanced Explorer',
    communicationStyle: avgLen > 200 ? 'Expressive & detailed' : 'Concise & direct',
    writingStyle: avgLen > 150 ? 'Thoughtful narrative journaling' : 'Quick emotional check-ins',
    strengths: ['Self-awareness through journaling', `${stats.habits.length} habits tracked`, 'Consistent self-reflection'],
    weaknesses: negative > positive ? ['Tendency toward stress cycles'] : ['Room to deepen habit consistency'],
    repeatedPatterns: [
      `${positive} positive vs ${negative} challenging entries recently`,
      stats.habitCompletionRate < 50 ? 'Habit completion drops on busy days' : 'Strong habit momentum building',
    ],
    lifeValues: ['Growth', 'Balance', 'Authenticity'],
    decisionHistory: [],
  };
}

export async function syncDigitalTwin(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const entries = stats.entries.slice(0, 90);
  let twinData;

  if (isAiEnabled() && entries.length > 3) {
    try {
      twinData = await callOpenAIJson([
        { role: 'system', content: 'Build a digital twin profile. Return JSON: {"personalityType":"","communicationStyle":"","writingStyle":"","strengths":[],"weaknesses":[],"repeatedPatterns":[],"lifeValues":[]}' },
        { role: 'user', content: JSON.stringify({ entries: entries.slice(0, 20).map((e) => ({ text: e.text?.slice(0, 200), mood: e.mood?.name })), habits: stats.habits, goals: stats.goals }) },
      ]);
    } catch { twinData = buildLocalTwin(stats, entries); }
  } else {
    twinData = buildLocalTwin(stats, entries);
  }

  const twin = await DigitalTwin.findOneAndUpdate(
    { user: userId },
    { user: userId, ...twinData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return twin;
}

export async function getDigitalTwin(userId) {
  let twin = await DigitalTwin.findOne({ user: userId }).lean();
  if (!twin) twin = await syncDigitalTwin(userId);
  return twin;
}

export async function askDigitalTwin(userId, question, language = 'en') {
  const safeQ = sanitizeText(question, 1000);
  const [twin, context] = await Promise.all([
    getDigitalTwin(userId),
    getUserContext(userId),
  ]);

  const presetResponses = {
    'what would i normally do': `Based on your patterns as a ${twin.personalityType}, you typically approach challenges with ${twin.communicationStyle?.toLowerCase()} reflection before acting. Your repeated pattern: ${twin.repeatedPatterns?.[0] || 'steady self-reflection'}.`,
    'why do i keep repeating this pattern': `Your twin detects: ${(twin.repeatedPatterns || []).join('; ') || 'cycles tied to stress and inconsistent routines'}. This often connects to ${twin.weaknesses?.[0] || 'external pressure'}.`,
    'what changed about me this month': twin.evolutionSnapshots?.length
      ? twin.evolutionSnapshots[twin.evolutionSnapshots.length - 1].summary
      : `You're developing stronger ${twin.strengths?.[0]?.toLowerCase() || 'self-awareness'}. Journal frequency and habit data suggest gradual growth.`,
    'compare current me vs past me': `Current you: ${twin.personalityType}, focused on ${(twin.lifeValues || []).join(', ')}. Past snapshots: ${twin.evolutionSnapshots?.length || 0} recorded. Trend: ${context.habitCompletionRate > 50 ? 'improving consistency' : 'building foundation'}.`,
  };

  const key = Object.keys(presetResponses).find((k) => safeQ.toLowerCase().includes(k));
  if (key && !isAiEnabled()) return { reply: presetResponses[key], source: 'local' };

  if (!isAiEnabled()) {
    const { reply } = await getLocalAIResponse(userId, safeQ, language);
    return {
      reply: `As your ${twin.personalityType} twin: ${reply}`,
      source: 'local',
    };
  }

  if (isAiEnabled()) {
    try {
      const reply = await callOpenAIText(
        `You are the user's Digital Twin AI. Mirror their personality: ${JSON.stringify({ personalityType: twin.personalityType, strengths: twin.strengths, patterns: twin.repeatedPatterns, values: twin.lifeValues })}. Answer as "your twin self". ${getLanguageInstruction(language)}`,
        `Context: ${JSON.stringify(context.recentEntries.slice(0, 5))}\n\nQuestion: ${safeQ}`
      );
      return { reply, source: 'ai' };
    } catch { /* fallback */ }
  }

  return { reply: presetResponses[key] || `As your ${twin.personalityType} twin: ${twin.strengths?.[0] || 'You value growth'}. ${twin.repeatedPatterns?.[0] || 'Keep journaling to deepen insights.'}`, source: 'local' };
}

export async function getPersonalityEvolution(userId) {
  const twin = await getDigitalTwin(userId);
  const entries = await JournalEntry.find({ user: userId }).sort({ createdAt: -1 }).limit(60).lean();

  const months = {};
  entries.forEach((e) => {
    const m = new Date(e.createdAt).toISOString().slice(0, 7);
    if (!months[m]) months[m] = { positive: 0, negative: 0, neutral: 0, count: 0 };
    months[m][e.mood?.category || 'neutral']++;
    months[m].count++;
  });

  const timeline = Object.entries(months).map(([month, data]) => ({
    month,
    entries: data.count,
    dominant: data.positive >= data.negative ? 'positive' : data.negative > data.positive ? 'negative' : 'neutral',
    traits: twin.evolutionSnapshots?.find((s) => s.month === month)?.traits || [],
  })).slice(-6);

  return { twin: { personalityType: twin.personalityType, communicationStyle: twin.communicationStyle }, timeline, snapshots: twin.evolutionSnapshots || [] };
}

export async function recordDecision(userId, { decision, outcome }) {
  const twin = await DigitalTwin.findOne({ user: userId });
  if (!twin) await syncDigitalTwin(userId);
  return DigitalTwin.findOneAndUpdate(
    { user: userId },
    { $push: { decisionHistory: { decision: sanitizeText(decision, 500), outcome: sanitizeText(outcome, 500), date: new Date() } } },
    { new: true }
  );
}

export async function refreshTwinMonthly(userId) {
  const month = new Date().toISOString().slice(0, 7);
  const twin = await syncDigitalTwin(userId);
  const summary = `Month ${month}: ${twin.personalityType} — ${twin.repeatedPatterns?.[0] || 'steady progress'}`;
  await DigitalTwin.findOneAndUpdate(
    { user: userId },
    { $push: { evolutionSnapshots: { month, summary, traits: twin.strengths?.slice(0, 3) || [] } } }
  );
  await updateUserMemory(userId).catch(() => {});
  return summary;
}
