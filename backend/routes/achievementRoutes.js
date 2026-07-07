import express from 'express';
import Notification from '../models/Notification.js';
import UserBadge, { BADGE_DEFINITIONS } from '../models/Badge.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { checkAchievements } from '../services/achievementService.js';

const router = express.Router();
router.use(protect);

router.get('/badges', async (req, res, next) => {
  try {
    const earned = await UserBadge.find({ user: req.user._id }).lean();
    const earnedKeys = new Set(earned.map((b) => b.badgeKey));

    sendSuccess(res, {
      definitions: BADGE_DEFINITIONS,
      earned: earned.map((b) => ({
        ...BADGE_DEFINITIONS.find((d) => d.key === b.badgeKey),
        earnedAt: b.earnedAt,
      })),
      locked: BADGE_DEFINITIONS.filter((d) => !earnedKeys.has(d.key)),
      xp: req.user.xp,
      level: req.user.level,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/check', async (req, res, next) => {
  try {
    const newBadges = await checkAchievements(req.user._id);
    sendSuccess(res, newBadges);
  } catch (error) {
    next(error);
  }
});

router.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
});

router.patch('/notifications/:id/read', async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }
    );
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
});

router.patch('/notifications/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    sendSuccess(res, { message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
});

export default router;
