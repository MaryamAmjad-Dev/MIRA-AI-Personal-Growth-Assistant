import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { getDigitalTwin, askDigitalTwin, getPersonalityEvolution, syncDigitalTwin } from '../services/intelligence/digitalTwinService.js';
import { detectPatterns } from '../services/intelligence/patternEngine.js';
import { calculateLifeScore, getLifeScoreHistory } from '../services/intelligence/lifeScoreEngine.js';
import { getEmotionalDNA } from '../services/intelligence/emotionalDNAEngine.js';
import { simulateFutureSelf } from '../services/intelligence/futureSelfEngine.js';
import { analyzeDecision } from '../services/intelligence/decisionAssistant.js';
import { detectBurnout } from '../services/intelligence/burnoutEngine.js';
import { getMoodMusicForUser } from '../services/intelligence/moodMusicEngine.js';
import { getSmartNotifications } from '../services/intelligence/smartNotificationEngine.js';
import { generatePersonalityReport, personalityReportToHtml } from '../services/intelligence/personalityReportEngine.js';
import { buildLifeTimeline } from '../services/intelligence/timelineEngine.js';
import { getRequestLanguage } from '../utils/requestLanguage.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const twin = await getDigitalTwin(req.user._id);
    sendSuccess(res, twin);
  } catch (e) { next(e); }
});

router.post('/sync', async (req, res, next) => {
  try {
    sendSuccess(res, await syncDigitalTwin(req.user._id));
  } catch (e) { next(e); }
});

router.post('/ask', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question?.trim()) return sendError(res, 'Question is required', 400);
    sendSuccess(res, await askDigitalTwin(req.user._id, question.trim(), getRequestLanguage(req)));
  } catch (e) { next(e); }
});

router.get('/evolution', async (req, res, next) => {
  try {
    sendSuccess(res, await getPersonalityEvolution(req.user._id));
  } catch (e) { next(e); }
});

router.get('/patterns', async (req, res, next) => {
  try {
    sendSuccess(res, await detectPatterns(req.user._id));
  } catch (e) { next(e); }
});

router.get('/life-score', async (req, res, next) => {
  try {
    sendSuccess(res, await calculateLifeScore(req.user._id));
  } catch (e) { next(e); }
});

router.get('/life-score/history', async (req, res, next) => {
  try {
    sendSuccess(res, await getLifeScoreHistory(req.user._id));
  } catch (e) { next(e); }
});

router.get('/emotional-dna', async (req, res, next) => {
  try {
    sendSuccess(res, await getEmotionalDNA(req.user._id));
  } catch (e) { next(e); }
});

router.get('/future-self', async (req, res, next) => {
  try {
    sendSuccess(res, await simulateFutureSelf(req.user._id));
  } catch (e) { next(e); }
});

router.post('/decision', async (req, res, next) => {
  try {
    const { optionA, optionB, context } = req.body;
    if (!optionA?.trim() || !optionB?.trim()) return sendError(res, 'Both options are required', 400);
    sendSuccess(res, await analyzeDecision(req.user._id, { optionA, optionB, context }, getRequestLanguage(req)));
  } catch (e) { next(e); }
});

router.get('/burnout', async (req, res, next) => {
  try {
    sendSuccess(res, await detectBurnout(req.user._id));
  } catch (e) { next(e); }
});

router.get('/mood-music', async (req, res, next) => {
  try {
    sendSuccess(res, await getMoodMusicForUser(req.user._id));
  } catch (e) { next(e); }
});

router.get('/smart-notifications', async (req, res, next) => {
  try {
    sendSuccess(res, await getSmartNotifications(req.user._id));
  } catch (e) { next(e); }
});

router.post('/personality-report', async (req, res, next) => {
  try {
    const report = await generatePersonalityReport(req.user._id);
    if (req.body.format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(personalityReportToHtml(report));
    }
    sendSuccess(res, report);
  } catch (e) { next(e); }
});

router.get('/timeline', async (req, res, next) => {
  try {
    sendSuccess(res, await buildLifeTimeline(req.user._id));
  } catch (e) { next(e); }
});

export default router;
