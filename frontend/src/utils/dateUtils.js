export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function getDateKey(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function getGroupLabel(dateKey) {
  const today = new Date();
  const todayKey = getDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);

  if (dateKey === todayKey) return 'Today';
  if (dateKey === yesterdayKey) return 'Yesterday';

  return new Date(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function groupEntriesByDate(entries) {
  const groups = {};

  entries.forEach((entry) => {
    const key = getDateKey(entry.createdAt);
    if (!groups[key]) {
      groups[key] = { label: getGroupLabel(key), entries: [] };
    }
    groups[key].entries.push(entry);
  });

  return Object.entries(groups).map(([dateKey, group]) => ({
    dateKey,
    label: group.label,
    entries: group.entries,
  }));
}

export function calculateStreak(entries) {
  if (!entries.length) return 0;

  const uniqueDays = [
    ...new Set(entries.map((e) => getDateKey(e.createdAt))),
  ].sort((a, b) => b.localeCompare(a));

  const today = getDateKey(new Date());
  const yesterday = getDateKey(new Date(Date.now() - 86400000));

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diff = (prev - curr) / 86400000;

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function buildWeeklyChartData(weeklyOverview) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  return days.map((date) => {
    const dayEntries = weeklyOverview.filter((w) => w.date === date);
    const total = dayEntries.reduce((sum, e) => sum + e.count, 0);
    const topMood = dayEntries.sort((a, b) => b.count - a.count)[0]?.emoji || null;

    return {
      date,
      label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
      total,
      topMood,
    };
  });
}
