import { getUserStatsForAnalytics } from '../achievementService.js';
import DailyCheckin from '../../models/DailyCheckin.js';

export async function getEmotionalDNA(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const entries = stats.entries.slice(0, 90);
  const checkins = await DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(30).lean();

  const emotionCounts = {};
  const triggers = new Set();
  let positive = 0;
  let negative = 0;
  let intensities = [];

  entries.forEach((e) => {
    if (e.mood?.category === 'positive') positive++;
    else if (e.mood?.category === 'negative') negative++;
    intensities.push(e.intensity || 5);
    (e.aiAnalysis?.emotions || []).forEach((em) => { emotionCounts[em] = (emotionCounts[em] || 0) + 1; });
    (e.aiAnalysis?.triggers || e.tags || []).forEach((t) => triggers.add(t));
    const moodName = e.mood?.name || 'unknown';
    emotionCounts[moodName] = (emotionCounts[moodName] || 0) + 1;
  });

  const total = Math.max(entries.length, 1);
  const avgIntensity = intensities.reduce((a, b) => a + b, 0) / Math.max(intensities.length, 1);
  const variance = intensities.length > 1
    ? intensities.reduce((s, v) => s + (v - avgIntensity) ** 2, 0) / intensities.length
    : 0;
  const stability = Math.max(0, Math.min(100, 100 - variance * 10));

  const dominantEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, ratio: Math.round((count / total) * 100) }));

  const avgRecovery = checkins.length
    ? checkins.reduce((s, c) => s + (10 - c.stressLevel), 0) / checkins.length * 10
    : 60;

  const radar = [
    { axis: 'Positivity', value: Math.round((positive / total) * 100) },
    { axis: 'Stability', value: Math.round(stability) },
    { axis: 'Energy', value: Math.round(avgIntensity * 10) },
    { axis: 'Recovery', value: Math.round(avgRecovery) },
    { axis: 'Awareness', value: Math.min(100, entries.length * 3) },
    { axis: 'Balance', value: Math.round(100 - Math.abs(positive - negative) / total * 100) },
  ];

  return {
    fingerprint: {
      dominantEmotions,
      emotionalStability: Math.round(stability),
      triggers: [...triggers].slice(0, 8),
      recoverySpeed: Math.round(avgRecovery),
      positivityRatio: Math.round((positive / total) * 100),
    },
    radar,
    source: 'local',
  };
}
