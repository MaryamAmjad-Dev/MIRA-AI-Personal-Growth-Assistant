import express from 'express';
import { analyzeJournalEntry } from '../services/aiService.js';
import {
  getWeeklySummary,
  getRecommendations,
  chatWithCoach,
  explainMood,
  getChatHistory,
  clearChatHistory,
  getMoodPrediction,
  getHabitInsights,
  getGoalInsights,
  submitDailyCheckin,
  getDailyCheckin,
  getDashboardInsights,
  aiSearch,
  generateReport,
  writingAssist,
  reportToHtml,
} from '../services/aiCoachService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { awardBadge } from '../services/achievementService.js';
import { sanitizeText } from '../services/ai/promptBuilder.js';
import { detectPatterns } from '../services/intelligence/patternEngine.js';
import { getRequestLanguage } from '../utils/requestLanguage.js';

const router = express.Router();
router.use(protect);

router.post('/analyze', async (req, res, next) => {
  try {
    const { text, emoji, mood, intensity } = req.body;
    if (!text?.trim()) return sendError(res, 'Journal text is required for analysis', 400);

    const analysis = await analyzeJournalEntry({
      text: text.trim(),
      emoji: mood?.emoji || emoji,
      mood,
      intensity: intensity ?? 5,
    });

    sendSuccess(res, analysis);
  } catch (error) {
    next(error);
  }
});

router.post('/writing', async (req, res, next) => {
  try {
    const { action, text, mood, intensity } = req.body;
    if (!action) return sendError(res, 'Action is required', 400);
    const result = await writingAssist(action, { text: text?.trim(), mood, intensity: intensity ?? 5 });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
});

router.get('/summary', async (req, res, next) => {
  try {
    sendSuccess(res, await getWeeklySummary(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/recommendations', async (req, res, next) => {
  try {
    sendSuccess(res, await getRecommendations(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return sendError(res, 'Message is required', 400);
    const lang = getRequestLanguage(req);
    const result = await chatWithCoach(req.user._id, sanitizeText(message.trim(), 2000), lang);
    await awardBadge(req.user._id, 'coach_chat');
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    sendSuccess(res, await getChatHistory(req.user._id));
  } catch (error) {
    next(error);
  }
});

router.delete('/history', async (req, res, next) => {
  try {
    sendSuccess(res, await clearChatHistory(req.user._id));
  } catch (error) {
    next(error);
  }
});

router.get('/explain-mood', async (req, res, next) => {
  try {
    sendSuccess(res, await explainMood(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/prediction', async (req, res, next) => {
  try {
    sendSuccess(res, await getMoodPrediction(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/habit-insights', async (req, res, next) => {
  try {
    sendSuccess(res, await getHabitInsights(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/goal-insights', async (req, res, next) => {
  try {
    sendSuccess(res, await getGoalInsights(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/checkin', async (req, res, next) => {
  try {
    sendSuccess(res, await getDailyCheckin(req.user._id));
  } catch (error) {
    next(error);
  }
});

router.post('/checkin', async (req, res, next) => {
  try {
    const { feeling, sleepQuality, energyLevel, stressLevel, todayGoal } = req.body;
    const checkin = await submitDailyCheckin(req.user._id, {
      feeling: sanitizeText(feeling, 500),
      sleepQuality,
      energyLevel,
      stressLevel,
      todayGoal: sanitizeText(todayGoal, 300),
    });
    sendSuccess(res, checkin, 201);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', async (req, res, next) => {
  try {
    sendSuccess(res, await getDashboardInsights(req.user._id, getRequestLanguage(req)));
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return sendError(res, 'Search query is required', 400);
    sendSuccess(res, await aiSearch(req.user._id, q.trim()));
  } catch (error) {
    next(error);
  }
});

router.get('/patterns', async (req, res, next) => {
  try {
    sendSuccess(res, await detectPatterns(req.user._id));
  } catch (error) {
    next(error);
  }
});

router.post('/report', async (req, res, next) => {
  try {
    const period = req.body.period === 'monthly' ? 'monthly' : 'weekly';
    const report = await generateReport(req.user._id, period);

    if (req.body.format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(reportToHtml(report));
    }

    sendSuccess(res, report);
  } catch (error) {
    next(error);
  }
});

export default router;
