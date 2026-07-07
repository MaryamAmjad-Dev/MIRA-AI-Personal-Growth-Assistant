import express from 'express';
import JournalEntry from '../models/JournalEntry.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { validateCreateEntry, validateUpdateEntry } from '../middleware/validateEntry.js';
import { entryWithLegacyEmoji } from '../constants/moodLibrary.js';
import { checkAchievements, updateUserMoodHistory, getUserStatsForAnalytics } from '../services/achievementService.js';
import { analyzeJournalEntry } from '../services/aiService.js';
import { updateUserMemory } from '../services/aiMemoryService.js';
import { syncDigitalTwin } from '../services/intelligence/digitalTwinService.js';

const mapEntries = (entries) => entries.map((e) => entryWithLegacyEmoji(e));

const router = express.Router();

function calculateStreak(sortedDateKeys) {
  if (!sortedDateKeys.length) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sortedDateKeys[0] !== today && sortedDateKeys[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDateKeys.length; i++) {
    const prev = new Date(sortedDateKeys[i - 1]);
    const curr = new Date(sortedDateKeys[i]);
    if ((prev - curr) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

function calculateLongestStreak(sortedDateKeys) {
  if (!sortedDateKeys.length) return 0;

  const asc = [...sortedDateKeys].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < asc.length; i++) {
    const prev = new Date(asc[i - 1]);
    const curr = new Date(asc[i]);
    if ((curr - prev) / 86400000 === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (asc[i] !== asc[i - 1]) {
      current = 1;
    }
  }
  return longest;
}

function buildUserFilter(userId, query) {
  const { search, emoji, tag, favorites } = query;
  const filter = { user: userId };

  if (emoji) {
    filter.$or = [{ emoji }, { 'mood.emoji': emoji }];
  }
  if (tag) filter.tags = tag;
  if (favorites === 'true') filter.isFavorite = true;

  if (search?.trim()) {
    filter.text = { $regex: search.trim(), $options: 'i' };
  }

  return filter;
}

router.use(protect);

router.get('/export', async (req, res, next) => {
  try {
    const format = req.query.format || 'json';
    const entries = await JournalEntry.find({ user: req.user._id })
      .select('emoji text intensity tags isFavorite createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      const header = 'date,emoji,intensity,tags,favorite,text\n';
      const rows = entries
        .map((e) => {
          const date = new Date(e.createdAt).toISOString();
          const tags = (e.tags || []).join('|');
          const text = `"${e.text.replace(/"/g, '""')}"`;
          return `${date},${e.emoji},${e.intensity},${tags},${e.isFavorite},${text}`;
        })
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=mira-export.csv');
      return res.send(header + rows);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=mira-export.json');
    return res.send(JSON.stringify({ exportedAt: new Date(), entries }, null, 2));
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userMatch = { user: userId };

    const [totalEntries, moodCounts, weeklyOverview, entryDates, monthlyOverview, intensityStats] =
      await Promise.all([
        JournalEntry.countDocuments(userMatch),
        JournalEntry.aggregate([
          { $match: userMatch },
          { $group: { _id: '$emoji', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        JournalEntry.aggregate([
          {
            $match: {
              ...userMatch,
              createdAt: { $gte: new Date(Date.now() - 7 * 86400000) },
            },
          },
          {
            $group: {
              _id: {
                day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                emoji: '$emoji',
              },
              count: { $sum: 1 },
              avgIntensity: { $avg: '$intensity' },
            },
          },
          { $sort: { '_id.day': 1 } },
        ]),
        JournalEntry.aggregate([
          { $match: userMatch },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
          { $sort: { _id: -1 } },
        ]),
        JournalEntry.aggregate([
          {
            $match: {
              ...userMatch,
              createdAt: { $gte: new Date(Date.now() - 30 * 86400000) },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
              avgIntensity: { $avg: '$intensity' },
              emoji: { $first: '$emoji' },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        JournalEntry.aggregate([
          { $match: userMatch },
          { $group: { _id: null, avgIntensity: { $avg: '$intensity' } } },
        ]),
      ]);

    const dateKeys = entryDates.map((d) => d._id);
    const streak = calculateStreak(dateKeys);
    const longestStreak = calculateLongestStreak(dateKeys);

    const categoryCounts = await JournalEntry.aggregate([
      { $match: userMatch },
      { $group: { _id: { $ifNull: ['$mood.category', 'neutral'] }, count: { $sum: 1 } } },
    ]);

    const positiveCount = categoryCounts.find((c) => c._id === 'positive')?.count || 0;
    const negativeCount = categoryCounts.find((c) => c._id === 'negative')?.count || 0;
    const neutralCount = categoryCounts.find((c) => c._id === 'neutral')?.count || 0;
    const totalMood = positiveCount + negativeCount + neutralCount || 1;

    const mostSelectedMood = moodCounts[0] || null;

    sendSuccess(res, {
      totalEntries,
      mostSelectedMood: mostSelectedMood
        ? { emoji: mostSelectedMood._id, count: mostSelectedMood.count }
        : null,
      moodCounts: moodCounts.map((m) => ({ emoji: m._id, count: m.count })),
      weeklyOverview: weeklyOverview.map((w) => ({
        date: w._id.day,
        emoji: w._id.emoji,
        count: w.count,
        avgIntensity: Math.round(w.avgIntensity * 10) / 10,
      })),
      monthlyOverview: monthlyOverview.map((m) => ({
        date: m._id,
        count: m.count,
        avgIntensity: Math.round(m.avgIntensity * 10) / 10,
        emoji: m.emoji,
      })),
      streak,
      longestStreak,
      averageIntensity: Math.round((intensityStats[0]?.avgIntensity || 0) * 10) / 10,
      moodRatio: {
        positive: Math.round((positiveCount / totalMood) * 100),
        negative: Math.round((negativeCount / totalMood) * 100),
        neutral: Math.round((neutralCount / totalMood) * 100),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/calendar', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) || new Date().getMonth() + 1;

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const days = await JournalEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          emoji: { $last: '$emoji' },
          avgIntensity: { $avg: '$intensity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendSuccess(res, days.map((d) => ({
      date: d._id,
      count: d.count,
      emoji: d.emoji,
      avgIntensity: Math.round(d.avgIntensity * 10) / 10,
    })));
  } catch (error) {
    next(error);
  }
});

router.get('/analytics/advanced', async (req, res, next) => {
  try {
    const stats = await getUserStatsForAnalytics(req.user._id);
    const yearlyMood = {};
    stats.entries.forEach((e) => {
      const month = new Date(e.createdAt).toLocaleString('en', { month: 'short' });
      if (!yearlyMood[month]) yearlyMood[month] = { positive: 0, negative: 0, neutral: 0 };
      yearlyMood[month][e.mood?.category || 'neutral']++;
    });
    sendSuccess(res, {
      yearlyMood: Object.entries(yearlyMood).map(([month, counts]) => ({ month, ...counts })),
      habitSuccessRate: stats.habitCompletionRate,
      moodVsHabits: stats.habits.map((h) => ({
        habit: h.title,
        completionRate: h.completedDates?.length
          ? Math.min(100, Math.round((h.completedDates.length / 30) * 100))
          : 0,
      })),
      productivityScore: stats.productivityScore,
      emotionalTrends: stats.entries.slice(0, 30).map((e) => ({
        date: e.createdAt,
        intensity: e.intensity,
        category: e.mood?.category,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filter = buildUserFilter(req.user._id, req.query);
    const entries = await JournalEntry.find(filter).sort({ createdAt: -1 }).lean();
    sendSuccess(res, mapEntries(entries));
  } catch (error) {
    next(error);
  }
});

router.get('/day/:date', async (req, res, next) => {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
      return sendError(res, 'Invalid date format. Use YYYY-MM-DD', 400);
    }

    const start = new Date(req.params.date);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);

    const entries = await JournalEntry.find({
      user: req.user._id,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, mapEntries(entries));
  } catch (error) {
    next(error);
  }
});

router.post('/', validateCreateEntry, async (req, res, next) => {
  try {
    let aiAnalysis;
    try {
      const analysis = await analyzeJournalEntry({
        text: req.body.text,
        emoji: req.body.mood?.emoji,
        mood: req.body.mood,
        intensity: req.body.intensity ?? 5,
      });
      aiAnalysis = analysis.aiAnalysis;
    } catch {
      /* analysis is optional — never block journal create */
    }

    const entry = await JournalEntry.create({
      ...req.body,
      user: req.user._id,
      ...(aiAnalysis ? { aiAnalysis } : {}),
    });
    await updateUserMoodHistory(req.user._id, entry.mood.emoji);
    req.user.addXp(15);
    await req.user.save();
    await checkAchievements(req.user._id);
    updateUserMemory(req.user._id).catch(() => {});
    syncDigitalTwin(req.user._id).catch(() => {});
    sendSuccess(res, entryWithLegacyEmoji(entry.toObject()), 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateUpdateEntry, async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!entry) return sendError(res, 'Entry not found', 404);

    sendSuccess(res, entryWithLegacyEmoji(entry));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/favorite', async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, user: req.user._id });

    if (!entry) return sendError(res, 'Entry not found', 404);

    entry.isFavorite = !entry.isFavorite;
    await entry.save();

    sendSuccess(res, entryWithLegacyEmoji(entry.toObject()));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) return sendError(res, 'Entry not found', 404);

    sendSuccess(res, { id: req.params.id, message: 'Entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
