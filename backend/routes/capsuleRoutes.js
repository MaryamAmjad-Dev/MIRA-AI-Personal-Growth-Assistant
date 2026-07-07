import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { createCapsule, listCapsules, openCapsule, deleteCapsule } from '../services/intelligence/capsuleService.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    sendSuccess(res, await listCapsules(req.user._id));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, message, unlockDate } = req.body;
    if (!message?.trim() || !unlockDate) return sendError(res, 'Message and unlock date are required', 400);
    sendSuccess(res, await createCapsule(req.user._id, { title, message, unlockDate }), 201);
  } catch (e) { next(e); }
});

router.post('/:id/open', async (req, res, next) => {
  try {
    sendSuccess(res, await openCapsule(req.user._id, req.params.id));
  } catch (e) {
    if (e.message.includes('locked')) return sendError(res, e.message, 403);
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteCapsule(req.user._id, req.params.id);
    sendSuccess(res, { message: 'Capsule deleted' });
  } catch (e) { next(e); }
});

export default router;
