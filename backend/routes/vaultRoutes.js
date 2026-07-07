import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { createVaultEntry, listVaultEntries, unlockVaultEntry, deleteVaultEntry } from '../services/intelligence/vaultService.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    sendSuccess(res, await listVaultEntries(req.user._id));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, content, passphrase } = req.body;
    if (!content?.trim() || !passphrase) return sendError(res, 'Content and passphrase are required', 400);
    sendSuccess(res, await createVaultEntry(req.user._id, { title, content, passphrase }), 201);
  } catch (e) { next(e); }
});

router.post('/:id/unlock', async (req, res, next) => {
  try {
    const { passphrase } = req.body;
    if (!passphrase) return sendError(res, 'Passphrase is required', 400);
    sendSuccess(res, await unlockVaultEntry(req.user._id, req.params.id, passphrase));
  } catch (e) {
    if (e.message.includes('passphrase')) return sendError(res, e.message, 401);
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteVaultEntry(req.user._id, req.params.id);
    sendSuccess(res, { message: 'Vault entry deleted' });
  } catch (e) { next(e); }
});

export default router;
