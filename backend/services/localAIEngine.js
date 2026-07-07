import JournalEntry from '../models/JournalEntry.js';
import DailyCheckin from '../models/DailyCheckin.js';
import { getUserStatsForAnalytics } from './achievementService.js';
import { getUserContext } from './aiMemoryService.js';
import { normalizeLanguage } from './languageHelper.js';
import { getLocalTemplate } from './localAITemplates.js';


const INTENTS = {
  week: /\b(week|weekly|how was|this week|past week|hafta|semana|semaine|woche|週|주|周)\b/i,
  stress: /\b(stress|stressed|anxious|anxiety|overwhelm|tired|exhaust|pressure|تناؤ|پریشان|قلق|توت|estrés|angst)\b/i,
  habits: /\b(habit|routine|streak|consistency|عادت|عادات|habito|gewohnheit|習慣)\b/i,
  goals: /\b(goal|milestone|achievement|ہدف|objetivo|ziel|目標)\b/i,
  progress: /\b(progress|how am i doing|show my|overview|stats|summary|track record)\b/i,
  mood: /\b(mood|feeling|feel|emotion|sentiment|موڈ|حس|mood|stimmung|気分)\b/i,
  suggest: /\b(suggest|recommend|advice|tip|help me|what should|مشورہ|نصیحہ|consejo|rat)\b/i,
  greeting: /^(hi|hello|hey|salam|assalam|مرحبا|ہیلو|hola|ciao|こんにちは|안녕)\b/i,
};

function entriesInRange(entries, days) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => new Date(e.createdAt).getTime() >= since);
}

function moodBreakdown(entries) {
  const positive = entries.filter((e) => e.mood?.category === 'positive').length;
  const negative = entries.filter((e) => e.mood?.category === 'negative').length;
  const neutral = entries.length - positive - negative;
  return { positive, negative, neutral, total: entries.length };
}

function topMood(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const key = e.mood?.name || e.mood?.emoji || 'Unknown';
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'balanced';
}

function avgIntensity(entries) {
  if (!entries.length) return 5;
  return Math.round(entries.reduce((s, e) => s + (e.intensity || 5), 0) / entries.length);
}

function detectIntent(message) {
  const text = message.toLowerCase();
  const order = ['greeting', 'week', 'stress', 'progress', 'habits', 'goals', 'mood', 'suggest'];
  for (const intent of order) {
    if (INTENTS[intent]?.test(text)) return intent;
  }
  return 'general';
}

function stressSignals(entries) {
  const words = ['stress', 'work', 'deadline', 'anxious', 'overwhelm', 'tired', 'exhausted', 'worried', 'pressure'];
  const hits = new Set();
  entries.forEach((e) => {
    const lower = (e.text || '').toLowerCase();
    words.forEach((w) => { if (lower.includes(w)) hits.add(w); });
  });
  return [...hits];
}

async function gatherUserData(userId) {
  const [stats, context, checkins] = await Promise.all([
    getUserStatsForAnalytics(userId),
    getUserContext(userId),
    DailyCheckin.find({ user: userId }).sort({ date: -1 }).limit(14).lean(),
  ]);

  const weekEntries = entriesInRange(stats.entries, 7);
  const monthEntries = entriesInRange(stats.entries, 30);
  const moods = moodBreakdown(weekEntries.length ? weekEntries : stats.entries.slice(0, 14));
  const strongHabits = stats.habits.filter((h) => (h.streak || 0) >= 3);
  const weakHabits = stats.habits.filter((h) => (h.completionRate || 0) < 40 || (h.streak || 0) < 2);
  const avgSleep = checkins.length
    ? Math.round(checkins.reduce((s, c) => s + (c.sleepQuality || 5), 0) / checkins.length * 10) / 10
    : null;
  const avgStress = checkins.length
    ? Math.round(checkins.reduce((s, c) => s + (c.stressLevel || 5), 0) / checkins.length * 10) / 10
    : null;

  return {
    stats,
    context,
    checkins,
    weekEntries,
    monthEntries,
    moods,
    strongHabits,
    weakHabits,
    avgSleep,
    avgStress,
    topMoodName: topMood(weekEntries.length ? weekEntries : stats.entries),
    avgIntensity: avgIntensity(weekEntries.length ? weekEntries : stats.entries),
    stressWords: stressSignals(weekEntries.length ? weekEntries : stats.entries),
    productivityScore: stats.productivityScore,
    habitCompletionRate: stats.habitCompletionRate,
  };
}

function buildWeekResponse(data, lang) {
  const { weekEntries, moods, topMoodName, avgIntensity, strongHabits, habitCompletionRate, stats } = data;
  const lines = [getLocalTemplate(lang, 'weekIntro')];

  if (weekEntries.length === 0) {
    lines.push(`You haven't logged journal entries this week yet. Start with one reflection today — even a few sentences help MIRA understand your patterns.`);
  } else {
    lines.push(`You wrote ${weekEntries.length} journal ${weekEntries.length === 1 ? 'entry' : 'entries'}.`);
    lines.push(`Mood mix: ${moods.positive} positive, ${moods.negative} challenging, ${moods.neutral} neutral moments.`);
    lines.push(`Your most frequent mood: ${topMoodName}. Average intensity: ${avgIntensity}/10.`);
  }

  if (moods.negative > moods.positive && weekEntries.length > 0) {
    lines.push(`MIRA noticed your recent reflections show lower energy. Consider rest, gentle movement, or a short breathing break.`);
  } else if (moods.positive >= moods.negative && weekEntries.length > 0) {
    lines.push(`Your emotional tone this week looks balanced or upward — keep nurturing what's working.`);
  }

  if (strongHabits.length) {
    lines.push(`Strong habits: ${strongHabits.slice(0, 3).map((h) => `${h.title} (${h.streak || 0}d streak)`).join(', ')}.`);
  }

  if (habitCompletionRate > 0) {
    lines.push(`Habit completion rate: ${habitCompletionRate}%.`);
    if (habitCompletionRate >= 60) {
      lines.push(`Your consistency improved this week — that's meaningful progress with Maryam 🦋`);
    }
  }

  if (stats.goals.length) {
    const topGoal = stats.goals[0];
    lines.push(`Active goal focus: "${topGoal.title}" at ${topGoal.progress || 0}% progress.`);
  }

  lines.push(`What would you like to explore next — habits, mood, or goals?`);
  return lines.join('\n\n');
}

function buildStressResponse(data, lang) {
  const { stressWords, moods, avgStress, avgSleep, weekEntries, topMoodName } = data;
  const lines = [getLocalTemplate(lang, 'stressIntro')];

  if (weekEntries.length === 0) {
    lines.push(`Log a journal entry or daily check-in so MIRA can spot what might be contributing to how you feel.`);
    return lines.join('\n\n');
  }

  if (moods.negative > moods.positive) {
    lines.push(`Your recent entries lean toward challenging emotions (${moods.negative} vs ${moods.positive} positive).`);
  }

  if (stressWords.length) {
    lines.push(`Recurring themes in your writing: ${stressWords.join(', ')}. These often signal where pressure is building.`);
  } else {
    lines.push(`No strong stress keywords in recent journals, but your mood pattern still suggests you may need recovery time.`);
  }

  if (avgStress !== null && avgStress >= 6) {
    lines.push(`Daily check-ins show elevated stress (${avgStress}/10). Try a 5-minute pause before your next task.`);
  }

  if (avgSleep !== null && avgSleep < 5) {
    lines.push(`Sleep quality averages ${avgSleep}/10 — rest could significantly help your stress levels.`);
  }

  lines.push(`Top recent mood: ${topMoodName}.`);
  lines.push(`Suggestions: short walk, box breathing (4-4-4-4), journaling one worry and one controllable action, or reaching out to someone you trust.`);
  return lines.join('\n\n');
}

function buildHabitResponse(data, lang) {
  const { stats, strongHabits, weakHabits, habitCompletionRate } = data;
  const lines = [getLocalTemplate(lang, 'habitsIntro')];

  if (!stats.habits.length) {
    lines.push(`You haven't created habits yet. Start with one small daily ritual — hydration, 5-minute meditation, or an evening reflection.`);
    lines.push(`Suggested starter habits:\n• Morning glass of water\n• 5-minute mindfulness\n• Evening gratitude note`);
    return lines.join('\n\n');
  }

  lines.push(`You track ${stats.habits.length} habit${stats.habits.length === 1 ? '' : 's'} with ${habitCompletionRate}% overall completion.`);

  if (strongHabits.length) {
    lines.push(`Keep building on: ${strongHabits.map((h) => `"${h.title}" (${h.streak || 0} day streak)`).join(', ')}.`);
  }

  if (weakHabits.length) {
    const w = weakHabits[0];
    lines.push(`Needs attention: "${w.title}" — try pairing it with an existing routine or reducing frequency to rebuild momentum.`);
  }

  const suggestions = [];
  if (!stats.habits.some((h) => /sleep|rest/i.test(h.title))) suggestions.push('Track sleep consistency');
  if (!stats.habits.some((h) => /water|hydrat/i.test(h.title))) suggestions.push('Add a hydration habit');
  if (!stats.habits.some((h) => /meditat|mindful|breath/i.test(h.title))) suggestions.push('Try 5-minute daily mindfulness');
  if (suggestions.length) {
    lines.push(`MIRA suggests: ${suggestions.join(' · ')}.`);
  }

  return lines.join('\n\n');
}

function buildProgressResponse(data, lang) {
  const { stats, moods, weekEntries, productivityScore, habitCompletionRate, monthEntries } = data;
  const lines = [getLocalTemplate(lang, 'progressIntro')];

  lines.push(`Journal: ${stats.entries.length} total entries · ${weekEntries.length} this week · ${monthEntries.length} this month.`);
  lines.push(`Mood trend (7d): ${moods.positive} positive, ${moods.negative} challenging.`);
  lines.push(`Habits: ${stats.habits.length} tracked · ${habitCompletionRate}% completion.`);
  lines.push(`Goals: ${stats.goals.length} active · top progress: ${stats.goals[0]?.title || 'none yet'} (${stats.goals[0]?.progress || 0}%).`);
  lines.push(`Planner productivity: ${productivityScore}%.`);

  if (weekEntries.length >= 5) {
    lines.push(`Excellent journaling consistency — MIRA can give sharper insights as you keep going.`);
  } else if (weekEntries.length > 0) {
    lines.push(`Try 3–5 entries this week for richer pattern detection.`);
  }

  return lines.join('\n\n');
}

function buildMoodResponse(data, lang) {
  const { topMoodName, moods, avgIntensity, context } = data;
  const lines = [getLocalTemplate(lang, 'moodInsight')];
  lines.push(`Most frequent recent mood: ${topMoodName}. Average intensity: ${avgIntensity}/10.`);
  lines.push(`Breakdown: ${moods.positive} positive · ${moods.negative} challenging · ${moods.neutral} neutral.`);

  const insight = context.memory?.personalityInsights?.[0];
  if (insight) lines.push(`Pattern: ${insight}.`);

  if (moods.negative > moods.positive) {
    lines.push(`Your reflections suggest you may be processing heavier emotions. Be gentle with yourself — small wins count.`);
  } else {
    lines.push(`Your emotional awareness is growing. Naming feelings is a powerful wellness practice.`);
  }

  return lines.join('\n\n');
}

function buildGoalResponse(data, lang) {
  const { stats } = data;
  if (!stats.goals.length) {
    return getLocalTemplate(lang, 'goalsEmpty');
  }

  const lines = [`MIRA analyzed your goals:`];
  stats.goals.slice(0, 5).forEach((g) => {
    const done = g.milestones?.filter((m) => m.completed).length || 0;
    const total = g.milestones?.length || 0;
    lines.push(`• "${g.title}" — ${g.progress || 0}% complete${total ? ` · ${done}/${total} milestones` : ''}.`);
    lines.push(`  Next step: ${g.progress < 50 ? 'Break into smaller weekly actions' : 'Maintain momentum and celebrate progress'}.`);
  });
  return lines.join('\n');
}

function buildGreetingResponse(lang) {
  return getLocalTemplate(lang, 'greeting');
}

function buildGeneralResponse(data, message, lang) {
  const { weekEntries, moods, strongHabits, stats } = data;
  const lines = [getLocalTemplate(lang, 'generalThanks')];

  if (weekEntries.length) {
    lines.push(`This week: ${weekEntries.length} journal entries, mostly ${moods.positive >= moods.negative ? 'positive or balanced' : 'mixed with some challenging moments'}.`);
  } else {
    lines.push(`Start journaling to unlock deeper personalized insights from MIRA.`);
  }

  if (strongHabits.length) {
    lines.push(`Your strongest habit right now: "${strongHabits[0].title}" (${strongHabits[0].streak || 0} day streak).`);
  }

  if (stats.goals.length) {
    lines.push(`You're working toward ${stats.goals.length} goal${stats.goals.length === 1 ? '' : 's'} — "${stats.goals[0].title}" is at ${stats.goals[0].progress || 0}%.`);
  }

  lines.push(`Regarding "${message.slice(0, 80)}${message.length > 80 ? '…' : ''}" — reflection and consistent tracking will help MIRA guide you better.`);
  lines.push(`Try asking: "How was my week?", "Why am I stressed?", "Suggest habits", or "Show my progress".`);
  return lines.join('\n\n');
}

/**
 * Generate a personalized local AI response without external API.
 */
export async function generateLocalResponse(userId, message, language = 'en') {
  const lang = normalizeLanguage(language);
  const data = await gatherUserData(userId);
  const intent = detectIntent(message);

  let reply;
  switch (intent) {
    case 'week':
      reply = buildWeekResponse(data, lang);
      break;
    case 'stress':
      reply = buildStressResponse(data, lang);
      break;
    case 'habits':
    case 'suggest':
      reply = buildHabitResponse(data, lang);
      break;
    case 'goals':
      reply = buildGoalResponse(data, lang);
      break;
    case 'progress':
      reply = buildProgressResponse(data, lang);
      break;
    case 'mood':
      reply = buildMoodResponse(data, lang);
      break;
    case 'greeting':
      reply = buildGreetingResponse(lang);
      break;
    default:
      reply = buildGeneralResponse(data, message, lang);
  }

  if (lang !== 'en' && intent !== 'greeting') {
    reply = `${getLocalTemplate(lang, 'greeting').split('\n\n')[0]}\n\n${reply}`;
  }

  return { reply, source: 'local', intent };
}

export { detectIntent, gatherUserData };
