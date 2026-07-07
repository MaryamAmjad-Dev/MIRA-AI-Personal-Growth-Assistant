import { getDigitalTwin, syncDigitalTwin } from './digitalTwinService.js';
import { getUserStatsForAnalytics } from '../achievementService.js';
import { reportToHtml } from '../ai/reportGenerator.js';
import { isAiEnabled, callOpenAIJson } from '../ai/openaiClient.js';

export async function generatePersonalityReport(userId) {
  const month = new Date().toISOString().slice(0, 7);
  const [twin, stats] = await Promise.all([
    syncDigitalTwin(userId),
    getUserStatsForAnalytics(userId),
  ]);

  const local = {
    title: `Who You Became — ${month}`,
    personalityChanges: [
      `Evolving as a ${twin.personalityType}`,
      twin.communicationStyle ? `Communication style: ${twin.communicationStyle}` : 'Developing clearer self-expression',
    ],
    emotionalGrowth: [
      `${stats.entries.length} journal entries this period`,
      `${stats.habitCompletionRate}% habit consistency`,
    ],
    achievements: stats.goals.filter((g) => g.progress >= 100).map((g) => g.title),
    struggles: twin.weaknesses || ['Building consistency'],
    whoYouBecame: `This month you showed up as a ${twin.personalityType} — ${twin.repeatedPatterns?.[0] || 'continuing your growth journey'}.`,
    month,
    source: 'local',
  };

  if (isAiEnabled()) {
    try {
      const ai = await callOpenAIJson([
        { role: 'system', content: 'Monthly personality report. Return JSON: {"title":"","personalityChanges":[],"emotionalGrowth":[],"achievements":[],"struggles":[],"whoYouBecame":""}' },
        { role: 'user', content: JSON.stringify({ twin, stats: { entries: stats.entries.length, habits: stats.habitCompletionRate } }) },
      ]);
      return { ...local, ...ai, month, source: 'ai' };
    } catch { /* local */ }
  }

  return local;
}

export function personalityReportToHtml(report) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${report.title}</title>
<style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:20px;color:#1a1a2e}h1{color:#6366f1}h2{color:#818cf8;margin-top:24px}ul{line-height:1.8}.highlight{background:linear-gradient(135deg,#6366f122,#a855f711);padding:1rem;border-radius:12px;margin:1rem 0}</style></head><body>
<h1>${report.title}</h1>
<div class="highlight"><p>${report.whoYouBecame}</p></div>
<h2>Personality Changes</h2><ul>${report.personalityChanges?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<h2>Emotional Growth</h2><ul>${report.emotionalGrowth?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<h2>Achievements</h2><ul>${report.achievements?.map((t) => `<li>${t}</li>`).join('') || '<li>Keep going!</li>'}</ul>
<h2>Struggles</h2><ul>${report.struggles?.map((t) => `<li>${t}</li>`).join('') || ''}</ul>
<p style="color:#888;margin-top:40px">MIRA AI by Maryam 🦋 · ${report.month}</p>
</body></html>`;
}

export { reportToHtml };
