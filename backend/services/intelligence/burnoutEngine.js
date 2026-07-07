import { getUserStatsForAnalytics } from '../achievementService.js';
import DailyCheckin from '../../models/DailyCheckin.js';

const STRESS_WORDS = ['exhausted', 'burnout', 'overwhelm', 'drained', 'tired', 'stress', 'anxious'];

export async function detectBurnout(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const checkins = await DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(14).lean();
  const entries = stats.entries.slice(0, 21);

  let score = 0;
  const signals = [];

  const recentNegative = entries.slice(0, 7).filter((e) => e.mood?.category === 'negative').length;
  if (recentNegative >= 4) { score += 30; signals.push('Elevated negative moods this week'); }

  const avgStress = checkins.length
    ? checkins.reduce((s, c) => s + c.stressLevel, 0) / checkins.length
    : 5;
  if (avgStress >= 7) { score += 25; signals.push('High stress levels in check-ins'); }

  if (stats.habitCompletionRate < 35) { score += 20; signals.push('Habit completion has dropped'); }

  const stressLanguage = entries.filter((e) =>
    STRESS_WORDS.some((w) => e.text?.toLowerCase().includes(w))
  ).length;
  if (stressLanguage >= 3) { score += 25; signals.push('Burnout language detected in journals'); }

  let level = 'Low';
  if (score >= 60) level = 'High';
  else if (score >= 30) level = 'Medium';

  return {
    level,
    score: Math.min(100, score),
    signals,
    recommendation: level === 'High'
      ? 'Prioritize rest, reduce commitments, and consider talking to someone you trust.'
      : level === 'Medium'
        ? 'Watch your energy — small breaks and habit simplification can help.'
        : 'Burnout risk is low. Maintain your current balance.',
    source: 'local',
  };
}
