import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import JournalEntry from '../models/JournalEntry.js';
import Habit from '../models/Habit.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import CustomMood from '../models/CustomMood.js';
import UserBadge from '../models/Badge.js';
import Notification from '../models/Notification.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { applyAvatarPayload, normalizeAvatarPayload } from '../utils/userAvatar.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarDir = path.join(__dirname, '../uploads/avatar');

if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WebP images are allowed'));
  },
});

function saveBase64Avatar(dataUrl) {
  const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i);
  if (!match) return null;

  const ext = match[1] === 'jpg' ? '.jpg' : `.${match[1].toLowerCase()}`;
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 5 * 1024 * 1024) return null;

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  fs.writeFileSync(path.join(avatarDir, filename), buffer);
  return `/uploads/avatar/${filename}`;
}

const router = express.Router();
router.use(protect);

router.post('/avatar', avatarUpload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded', 400);
    req.user.avatar = `/uploads/avatar/${req.file.filename}`;
    req.user.avatarConfig = null;
    req.user.avatarType = 'upload';
    await req.user.save();
    sendSuccess(res, { user: req.user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const { name, bio, timezone, avatar, avatarType, language, gender, avatarConfig, preferences } = req.body;

    if (name?.trim()) req.user.name = name.trim();
    if (bio !== undefined) req.user.bio = bio;
    if (timezone) req.user.timezone = timezone;

    if (avatar && typeof avatar === 'object' && !Array.isArray(avatar)) {
      const payload = { ...avatar };
      if (payload.image && typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
        const savedPath = saveBase64Avatar(payload.image);
        if (!savedPath) return sendError(res, 'Invalid image data', 400);
        payload.image = savedPath;
        payload.type = 'upload';
        payload.config = null;
      }
      const normalized = normalizeAvatarPayload(payload, req.user);
      applyAvatarPayload(req.user, normalized || payload);
    } else if (avatar !== undefined) {
      if (typeof avatar === 'string' && avatar.startsWith('data:image')) {
        const savedPath = saveBase64Avatar(avatar);
        if (!savedPath) return sendError(res, 'Invalid image data', 400);
        req.user.avatar = savedPath;
        req.user.avatarConfig = null;
        req.user.avatarType = 'upload';
      } else {
        req.user.avatar = avatar;
      }
    }

    if (avatarType && ['male', 'female', 'custom', 'upload'].includes(avatarType)) {
      req.user.avatarType = avatarType;
    }

    if (gender && ['male', 'female', 'other'].includes(gender)) {
      req.user.gender = gender;
    }

    if (avatarConfig !== undefined) {
      req.user.avatarConfig = avatarConfig;
      req.user.markModified('avatarConfig');
    }

    if (language) req.user.language = language.split('-')[0];

    if (preferences) {
      req.user.preferences = { ...req.user.preferences, ...preferences };
      req.user.markModified('preferences');
    }

    await req.user.save();
    sendSuccess(res, { user: req.user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
});

router.put('/password', async (req, res, next) => {
  try {
    if (req.user.provider === 'google') {
      return sendError(res, 'Google accounts manage passwords through Google', 400);
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return sendError(res, 'Current and new password are required', 400);
    if (newPassword.length < 8) return sendError(res, 'New password must be at least 8 characters', 400);

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) return sendError(res, 'Current password is incorrect', 401);

    user.password = newPassword;
    await user.save();
    sendSuccess(res, { message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/account', async (req, res, next) => {
  try {
    if (req.user.provider === 'local') {
      const { password } = req.body;
      if (!password) return sendError(res, 'Password is required to delete account', 400);

      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(password))) return sendError(res, 'Incorrect password', 401);
    }

    const uid = req.user._id;
    await Promise.all([
      JournalEntry.deleteMany({ user: uid }),
      Habit.deleteMany({ user: uid }),
      Task.deleteMany({ user: uid }),
      Goal.deleteMany({ user: uid }),
      CustomMood.deleteMany({ user: uid }),
      UserBadge.deleteMany({ user: uid }),
      Notification.deleteMany({ user: uid }),
    ]);
    await User.findByIdAndDelete(uid);
    sendSuccess(res, { message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
