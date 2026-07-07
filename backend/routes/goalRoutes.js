import express from 'express';
import Goal from '../models/Goal.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { awardBadge } from '../services/achievementService.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1 }).lean();
    sendSuccess(res, goals);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, type, deadline, milestones, color } = req.body;
    if (!title?.trim()) return sendError(res, 'Title is required', 400);

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      description: description || '',
      type: type || 'monthly',
      deadline,
      milestones: milestones || [],
      color: color || '#818cf8',
    });

    await awardBadge(req.user._id, 'first_goal');
    sendSuccess(res, goal, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!goal) return sendError(res, 'Goal not found', 404);
    sendSuccess(res, goal);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/milestones/:index', async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return sendError(res, 'Goal not found', 404);

    const idx = Number(req.params.index);
    if (goal.milestones[idx]) {
      goal.milestones[idx].completed = !goal.milestones[idx].completed;
      goal.milestones[idx].completedAt = goal.milestones[idx].completed ? new Date() : null;
    }

    const total = goal.milestones.length;
    const done = goal.milestones.filter((m) => m.completed).length;
    goal.progress = total ? Math.round((done / total) * 100) : goal.progress;

    await goal.save();
    sendSuccess(res, goal);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return sendError(res, 'Goal not found', 404);
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
