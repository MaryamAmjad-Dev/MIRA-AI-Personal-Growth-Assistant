/**
 * MIRA local AI — works without OpenAI or any API key.
 * Rules, patterns, journal/habit/mood analysis.
 */
import { generateLocalResponse, detectIntent, gatherUserData } from './localAIEngine.js';

const TIRED_PATTERNS = /\b(tired|exhausted|drained|low energy|sleepy|fatigue|weary|burned out|burnt out)\b/i;

function buildTiredResponse(data) {
  const { avgSleep, avgStress, weekEntries, moods } = data;
  const lines = [
    'I noticed low energy patterns in your wellness data.',
    '',
    '**Insight:** Your recent reflections suggest your body and mind may need recovery time.',
  ];

  if (avgSleep !== null && avgSleep < 6) {
    lines.push(`Sleep quality averages ${avgSleep}/10 — rest is likely a key factor.`);
  }
  if (avgStress !== null && avgStress >= 6) {
    lines.push(`Stress levels are elevated (${avgStress}/10), which often drains energy.`);
  }
  if (moods.negative > moods.positive && weekEntries.length) {
    lines.push('Recent journal entries show more challenging moods than uplifting ones.');
  }

  lines.push(
    '',
    '**Suggestions:**',
    '• Try a short walk and fresh hydration',
    '• Take 10 minutes for quiet reflection or breathing',
    '• Prioritize sleep tonight — even 30 minutes earlier helps',
    '• Celebrate one small win today, no matter how small',
    '',
    'MIRA is here with you — Maryam 🦋'
  );

  return lines.join('\n');
}

/**
 * Main local AI response — mood coach, habits, growth analysis
 */
export async function getLocalAIResponse(userId, message, language = 'en') {
  const text = (message || '').trim();
  if (!text) {
    return {
      reply: 'Share how you are feeling or ask about your week, habits, stress, or progress.',
      source: 'local',
      intent: 'empty',
    };
  }

  if (TIRED_PATTERNS.test(text)) {
    const data = await gatherUserData(userId);
    return { reply: buildTiredResponse(data), source: 'local', intent: 'tired' };
  }

  return generateLocalResponse(userId, text, language);
}

export { generateLocalResponse, detectIntent, gatherUserData };
