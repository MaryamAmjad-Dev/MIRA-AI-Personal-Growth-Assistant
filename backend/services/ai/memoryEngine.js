import AIMemory from '../../models/AIMemory.js';
import JournalEntry from '../../models/JournalEntry.js';
import Habit from '../../models/Habit.js';
import Goal from '../../models/Goal.js';
import AIConversation from '../../models/AIConversation.js';
import { getUserStatsForAnalytics } from '../achievementService.js';
import { isAiEnabled, callOpenAIJson } from './openaiClient.js';
import { buildJournalContext, buildMemoryContext, sanitizeText } from './promptBuilder.js';

function aggregateMoods(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const key = e.mood?.emoji || e.emoji || '?';
    const name = e.mood?.name || 'Unknown';
    const existing = map.get(key) || { emoji: key, name, count: 0 };
    existing.count += 1;
    map.set(key, existing);
  });
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
}

function detectTriggers(entries) {
  const stressWords = ['stress', 'work', 'deadline', 'anxious', 'overwhelm', 'tired', 'exhausted'];
  const positiveWords = ['grateful', 'happy', 'love', 'friend', 'exercise', 'rest', 'calm'];

  const stress = new Set();
  const positive = new Set();

  entries.forEach((e) => {
    const lower = (e.text || '').toLowerCase();
    stressWords.forEach((w) => { if (lower.includes(w)) stress.add(w); });
    positiveWords.forEach((w) => { if (lower.includes(w)) positive.add(w); });
  });

  return {
    stressTriggers: [...stress].slice(0, 6),
    positiveTriggers: [...positive].slice(0, 6),
  };
}

function buildLocalMemory(stats, entries) {
  const { stressTriggers, positiveTriggers } = detectTriggers(entries);
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const negative = entries.filter((e) => e.mood?.category === 'negative').length;

  return {
    personalityInsights: [
      entries.length > 10 ? 'Reflective journaler who tracks emotions consistently' : 'Building a journaling habit',
      positive > negative ? 'Tends toward positive emotional awareness' : 'Working through challenging emotions openly',
    ],
    commonMoods: aggregateMoods(entries),
    emotionalPatterns: [
      `${positive} positive vs ${negative} challenging entries recently`,
      `Average intensity around ${Math.round(entries.reduce((s, e) => s + (e.intensity || 5), 0) / Math.max(entries.length, 1))}/10`,
    ],
    stressTriggers,
    positiveTriggers,
    habitPatterns: stats.habits.map((h) => `${h.title}: ${h.streak || 0} day streak`),
    goals: stats.goals.map((g) => `${g.title} (${g.progress || 0}% complete)`),
    preferences: { coachingStyle: 'supportive', focusAreas: ['mood', 'habits', 'goals'] },
  };
}

export async function updateUserMemory(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const entries = stats.entries.slice(0, 60);

  let memoryData;

  if (isAiEnabled() && entries.length > 0) {
    try {
      memoryData = await callOpenAIJson([
        {
          role: 'system',
          content: 'Summarize user wellness patterns as JSON: {"personalityInsights":[],"commonMoods":[{"emoji":"","name":"","count":0}],"emotionalPatterns":[],"stressTriggers":[],"positiveTriggers":[],"habitPatterns":[],"goals":[],"preferences":{"coachingStyle":"supportive","focusAreas":[]}}',
        },
        {
          role: 'user',
          content: JSON.stringify({
            entries: buildJournalContext(entries),
            habits: stats.habits,
            goals: stats.goals,
          }),
        },
      ]);
    } catch {
      memoryData = buildLocalMemory(stats, entries);
    }
  } else {
    memoryData = buildLocalMemory(stats, entries);
  }

  const memory = await AIMemory.findOneAndUpdate(
    { user: userId },
    { user: userId, ...memoryData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return memory;
}

export async function getUserContext(userId) {
  const [memory, stats, conversation] = await Promise.all([
    AIMemory.findOne({ user: userId }).lean(),
    getUserStatsForAnalytics(userId),
    AIConversation.findOne({ user: userId }).lean(),
  ]);

  const recentMessages = conversation?.messages?.slice(-10) || [];

  return {
    memory: memory || null,
    memoryContext: buildMemoryContext(memory),
    stats,
    recentEntries: buildJournalContext(stats.entries),
    recentMessages,
    habitCompletionRate: stats.habitCompletionRate,
    productivityScore: stats.productivityScore,
  };
}

export async function semanticSearchJournals(userId, query) {
  const sanitized = sanitizeText(query, 200);
  if (!sanitized) return [];

  const entries = await JournalEntry.find({
    user: userId,
    $or: [
      { text: { $regex: sanitized, $options: 'i' } },
      { 'aiAnalysis.keywords': { $regex: sanitized, $options: 'i' } },
      { 'aiAnalysis.triggers': { $regex: sanitized, $options: 'i' } },
      { tags: { $regex: sanitized, $options: 'i' } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  if (entries.length > 0 || !isAiEnabled()) {
    return entries.map((e) => ({
      _id: e._id,
      text: e.text,
      emoji: e.emoji,
      mood: e.mood,
      createdAt: e.createdAt,
      aiAnalysis: e.aiAnalysis,
      relevance: 'keyword',
    }));
  }

  const allEntries = await JournalEntry.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('text emoji mood createdAt aiAnalysis tags')
    .lean();

  try {
    const result = await callOpenAIJson([
      {
        role: 'system',
        content: 'Given a search query and journal entries, return JSON: {"matchingIndices":[0,1]} with indices of relevant entries (max 10).',
      },
      {
        role: 'user',
        content: JSON.stringify({ query: sanitized, entries: allEntries.map((e, i) => ({ i, text: e.text.slice(0, 200), mood: e.mood?.name })) }),
      },
    ]);

    return (result.matchingIndices || [])
      .map((i) => allEntries[i])
      .filter(Boolean)
      .map((e) => ({ ...e, relevance: 'semantic' }));
  } catch {
    return entries;
  }
}
