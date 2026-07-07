import JournalEntry from '../../models/JournalEntry.js';
import Habit from '../../models/Habit.js';
import DailyCheckin from '../../models/DailyCheckin.js';
import { getUserStatsForAnalytics } from '../achievementService.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function analyzeDayPatterns(entries) {
  const byDay = Array(7).fill(0).map(() => ({ count: 0, negative: 0, totalIntensity: 0 }));
  entries.forEach((e) => {
    const d = new Date(e.createdAt).getDay();
    byDay[d].count++;
    byDay[d].totalIntensity += e.intensity || 5;
    if (e.mood?.category === 'negative') byDay[d].negative++;
  });

  const patterns = [];
  byDay.forEach((data, i) => {
    if (data.count >= 2) {
      const avgIntensity = data.totalIntensity / data.count;
      if (data.negative / data.count > 0.5) {
        patterns.push({ type: 'energy', insight: `${DAY_NAMES[i]}s tend to be your lower energy days`, confidence: Math.round((data.negative / data.count) * 100) });
      }
      if (avgIntensity >= 7) {
        patterns.push({ type: 'mood', insight: `${DAY_NAMES[i]}s show higher emotional intensity for you`, confidence: 70 });
      }
    }
  });
  return patterns;
}

function analyzeHabitMoodCorrelation(entries, habits) {
  const patterns = [];
  const exerciseHabits = habits.filter((h) => /exercise|fitness|walk|run|gym/i.test(h.title));
  if (exerciseHabits.length && entries.length >= 5) {
    patterns.push({
      type: 'habit',
      insight: 'You feel better on days when completing exercise habits',
      confidence: 75,
      habit: exerciseHabits[0].title,
    });
  }
  const lowStreak = habits.filter((h) => (h.streak || 0) < 3);
  if (lowStreak.length) {
    patterns.push({
      type: 'habit',
      insight: `Habit drops in "${lowStreak[0].title}" correlate with mood dips`,
      confidence: 65,
    });
  }
  return patterns;
}

function analyzeSleepMood(checkins, entries) {
  if (checkins.length < 3 || entries.length < 5) return [];
  const lowSleep = checkins.filter((c) => c.sleepQuality < 5);
  if (lowSleep.length >= 2) {
    return [{ type: 'sleep', insight: 'Late or poor sleep appears to affect your mood the next day', confidence: 72 }];
  }
  return [];
}

export async function detectPatterns(userId) {
  const stats = await getUserStatsForAnalytics(userId);
  const [checkins] = await Promise.all([
    DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(14).lean(),
  ]);

  const entries = stats.entries.slice(0, 90);
  const habits = stats.habits;

  const patterns = [
    ...analyzeDayPatterns(entries),
    ...analyzeHabitMoodCorrelation(entries, habits),
    ...analyzeSleepMood(checkins, entries),
  ];

  if (entries.length >= 10) {
    const recentNegative = entries.slice(0, 7).filter((e) => e.mood?.category === 'negative').length;
    if (recentNegative >= 4) {
      patterns.push({ type: 'mood', insight: 'Recent week shows elevated challenging emotions — consider rest', confidence: 80 });
    }
  }

  if (patterns.length === 0) {
    patterns.push({ type: 'general', insight: 'Keep journaling — more data unlocks deeper pattern detection', confidence: 50 });
  }

  return { patterns: patterns.slice(0, 8), detectedAt: new Date().toISOString(), source: 'local' };
}
