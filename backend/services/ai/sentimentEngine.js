import { isAiEnabled, callOpenAIJson } from './openaiClient.js';
import { buildAnalysisSystemPrompt, sanitizeText } from './promptBuilder.js';

const POSITIVE_WORDS = ['happy', 'great', 'good', 'love', 'grateful', 'excited', 'calm', 'peace', 'joy', 'wonderful', 'amazing', 'blessed', 'energy', 'motivated'];
const NEGATIVE_WORDS = ['sad', 'anxious', 'worried', 'tired', 'angry', 'frustrated', 'stress', 'upset', 'depressed', 'lonely', 'afraid', 'hurt', 'overwhelm', 'exhausted'];
const EMOTION_MAP = {
  happy: 'joy', great: 'contentment', love: 'love', grateful: 'gratitude',
  sad: 'sadness', anxious: 'anxiety', angry: 'anger', tired: 'fatigue',
  stress: 'stress', frustrated: 'frustration', calm: 'calm', excited: 'excitement',
};

function detectSentiment(text) {
  const lower = text.toLowerCase();
  let score = 0;
  POSITIVE_WORDS.forEach((w) => { if (lower.includes(w)) score += 1; });
  NEGATIVE_WORDS.forEach((w) => { if (lower.includes(w)) score -= 1; });
  if (score > 0) return { label: 'positive', score: Math.min(score * 20, 100) };
  if (score < 0) return { label: 'negative', score: Math.max(score * 20, -100) };
  return { label: 'neutral', score: 50 };
}

function extractEmotions(text) {
  const lower = text.toLowerCase();
  const emotions = new Set();
  Object.entries(EMOTION_MAP).forEach(([word, emotion]) => {
    if (lower.includes(word)) emotions.add(emotion);
  });
  return [...emotions].slice(0, 6);
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 8);
}

function localDeepAnalysis({ text, emoji, mood, intensity }) {
  const sentiment = detectSentiment(text);
  const emotions = extractEmotions(text);
  const keywords = extractKeywords(text);
  const stressScore = Math.min(10, Math.max(0, (10 - intensity) + (sentiment.label === 'negative' ? 4 : 0)));
  const energyScore = Math.min(10, Math.max(1, intensity - (sentiment.label === 'negative' ? 2 : 0)));

  const suggestions = {
    positive: ['Celebrate this moment', 'Share gratitude with someone', 'Note what contributed to this mood'],
    negative: ['Try 5 minutes of breathing', 'Identify one small controllable action', 'Consider a short walk'],
    neutral: ['Set one intention for tomorrow', 'Review weekly patterns', 'Do a brief body scan'],
  };

  return {
    sentiment: sentiment.label,
    emotions: emotions.length ? emotions : [mood?.category === 'positive' ? 'contentment' : mood?.category === 'negative' ? 'concern' : 'reflection'],
    stressScore,
    energyScore,
    positivityScore: sentiment.label === 'positive' ? 75 + Math.min(intensity * 2, 20) : sentiment.label === 'negative' ? 30 : 55,
    keywords,
    triggers: keywords.filter((k) => ['work', 'family', 'health', 'study', 'sleep', 'stress'].includes(k)),
    summary: `Entry reflects ${sentiment.label} sentiment with intensity ${intensity}/10${emoji ? ` (${emoji})` : ''}.`,
    suggestions: suggestions[sentiment.label],
    response: sentiment.label === 'positive'
      ? 'Your reflection shows positive emotional awareness. Keep nurturing what works.'
      : sentiment.label === 'negative'
        ? 'Thank you for sharing difficult feelings. Journaling is a healthy step forward.'
        : 'Thoughtful self-reflection supports long-term wellness.',
    activities: suggestions[sentiment.label],
    insights: [`Intensity: ${intensity}/10`, `Emotions: ${emotions.join(', ') || 'mixed'}`, `Stress estimate: ${stressScore}/10`],
    source: 'local',
  };
}

export async function analyzeJournalDeep({ text, emoji, mood, intensity }) {
  const safeText = sanitizeText(text);

  if (isAiEnabled()) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: buildAnalysisSystemPrompt() },
        {
          role: 'user',
          content: JSON.stringify({
            mood: mood?.name || emoji,
            category: mood?.category,
            intensity,
            text: safeText,
          }),
        },
      ]);
      return {
        ...result,
        response: result.summary,
        activities: result.suggestions,
        insights: [result.summary, ...(result.emotions?.map((e) => `Emotion: ${e}`) || [])],
        source: 'ai',
      };
    } catch {
      /* fallback */
    }
  }

  return localDeepAnalysis({ text: safeText, emoji, mood, intensity });
}

export async function writingAssist(action, { text, mood, intensity }) {
  const safeText = sanitizeText(text);
  const prompts = {
    continue: 'Continue the user\'s journal thoughts naturally in 2-3 sentences. Return JSON: {"result":"..."}',
    improve: 'Improve this journal reflection while keeping the user\'s voice. Return JSON: {"result":"..."}',
    prompts: 'Generate 3 thoughtful journal prompts based on context. Return JSON: {"result":["...","...","..."]}',
    questions: 'Ask 3 deeper reflective questions. Return JSON: {"result":["...","...","..."]}',
    summarize: 'Summarize this journal entry concisely. Return JSON: {"result":"..."}',
  };

  const system = prompts[action] || prompts.continue;

  if (isAiEnabled() && safeText) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify({ text: safeText, mood, intensity }) },
      ]);
      return { ...result, source: 'ai' };
    } catch {
      /* fallback */
    }
  }

  const fallbacks = {
    continue: `${safeText.slice(0, 100)}... and I'm noticing how this connects to my overall wellbeing.`,
    improve: safeText,
    prompts: ['What moment today felt most meaningful?', 'What emotion surprised you today?', 'What would make tomorrow 1% better?'],
    questions: ['What triggered this feeling?', 'What do you need right now?', 'What pattern do you notice?'],
    summarize: safeText.slice(0, 150) + (safeText.length > 150 ? '...' : ''),
  };

  return { result: fallbacks[action] || fallbacks.continue, source: 'local' };
}

export { localDeepAnalysis as fallbackAnalysis };
