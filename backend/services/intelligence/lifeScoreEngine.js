import LifeScore from '../../models/LifeScore.js';
import { getUserStatsForAnalytics } from '../achievementService.js';
import DailyCheckin from '../../models/DailyCheckin.js';
import { isAiEnabled, callOpenAIText } from '../ai/openaiClient.js';

function computeScores(stats, checkins) {
  const entries = stats.entries;
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const total = Math.max(entries.length, 1);

  const mentalHealth = Math.round((positive / total) * 70 + (checkins[0]?.wellnessScore || 50) * 0.3);
  const productivity = stats.productivityScore || 50;
  const consistency = stats.habitCompletionRate || 40;
  const growth = Math.min(100, (stats.goals.filter((g) => g.progress > 50).length / Math.max(stats.goals.length, 1)) * 100 + entries.length);
  const balance = Math.round((mentalHealth + productivity + consistency) / 3);

  const overall = Math.round((mentalHealth * 0.3 + productivity * 0.2 + consistency * 0.2 + growth * 0.15 + balance * 0.15));

  return {
    overall: Math.min(100, overall),
    mentalHealth: Math.min(100, mentalHealth),
    productivity: Math.min(100, productivity),
    consistency: Math.min(100, consistency),
    growth: Math.min(100, growth),
    balance: Math.min(100, balance),
  };
}

export async function calculateLifeScore(userId) {
  const date = new Date().toISOString().split('T')[0];
  const stats = await getUserStatsForAnalytics(userId);
  const checkins = await DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(7).lean();

  const previous = await LifeScore.findOne({ user: userId }).sort({ date: -1 }).lean();
  const scores = computeScores(stats, checkins);

  let explanation = `Overall ${scores.overall}/100. Mental health ${scores.mentalHealth}, consistency ${scores.consistency}%.`;
  if (previous) {
    const diff = scores.overall - previous.overall;
    explanation = diff > 0
      ? `Score up ${diff} points — stronger habits and mood balance drove the increase.`
      : diff < 0
        ? `Score down ${Math.abs(diff)} points — mood dips or missed habits may be factors.`
        : 'Score stable — maintaining your current rhythm.';
  }

  if (isAiEnabled()) {
    try {
      explanation = await callOpenAIText(
        'Explain life score changes in 2 sentences.',
        JSON.stringify({ scores, previous: previous?.overall, habits: stats.habitCompletionRate })
      );
    } catch { /* keep local */ }
  }

  const record = await LifeScore.findOneAndUpdate(
    { user: userId, date },
    { user: userId, date, ...scores, explanation, previousOverall: previous?.overall },
    { upsert: true, new: true }
  );

  return record;
}

export async function getLifeScoreHistory(userId, days = 14) {
  return LifeScore.find({ user: userId }).sort({ date: -1 }).limit(days).lean();
}
