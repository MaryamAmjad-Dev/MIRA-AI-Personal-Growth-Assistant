import express from 'express';
import Habit from '../models/Habit.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { awardBadge } from '../services/achievementService.js';

const router = express.Router();
router.use(protect);

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function calcStreak(dates) {
  if (!dates.length) return 0;
  const sorted = [...dates].sort((a, b) => b.localeCompare(a));
  const today = todayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    if ((prev - curr) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

router.get('/', async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    const enriched = habits.map((h) => ({
      ...h,
      streak: calcStreak(h.completedDates || []),
      completionRate: h.completedDates?.length
        ? Math.min(100, Math.round((h.completedDates.length / 30) * 100))
        : 0,
    }));
    sendSuccess(res, enriched);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, icon, category, frequency, target, reminderTime, color } = req.body;
    if (!title?.trim()) return sendError(res, 'Title is required', 400);

    const habit = await Habit.create({
      user: req.user._id,
      title: title.trim(),
      icon: icon || '✅',
      category: category || 'health',
      frequency: frequency || 'daily',
      target: target || 1,
      reminderTime: reminderTime || '',
      color: color || '#818cf8',
    });

    await awardBadge(req.user._id, 'first_habit');
    sendSuccess(res, habit, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!habit) return sendError(res, 'Habit not found', 404);
    sendSuccess(res, habit);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return sendError(res, 'Habit not found', 404);
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/complete', async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return sendError(res, 'Habit not found', 404);

    const key = todayKey();
    if (!habit.completedDates.includes(key)) {
      habit.completedDates.push(key);
    } else {
      habit.completedDates = habit.completedDates.filter((d) => d !== key);
    }

    habit.streak = calcStreak(habit.completedDates);
    await habit.save();

    req.user.addXp(10);
    await req.user.save();

    sendSuccess(res, habit);
  } catch (error) {
    next(error);
  }
});

export default router;
