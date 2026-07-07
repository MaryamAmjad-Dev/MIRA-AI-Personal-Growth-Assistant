import JournalEntry from '../../models/JournalEntry.js';
import Habit from '../../models/Habit.js';
import { getDigitalTwin } from './digitalTwinService.js';
import { detectBurnout } from './burnoutEngine.js';

export async function getSmartNotifications(userId) {
  const now = new Date();
  const hour = now.getHours();
  const notifications = [];

  const [latestEntry, habits, twin, burnout] = await Promise.all([
    JournalEntry.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    Habit.find({ user: userId }).lean(),
    getDigitalTwin(userId).catch(() => null),
    detectBurnout(userId),
  ]);

  const daysSinceJournal = latestEntry
    ? (now - new Date(latestEntry.createdAt)) / 86400000
    : 999;

  if (hour >= 19 && hour <= 23 && daysSinceJournal >= 1) {
    notifications.push({
      type: 'journal',
      message: 'You usually reflect at night — want to journal?',
      action: '/journal',
      priority: 'medium',
    });
  }

  if (hour >= 6 && hour <= 10) {
    const incomplete = habits.filter((h) => {
      const today = now.toISOString().split('T')[0];
      return !(h.completedDates || []).includes(today);
    });
    if (incomplete.length > 0) {
      notifications.push({
        type: 'habit',
        message: `${incomplete.length} habit${incomplete.length > 1 ? 's' : ''} waiting — small wins compound`,
        action: '/habits',
        priority: 'low',
      });
    }
  }

  if (burnout.level === 'High') {
    notifications.push({
      type: 'wellness',
      message: 'Your twin detected burnout risk — consider a rest day',
      action: '/twin',
      priority: 'high',
    });
  }

  if (twin?.repeatedPatterns?.[0]) {
    notifications.push({
      type: 'insight',
      message: `Pattern detected: ${twin.repeatedPatterns[0]}`,
      action: '/analytics',
      priority: 'medium',
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      type: 'motivation',
      message: 'Your AI twin is learning — keep journaling for deeper insights',
      action: '/twin',
      priority: 'low',
    });
  }

  return { notifications, generatedAt: now.toISOString(), source: 'ai' };
}
