import { getUserStatsForAnalytics } from '../achievementService.js';
import { isAiEnabled, callOpenAIJson } from './openaiClient.js';
import { buildReportSystemPrompt } from './promptBuilder.js';
import { getUserContext } from './memoryEngine.js';

function buildLocalReport(stats, period) {
  const entries = stats.entries;
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const negative = entries.filter((e) => e.mood?.category === 'negative').length;

  return {
    title: `${period.charAt(0).toUpperCase() + period.slice(1)} Wellness Report`,
    moodSummary: `You logged ${entries.length} entries. Mood balance: ${positive} positive, ${negative} challenging.`,
    emotionalTrends: [
      positive > negative ? 'Upward emotional trend' : 'Some challenging moments — normal and worth noting',
      `Habit completion: ${stats.habitCompletionRate}%`,
    ],
    habitSuccess: `${stats.habits.length} active habits tracked. Best streaks among top performers.`,
    productivity: `Productivity score: ${stats.productivityScore}%. ${stats.tasks.filter((t) => t.status === 'done').length} tasks completed.`,
    improvements: ['Maintain consistent journaling', 'Focus on lowest-streak habits', 'Review goal milestones weekly'],
    recommendations: ['Schedule a daily check-in', 'Celebrate small wins', 'Use AI coach for personalized guidance'],
    wellnessScore: Math.min(100, Math.round((positive / Math.max(entries.length, 1)) * 60 + stats.habitCompletionRate * 0.4)),
    period,
    generatedAt: new Date().toISOString(),
    source: 'local',
  };
}

export async function generateWellnessReport(userId, period = 'weekly') {
  const stats = await getUserStatsForAnalytics(userId);
  const context = await getUserContext(userId);

  const days = period === 'monthly' ? 30 : 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  const periodEntries = stats.entries.filter((e) => new Date(e.createdAt) >= cutoff);

  if (isAiEnabled() && periodEntries.length > 0) {
    try {
      const result = await callOpenAIJson([
        { role: 'system', content: buildReportSystemPrompt(period) },
        {
          role: 'user',
          content: JSON.stringify({
            entries: periodEntries.slice(0, 30),
            habits: stats.habits,
            goals: stats.goals,
            memory: context.memoryContext,
          }),
        },
      ]);
      return { ...result, period, generatedAt: new Date().toISOString(), source: 'ai' };
    } catch {
      /* fallback */
    }
  }

  return buildLocalReport({ ...stats, entries: periodEntries }, period);
}

export function reportToHtml(report) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${report.title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a2e}
h1{color:#6366f1}h2{color:#818cf8;margin-top:24px}ul{line-height:1.8}.score{font-size:2rem;color:#6366f1;font-weight:bold}
.footer{margin-top:40px;color:#888;font-size:0.85rem}</style></head><body>
<h1>${report.title}</h1>
<p class="score">Wellness Score: ${report.wellnessScore}/100</p>
<h2>Mood Summary</h2><p>${report.moodSummary}</p>
<h2>Emotional Trends</h2><ul>${report.emotionalTrends?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<h2>Habit Success</h2><p>${report.habitSuccess}</p>
<h2>Productivity</h2><p>${report.productivity}</p>
<h2>Improvements</h2><ul>${report.improvements?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<h2>Recommendations</h2><ul>${report.recommendations?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<p class="footer">Generated ${new Date(report.generatedAt).toLocaleString()} · MIRA AI by Maryam 🦋</p>
</body></html>`;
}
