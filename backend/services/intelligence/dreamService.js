import DreamEntry from '../../models/DreamEntry.js';
import { isAiEnabled, callOpenAIJson } from '../ai/openaiClient.js';
import { sanitizeText } from '../ai/promptBuilder.js';

function localDreamAnalysis(dream, emotions, symbols) {
  return {
    themes: emotions.length ? emotions : ['subconscious processing'],
    interpretation: `Your dream involving ${symbols.slice(0, 2).join(', ') || 'abstract imagery'} may reflect current emotional processing. Symbols often mirror waking concerns.`,
    recurringSymbols: symbols.slice(0, 3),
    source: 'local',
  };
}

export async function createDream(userId, { dream, emotions, symbols, mood }) {
  const safeDream = sanitizeText(dream, 5000);
  let aiAnalysis = localDreamAnalysis(safeDream, emotions || [], symbols || []);

  if (isAiEnabled()) {
    try {
      aiAnalysis = await callOpenAIJson([
        { role: 'system', content: 'Dream analyst. Return JSON: {"themes":[],"interpretation":"","recurringSymbols":[]}' },
        { role: 'user', content: JSON.stringify({ dream: safeDream, emotions, symbols }) },
      ]);
      aiAnalysis.source = 'ai';
    } catch { /* local */ }
  }

  return DreamEntry.create({
    user: userId,
    dream: safeDream,
    emotions: emotions || [],
    symbols: symbols || [],
    mood: mood || 'neutral',
    aiAnalysis,
  });
}

export async function listDreams(userId) {
  return DreamEntry.find({ user: userId }).sort({ createdAt: -1 }).limit(50).lean();
}

export async function getDreamPatterns(userId) {
  const dreams = await DreamEntry.find({ user: userId }).sort({ createdAt: -1 }).limit(30).lean();
  const symbolMap = {};
  dreams.forEach((d) => {
    (d.symbols || []).forEach((s) => { symbolMap[s] = (symbolMap[s] || 0) + 1; });
  });
  const recurring = Object.entries(symbolMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([symbol, count]) => ({ symbol, count }));
  return { dreams: dreams.length, recurring, recent: dreams.slice(0, 5) };
}

export async function deleteDream(userId, id) {
  return DreamEntry.findOneAndDelete({ _id: id, user: userId });
}
