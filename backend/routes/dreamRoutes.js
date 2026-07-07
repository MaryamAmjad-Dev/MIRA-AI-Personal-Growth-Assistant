import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { createDream, listDreams, getDreamPatterns, deleteDream } from '../services/intelligence/dreamService.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    sendSuccess(res, await listDreams(req.user._id));
  } catch (e) { next(e); }
});

router.get('/patterns', async (req, res, next) => {
  try {
    sendSuccess(res, await getDreamPatterns(req.user._id));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { dream, emotions, symbols, mood } = req.body;
    if (!dream?.trim()) return sendError(res, 'Dream description is required', 400);
    sendSuccess(res, await createDream(req.user._id, { dream, emotions, symbols, mood }), 201);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteDream(req.user._id, req.params.id);
    sendSuccess(res, { message: 'Dream deleted' });
  } catch (e) { next(e); }
});

export default router;
