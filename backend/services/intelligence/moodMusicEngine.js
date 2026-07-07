const MOOD_PLAYLISTS = {
  positive: {
    type: 'motivation',
    title: 'Energy Boost',
    tracks: ['Upbeat Focus — Synthwave Mix', 'Morning Motivation Playlist', 'Feel-Good Productivity'],
    description: 'Upbeat rhythms to match your positive energy',
  },
  negative: {
    type: 'calm',
    title: 'Calm Recovery',
    tracks: ['Rain & Soft Piano', 'Deep Breathing Soundscape', 'Gentle Ambient Healing'],
    description: 'Soothing sounds to help you decompress',
  },
  neutral: {
    type: 'focus',
    title: 'Balanced Focus',
    tracks: ['Lo-Fi Study Beats', 'Minimal Focus Flow', 'Neutral Workspace Ambience'],
    description: 'Steady focus music for reflective moods',
  },
  stressed: {
    type: 'calm',
    title: 'Stress Relief',
    tracks: ['Ocean Waves Meditation', '432Hz Relaxation', 'Slow Piano Calm'],
    description: 'Designed to lower cortisol and restore calm',
  },
  energetic: {
    type: 'motivation',
    title: 'High Energy',
    tracks: ['Power Workout Mix', 'Epic Motivation', 'Peak Performance Beats'],
    description: 'Channel your energy productively',
  },
};

export function getMoodMusic(moodCategory = 'neutral', intensity = 5) {
  let key = moodCategory;
  if (intensity >= 8) key = 'energetic';
  if (moodCategory === 'negative' && intensity >= 6) key = 'stressed';

  const playlist = MOOD_PLAYLISTS[key] || MOOD_PLAYLISTS.neutral;
  return {
    mood: moodCategory,
    intensity,
    ...playlist,
    source: 'local',
  };
}

export async function getMoodMusicForUser(userId) {
  const JournalEntry = (await import('../../models/JournalEntry.js')).default;
  const latest = await JournalEntry.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
  if (!latest) return getMoodMusic('neutral', 5);
  return getMoodMusic(latest.mood?.category || 'neutral', latest.intensity || 5);
}
