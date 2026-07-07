import AIConversation from '../models/AIConversation.js';
import DailyCheckin from '../models/DailyCheckin.js';
import JournalEntry from '../models/JournalEntry.js';
import { awardBadge } from './achievementService.js';
import { getUserContext, updateUserMemory, semanticSearchJournals } from './aiMemoryService.js';
import { analyzeJournalDeep, writingAssist } from './ai/sentimentEngine.js';
import { generateWellnessReport, reportToHtml } from './ai/reportGenerator.js';
import { isAiEnabled, callOpenAIText, callOpenAIJson } from './ai/openaiClient.js';
import { buildCoachSystemPrompt, sanitizeText } from './ai/promptBuilder.js';
import { getLanguageInstruction } from './languageHelper.js';
import { getUserStatsForAnalytics } from './achievementService.js';
import { getLocalAIResponse } from './localAIService.js';

function buildLocalSummary(stats) {
  const { entries, habits, goals, habitCompletionRate, productivityScore } = stats;
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const negative = entries.filter((e) => e.mood?.category === 'negative').length;

  return {
    weeklySummary: `This week you logged ${entries.length} entries. Mood trend: ${positive} positive, ${negative} challenging moments.`,
    reflectionQuestions: ['What moment this week made you feel most alive?', 'What pattern do you notice in your moods?', 'What small win can you celebrate today?'],
    habitRecommendations: habits.length < 3 ? ['Start with one daily hydration habit', 'Add a 5-minute meditation habit'] : [`Habit completion: ${habitCompletionRate}% — focus on lowest streak`],
    productivitySuggestions: [productivityScore < 50 ? 'Break tasks into 15-minute blocks' : 'Maintain your momentum'],
    growthInsights: [`${goals.length} active goals`, `Productivity: ${productivityScore}%`],
    moodExplanation: positive > negative ? 'Recent entries suggest an upward trend.' : 'Recent entries show some challenges — journaling helps.',
    source: 'local',
  };
}

export async function getWeeklySummary(userId, language = 'en') {
  const stats = await getUserStatsForAnalytics(userId);
  const context = await getUserContext(userId);
  const langNote = getLanguageInstruction(language);

  if (isAiEnabled()) {
    try {
      const content = await callOpenAIJson([
        { role: 'system', content: `Wellness coach. ${langNote} Return JSON: {"weeklySummary":"","reflectionQuestions":[],"habitRecommendations":[],"productivitySuggestions":[],"growthInsights":[],"moodExplanation":""}` },
        { role: 'user', content: JSON.stringify({ entries: context.recentEntries, habits: stats.habits, memory: context.memoryContext }) },
      ]);
      return { ...content, source: 'ai' };
    } catch { /* fallback */ }
  }
  return buildLocalSummary(stats);
}

export async function getRecommendations(userId, language = 'en') {
  const summary = await getWeeklySummary(userId, language);
  return { habits: summary.habitRecommendations, productivity: summary.productivitySuggestions, growth: summary.growthInsights, reflections: summary.reflectionQuestions };
}

export async function chatWithCoach(userId, message, language = 'en') {
  const safeMessage = sanitizeText(message, 2000);
  const context = await getUserContext(userId);

  let conversation = await AIConversation.findOne({ user: userId });
  if (!conversation) {
    conversation = await AIConversation.create({ user: userId, messages: [] });
  }

  conversation.addMessage('user', safeMessage);

  let reply;
  let source = 'local';

  if (isAiEnabled()) {
    try {
      const history = conversation.messages.slice(-8).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      reply = await callOpenAIText(
        buildCoachSystemPrompt(context.memoryContext, language),
        `Journal context: ${JSON.stringify(context.recentEntries.slice(0, 5))}\n\nConversation:\n${history.map((m) => `${m.role}: ${m.content}`).join('\n')}\n\nRespond to the latest user message.`
      );
      source = 'ai';
    } catch {
      ({ reply } = await getLocalAIResponse(userId, safeMessage, language));
    }
  } else {
    ({ reply } = await getLocalAIResponse(userId, safeMessage, language));
  }

  conversation.addMessage('assistant', reply);
  await conversation.save();
  await updateUserMemory(userId).catch(() => {});

  return { reply, source };
}

export async function getChatHistory(userId) {
  const conversation = await AIConversation.findOne({ user: userId }).lean();
  return conversation?.messages || [];
}

export async function clearChatHistory(userId) {
  await AIConversation.findOneAndUpdate({ user: userId }, { messages: [] }, { upsert: true });
  return { message: 'Chat history cleared' };
}

export async function explainMood(userId, language = 'en') {
  const latest = await JournalEntry.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
  if (!latest) return { explanation: 'Log a journal entry first to get mood insights.' };

  const mood = latest.mood?.name || 'unknown';
  if (isAiEnabled()) {
    try {
      const reply = await callOpenAIText(
        `Empathetic wellness coach. Be concise. ${getLanguageInstruction(language)}`,
        `Mood: ${mood}. Journal: ${latest.text}. Explain why and offer 2 coping strategies.`
      );
      return { explanation: reply, mood, source: 'ai' };
    } catch { /* fallback */ }
  }
  return { explanation: `Feeling "${mood}" often connects to recent experiences. Consider rest, movement, or talking to someone you trust.`, mood, source: 'local' };
}

export async function getMoodPrediction(userId, language = 'en') {
  const context = await getUserContext(userId);
  const entries = context.stats.entries.slice(0, 30);
  const checkins = await DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(7).lean();

  const avgSleep = checkins.length ? checkins.reduce((s, c) => s + c.sleepQuality, 0) / checkins.length : 6;
  const avgStress = checkins.length ? checkins.reduce((s, c) => s + c.stressLevel, 0) / checkins.length : 5;
  const positiveRate = entries.filter((e) => e.mood?.category === 'positive').length / Math.max(entries.length, 1);
  const journalFreq = entries.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 7 * 86400000)).length;

  let predictedMood = 'neutral';
  let confidence = 60;
  const reasons = [];
  const suggestions = [];

  if (positiveRate > 0.5) { predictedMood = 'positive'; confidence += 15; reasons.push('Recent mood trend is mostly positive'); }
  else if (positiveRate < 0.3) { predictedMood = 'negative'; confidence += 10; reasons.push('Recent entries show challenging emotions'); }

  if (avgSleep < 5) { reasons.push('Low sleep quality detected'); suggestions.push('Prioritize 7-8 hours of sleep tonight'); confidence += 5; }
  if (avgStress > 7) { reasons.push('Elevated stress levels'); suggestions.push('Try a 5-minute breathing exercise'); }
  if (journalFreq >= 5) { reasons.push('Strong journaling consistency'); suggestions.push('Keep your reflection habit going'); confidence += 10; }
  else { suggestions.push('Journal today to improve prediction accuracy'); }

  if (isAiEnabled() && entries.length > 3) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: `Predict wellness mood. ${getLanguageInstruction(language)} Return JSON: {"predictedMood":"positive|neutral|negative","confidence":0-100,"reasons":[],"suggestions":[]}` },
        { role: 'user', content: JSON.stringify({ entries: context.recentEntries, habits: context.stats.habits, checkins }) },
      ]);
      return { ...result, source: 'ai' };
    } catch { /* fallback */ }
  }

  return { predictedMood, confidence: Math.min(confidence, 95), reasons, suggestions, source: 'local' };
}

export async function getHabitInsights(userId, language = 'en') {
  const stats = await getUserStatsForAnalytics(userId);
  const habits = stats.habits;

  const failing = habits.filter((h) => (h.completionRate || 0) < 40);
  const strong = habits.filter((h) => (h.streak || 0) >= 7);

  const local = {
    recommendations: habits.length < 3
      ? ['Add a morning hydration habit', 'Try 5-minute daily meditation', 'Track sleep consistently']
      : [`Focus on improving: ${failing[0]?.title || 'consistency'}`],
    failingHabits: failing.map((h) => ({ title: h.title, completionRate: h.completionRate, suggestion: `Try reducing frequency or pairing with an existing routine` })),
    strongHabits: strong.map((h) => ({ title: h.title, streak: h.streak })),
    streakPatterns: [`${strong.length} habits with 7+ day streaks`, `${failing.length} habits need attention`],
    source: 'local',
  };

  if (isAiEnabled()) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: `Habit coach. ${getLanguageInstruction(language)} Return JSON: {"recommendations":[],"failingHabits":[{"title":"","completionRate":0,"suggestion":""}],"strongHabits":[{"title":"","streak":0}],"streakPatterns":[]}` },
        { role: 'user', content: JSON.stringify({ habits }) },
      ]);
      return { ...result, source: 'ai' };
    } catch { /* fallback */ }
  }
  return local;
}

export async function getGoalInsights(userId, language = 'en') {
  const stats = await getUserStatsForAnalytics(userId);
  const goals = stats.goals;

  const local = {
    breakdowns: goals.map((g) => ({
      title: g.title,
      progress: g.progress || 0,
      completionChance: Math.min(95, (g.progress || 0) + (g.milestones?.filter((m) => m.completed).length || 0) * 10),
      nextSteps: g.progress < 50 ? ['Break into smaller tasks', 'Set a weekly review'] : ['Maintain momentum', 'Celebrate milestones'],
      suggestedMilestones: [`25% checkpoint for ${g.title}`, `Mid-point review`, `Final push milestone`],
    })),
    source: 'local',
  };

  if (isAiEnabled()) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: `Goal coach. ${getLanguageInstruction(language)} Return JSON: {"breakdowns":[{"title":"","progress":0,"completionChance":0,"nextSteps":[],"suggestedMilestones":[]}]}` },
        { role: 'user', content: JSON.stringify({ goals }) },
      ]);
      return { ...result, source: 'ai' };
    } catch { /* fallback */ }
  }
  return local;
}

export async function submitDailyCheckin(userId, data) {
  const date = new Date().toISOString().split('T')[0];
  const wellnessScore = Math.round(
    ((data.energyLevel || 5) * 10 + (10 - (data.stressLevel || 5)) * 10 + (data.sleepQuality || 5) * 10) / 3
  );

  let advice = 'Keep checking in daily for personalized insights.';
  let aiInsights = [`Wellness score: ${wellnessScore}/100`];

  if (isAiEnabled()) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: 'Daily wellness coach. Return JSON: {"advice":"...","aiInsights":["...","..."]}' },
        { role: 'user', content: JSON.stringify({ ...data, wellnessScore }) },
      ]);
      advice = result.advice;
      aiInsights = result.aiInsights;
    } catch { /* fallback */ }
  } else {
    advice = wellnessScore > 70 ? 'Great energy today! Channel it into your top priority.' : wellnessScore > 40 ? 'Steady day — focus on one meaningful action.' : 'Be gentle with yourself. Rest and small wins matter.';
  }

  const checkin = await DailyCheckin.findOneAndUpdate(
    { user: userId, date },
    { user: userId, date, ...data, wellnessScore, advice, aiInsights },
    { upsert: true, new: true }
  );

  await updateUserMemory(userId).catch(() => {});
  return checkin;
}

export async function getDailyCheckin(userId) {
  const date = new Date().toISOString().split('T')[0];
  return DailyCheckin.findOne({ user: userId, date }).lean();
}

export async function getDashboardInsights(userId, language = 'en') {
  const [prediction, habitInsights, context] = await Promise.all([
    getMoodPrediction(userId, language),
    getHabitInsights(userId, language),
    getUserContext(userId),
  ]);

  const todayInsight = context.memory?.personalityInsights?.[0]
    || 'Your wellness journey is unique — keep journaling for deeper insights.';

  return {
    todayInsight,
    emotionalWeather: prediction.predictedMood,
    wellnessScore: Math.round((prediction.confidence + (context.habitCompletionRate || 0)) / 2),
    moodForecast: prediction,
    habitRecommendation: habitInsights.recommendations?.[0] || 'Track one new habit this week',
    source: prediction.source,
  };
}

export async function aiSearch(userId, query) {
  return semanticSearchJournals(userId, query);
}

export async function generateReport(userId, period = 'weekly') {
  return generateWellnessReport(userId, period);
}

export { writingAssist, reportToHtml };
