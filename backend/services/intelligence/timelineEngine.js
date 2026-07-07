import JournalEntry from '../../models/JournalEntry.js';
import Goal from '../../models/Goal.js';
import UserBadge from '../../models/Badge.js';
import TimeCapsule from '../../models/TimeCapsule.js';

export async function buildLifeTimeline(userId) {
  const [entries, goals, badges, capsules] = await Promise.all([
    JournalEntry.find({ user: userId }).sort({ createdAt: -1 }).limit(50).lean(),
    Goal.find({ user: userId, progress: 100 }).sort({ updatedAt: -1 }).limit(10).lean(),
    UserBadge.find({ user: userId }).sort({ earnedAt: -1 }).limit(10).lean(),
    TimeCapsule.find({ user: userId, openedAt: { $exists: true } }).sort({ openedAt: -1 }).limit(5).lean(),
  ]);

  const events = [];

  entries.forEach((e) => {
    if (e.isFavorite || e.intensity >= 8) {
      events.push({
        type: 'mood',
        date: e.createdAt,
        title: e.isFavorite ? 'Favorite moment' : 'High intensity entry',
        description: e.text?.slice(0, 120),
        emoji: e.emoji || e.mood?.emoji,
        mood: e.mood?.category,
      });
    }
  });

  goals.forEach((g) => {
    events.push({
      type: 'goal',
      date: g.updatedAt,
      title: `Goal completed: ${g.title}`,
      description: g.description?.slice(0, 100) || '',
    });
  });

  badges.forEach((b) => {
    events.push({
      type: 'achievement',
      date: b.earnedAt,
      title: `Badge earned: ${b.badgeKey}`,
      description: '',
    });
  });

  capsules.forEach((c) => {
    events.push({
      type: 'capsule',
      date: c.openedAt,
      title: `Time capsule opened: ${c.title}`,
      description: c.message?.slice(0, 80) + '...',
    });
  });

  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 40);
}
