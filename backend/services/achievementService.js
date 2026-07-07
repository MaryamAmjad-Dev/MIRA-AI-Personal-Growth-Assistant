import JournalEntry from '../models/JournalEntry.js';
import Habit from '../models/Habit.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import UserBadge, { BADGE_DEFINITIONS } from '../models/Badge.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export async function awardBadge(userId, badgeKey) {
  const def = BADGE_DEFINITIONS.find((b) => b.key === badgeKey);
  if (!def) return null;

  const existing = await UserBadge.findOne({ user: userId, badgeKey });
  if (existing) return null;

  await UserBadge.create({ user: userId, badgeKey });
  const user = await User.findById(userId);
  if (user) {
    user.addXp(def.xpReward);
    await user.save();
  }

  await Notification.create({
    user: userId,
    type: 'achievement',
    title: `Badge Unlocked: ${def.title}`,
    message: def.description,
    link: '/profile',
  });

  return def;
}

export async function checkAchievements(userId) {
  const [entryCount, habitCount, goalCount, streakDates] = await Promise.all([
    JournalEntry.countDocuments({ user: userId }),
    Habit.countDocuments({ user: userId }),
    Goal.countDocuments({ user: userId }),
    JournalEntry.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
      { $sort: { _id: -1 } },
    ]),
  ]);

  const earned = [];

  if (entryCount >= 100) earned.push(await awardBadge(userId, 'entries_100'));
  if (habitCount >= 1) earned.push(await awardBadge(userId, 'first_habit'));
  if (goalCount >= 1) earned.push(await awardBadge(userId, 'first_goal'));

  const dateKeys = streakDates.map((d) => d._id);
  let streak = 0;
  const today = new Date().toISOString().split('Y')[0];
  if (dateKeys.length) {
    streak = 1;
    for (let i = 1; i < dateKeys.length; i++) {
      const prev = new Date(dateKeys[i - 1]);
      const curr = new Date(dateKeys[i]);
      if ((prev - curr) / 86400000 === 1) streak++;
      else break;
    }
  }
  if (streak >= 7) earned.push(await awardBadge(userId, 'streak_7'));

  return earned.filter(Boolean);
}

export async function updateUserMoodHistory(userId, moodEmoji) {
  const user = await User.findById(userId);
  if (!user) return;

  const recent = [moodEmoji, ...(user.recentMoods || []).filter((m) => m !== moodEmoji)].slice(0, 10);
  user.recentMoods = recent;
  await user.save();
}

export async function getUserStatsForAnalytics(userId) {
  const [entries, habits, tasks, goals] = await Promise.all([
    JournalEntry.find({ user: userId }).sort({ createdAt: -1 }).limit(365).lean(),
    Habit.find({ user: userId }).lean(),
    Task.find({ user: userId }).lean(),
    Goal.find({ user: userId }).lean(),
  ]);

  const habitCompletionRate = habits.length
    ? Math.round(
        (habits.reduce((s, h) => s + (h.completedDates?.length || 0), 0) /
          (habits.length * 30)) *
          100
      )
    : 0;

  const tasksDone = tasks.filter((t) => t.status === 'done').length;
  const productivityScore = tasks.length ? Math.round((tasksDone / tasks.length) * 100) : 0;

  return { entries, habits, tasks, goals, habitCompletionRate, productivityScore };
}
