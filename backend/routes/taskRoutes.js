import express from 'express';
import Task from '../models/Task.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ order: 1, dueDate: 1 }).lean();
    sendSuccess(res, tasks);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, priority, status, dueDate, category } = req.body;
    if (!title?.trim()) return sendError(res, 'Title is required', 400);

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate || null,
      category: category || 'general',
    });

    sendSuccess(res, task, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!task) return sendError(res, 'Task not found', 404);
    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return sendError(res, 'Task not found', 404);
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

export default router;
