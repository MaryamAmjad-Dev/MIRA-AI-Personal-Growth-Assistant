import express from 'express';
import CustomMood from '../models/CustomMood.js';
import User from '../models/User.js';
import { MOOD_LIBRARY } from '../constants/moodLibrary.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/library', (_req, res) => {
  sendSuccess(res, MOOD_LIBRARY);
});

router.use(protect);

router.get('/custom', async (req, res, next) => {
  try {
    const moods = await CustomMood.find({ user: req.user._id }).lean();
    sendSuccess(res, moods);
  } catch (error) {
    next(error);
  }
});

router.post('/custom', async (req, res, next) => {
  try {
    const { emoji, name, category, color } = req.body;
    if (!emoji || !name || !category) return sendError(res, 'emoji, name, category required', 400);

    const mood = await CustomMood.create({
      user: req.user._id,
      emoji,
      name: name.toLowerCase(),
      category,
      color: color || '#818cf8',
    });

    sendSuccess(res, mood, 201);
  } catch (error) {
    next(error);
  }
});

router.delete('/custom/:id', async (req, res, next) => {
  try {
    await CustomMood.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

router.post('/favorites/:emoji', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const emoji = decodeURIComponent(req.params.emoji);
    const favs = user.favoriteMoods || [];

    if (favs.includes(emoji)) {
      user.favoriteMoods = favs.filter((e) => e !== emoji);
    } else {
      user.favoriteMoods = [...favs, emoji];
    }

    await user.save();
    sendSuccess(res, user.favoriteMoods);
  } catch (error) {
    next(error);
  }
});

export default router;
