import { analyzeJournalDeep, fallbackAnalysis } from './ai/sentimentEngine.js';

export async function analyzeJournalEntry(payload) {
  const result = await analyzeJournalDeep(payload);
  return {
    sentiment: result.sentiment,
    sentimentScore: result.positivityScore ? Math.round((result.positivityScore - 50) / 10) : 0,
    response: result.response || result.summary,
    activities: result.activities || result.suggestions,
    insights: result.insights,
    aiAnalysis: {
      sentiment: result.sentiment,
      emotions: result.emotions,
      stressScore: result.stressScore,
      energyScore: result.energyScore,
      positivityScore: result.positivityScore,
      keywords: result.keywords,
      triggers: result.triggers,
      summary: result.summary,
      suggestions: result.suggestions,
      source: result.source,
    },
    source: result.source,
  };
}

export { analyzeJournalDeep };
