import { getUserStatsForAnalytics } from '../achievementService.js';
import { getDigitalTwin } from './digitalTwinService.js';
import { isAiEnabled, callOpenAIJson } from '../ai/openaiClient.js';

function projectPath(stats, multiplier, label) {
  const months = [0, 1, 2, 3, 4, 5, 6];
  const baseMood = stats.entries.filter((e) => e.mood?.category === 'positive').length / Math.max(stats.entries.length, 1);
  const habitRate = stats.habitCompletionRate / 100;
  const goalProgress = stats.goals.reduce((s, g) => s + (g.progress || 0), 0) / Math.max(stats.goals.length, 1);

  const wellness = Math.min(100, (baseMood * 40 + habitRate * 30 + goalProgress * 0.3) * multiplier);

  return months.map((m) => ({
    month: m,
    label: m === 0 ? 'Now' : `${m}mo`,
    wellness: Math.round(Math.min(100, wellness + m * (multiplier > 1 ? 3 : -1))),
    mood: Math.round(Math.min(100, baseMood * 100 + m * (multiplier > 1 ? 2 : -2))),
    habits: Math.round(Math.min(100, habitRate * 100 + m * (multiplier > 1 ? 4 : -2))),
  }));
}

export async function simulateFutureSelf(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const twin = await getDigitalTwin(userId);

  const currentPath = projectPath(stats, 1, 'current');
  const improvedPath = projectPath(stats, 1.35, 'improved');

  let narrative = {
    currentSummary: 'If you continue at your current pace, expect gradual progress with occasional mood fluctuations.',
    improvedSummary: 'With 20% better habit consistency and regular journaling, your wellness trajectory improves significantly.',
    currentEndState: currentPath[6],
    improvedEndState: improvedPath[6],
  };

  if (isAiEnabled()) {
    try {
      narrative = await callOpenAIJson([
        { role: 'system', content: 'Return JSON: {"currentSummary":"","improvedSummary":""}' },
        { role: 'user', content: JSON.stringify({ twin: twin.personalityType, habitRate: stats.habitCompletionRate, goals: stats.goals.length }) },
      ]);
    } catch { /* local */ }
  }

  return {
    currentPath,
    improvedPath,
    ...narrative,
    horizon: '6 months',
    source: isAiEnabled() ? 'ai' : 'local',
  };
}
