import { apiDownload, apiRequest } from './client';

export async function fetchEntries({ search = '', emoji = '', tag = '', favorites = false } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (emoji) params.set('emoji', emoji);
  if (tag) params.set('tag', tag);
  if (favorites) params.set('favorites', 'true');

  const query = params.toString();
  return apiRequest(query ? `/journal?${query}` : '/journal');
}

export async function fetchStats() {
  return apiRequest('/journal/stats');
}

export async function fetchCalendar(year, month) {
  return apiRequest(`/journal/calendar?year=${year}&month=${month}`);
}

export async function fetchEntriesByDate(date) {
  return apiRequest(`/journal/day/${date}`);
}

export async function createEntry(entry) {
  return apiRequest('/journal', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function updateEntry(id, entry) {
  return apiRequest(`/journal/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
}

export async function toggleFavorite(id) {
  return apiRequest(`/journal/${id}/favorite`, { method: 'PATCH' });
}

export async function deleteEntry(id) {
  return apiRequest(`/journal/${id}`, { method: 'DELETE' });
}

export async function exportJournal(format = 'json') {
  const response = await apiDownload(`/journal/export?format=${format}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mira-export.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
