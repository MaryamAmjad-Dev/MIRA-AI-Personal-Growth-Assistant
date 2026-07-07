import { getDigitalTwin } from './digitalTwinService.js';
import { getUserStatsForAnalytics } from '../achievementService.js';
import { isAiEnabled, callOpenAIJson } from '../ai/openaiClient.js';
import { sanitizeText } from '../ai/promptBuilder.js';
import { getLanguageInstruction } from '../languageHelper.js';

export async function analyzeDecision(userId, { optionA, optionB, context }, language = 'en') {
  const safeA = sanitizeText(optionA, 500);
  const safeB = sanitizeText(optionB, 500);
  const safeCtx = sanitizeText(context, 500);

  const [twin, stats] = await Promise.all([
    getDigitalTwin(userId),
    getUserStatsForAnalytics(userId),
  ]);

  const local = {
    optionA: {
      label: safeA,
      pros: ['Aligns with current comfort zone', 'Lower immediate risk'],
      cons: ['May not accelerate growth'],
      risk: 'Low',
      alignmentScore: 65,
    },
    optionB: {
      label: safeB,
      pros: ['Potential for significant growth', `Supports value: ${twin.lifeValues?.[0] || 'Growth'}`],
      cons: ['Requires energy and consistency'],
      risk: 'Medium',
      alignmentScore: 78,
    },
    recommendation: `Option B aligns better with your ${twin.personalityType} profile and goal of ${stats.goals[0]?.title || 'personal growth'}.`,
    source: 'local',
  };

  if (isAiEnabled()) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: `Decision assistant. ${getLanguageInstruction(language)} Return JSON: {"optionA":{"label":"","pros":[],"cons":[],"risk":"","alignmentScore":0},"optionB":{"label":"","pros":[],"cons":[],"risk":"","alignmentScore":0},"recommendation":""}` },
        { role: 'user', content: JSON.stringify({ optionA: safeA, optionB: safeB, context: safeCtx, values: twin.lifeValues, goals: stats.goals.map((g) => g.title) }) },
      ]);
      return { ...result, source: 'ai' };
    } catch { /* fallback */ }
  }

  return local;
}
