export const MOOD_CATEGORIES = {
  positive: { label: 'Positive', icon: '😊', color: '#34d399' },
  neutral: { label: 'Neutral', icon: '😐', color: '#94a3b8' },
  negative: { label: 'Negative', icon: '😢', color: '#f87171' },
};

export const MOOD_LIBRARY = [
  // Positive
  { emoji: '😊', name: 'happy', category: 'positive', color: '#34d399' },
  { emoji: '🤩', name: 'excited', category: 'positive', color: '#fbbf24' },
  { emoji: '🥰', name: 'grateful', category: 'positive', color: '#f472b6' },
  { emoji: '😤', name: 'proud', category: 'positive', color: '#818cf8' },
  { emoji: '😌', name: 'relaxed', category: 'positive', color: '#6ee7b7' },
  { emoji: '💕', name: 'loved', category: 'positive', color: '#fb7185' },
  { emoji: '😎', name: 'confident', category: 'positive', color: '#60a5fa' },
  { emoji: '🌟', name: 'hopeful', category: 'positive', color: '#fcd34d' },
  { emoji: '☮️', name: 'peaceful', category: 'positive', color: '#a7f3d0' },
  { emoji: '💪', name: 'motivated', category: 'positive', color: '#4ade80' },
  // Neutral
  { emoji: '😐', name: 'normal', category: 'neutral', color: '#94a3b8' },
  { emoji: '😑', name: 'bored', category: 'neutral', color: '#cbd5e1' },
  { emoji: '😕', name: 'confused', category: 'neutral', color: '#a8a29e' },
  { emoji: '😴', name: 'tired', category: 'neutral', color: '#94a3b8' },
  { emoji: '🥱', name: 'sleepy', category: 'neutral', color: '#cbd5e1' },
  { emoji: '🤔', name: 'thoughtful', category: 'neutral', color: '#818cf8' },
  { emoji: '😶‍🌫️', name: 'distracted', category: 'neutral', color: '#94a3b8' },
  // Negative
  { emoji: '😔', name: 'sad', category: 'negative', color: '#60a5fa' },
  { emoji: '😠', name: 'angry', category: 'negative', color: '#ef4444' },
  { emoji: '😰', name: 'stressed', category: 'negative', color: '#f97316' },
  { emoji: '😨', name: 'anxious', category: 'negative', color: '#fb923c' },
  { emoji: '🥺', name: 'lonely', category: 'negative', color: '#a78bfa' },
  { emoji: '😤', name: 'frustrated', category: 'negative', color: '#f87171' },
  { emoji: '😞', name: 'disappointed', category: 'negative', color: '#64748b' },
  { emoji: '🤯', name: 'overwhelmed', category: 'negative', color: '#e879f9' },
  { emoji: '😩', name: 'exhausted', category: 'negative', color: '#78716c' },
];

export function findMoodByEmoji(emoji) {
  return MOOD_LIBRARY.find((m) => m.emoji === emoji) || null;
}

export function findMoodByName(name) {
  return MOOD_LIBRARY.find((m) => m.name === name?.toLowerCase()) || null;
}

export function normalizeMood(input) {
  if (!input) return null;
  if (typeof input === 'string') return findMoodByEmoji(input);
  if (input.emoji && input.name && input.category) {
    return {
      emoji: input.emoji,
      name: input.name.toLowerCase(),
      category: input.category,
      color: input.color || MOOD_CATEGORIES[input.category]?.color || '#818cf8',
    };
  }
  if (input.emoji) return findMoodByEmoji(input.emoji);
  return null;
}

export function entryWithLegacyEmoji(entry) {
  if (!entry) return entry;
  const mood = entry.mood || (entry.emoji ? findMoodByEmoji(entry.emoji) : null);
  return {
    ...entry,
    mood,
    emoji: mood?.emoji || entry.emoji,
  };
}
