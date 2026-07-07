import { apiRequest } from './client';

export async function fetchMoodLibrary() {
  return apiRequest('/moods/library');
}

export async function fetchCustomMoods() {
  return apiRequest('/moods/custom');
}

export async function createCustomMood(mood) {
  return apiRequest('/moods/custom', { method: 'POST', body: JSON.stringify(mood) });
}

export async function toggleFavoriteMood(emoji) {
  return apiRequest(`/moods/favorites/${encodeURIComponent(emoji)}`, { method: 'POST' });
}
