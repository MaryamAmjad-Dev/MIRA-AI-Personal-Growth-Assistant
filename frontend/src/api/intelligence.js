import { apiRequest, apiUrl, getToken } from './client';

export async function fetchDigitalTwin() {
  return apiRequest('/intelligence');
}

export async function syncDigitalTwin() {
  return apiRequest('/intelligence/sync', { method: 'POST' });
}

export async function askDigitalTwin(question) {
  return apiRequest('/intelligence/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

export async function fetchPersonalityEvolution() {
  return apiRequest('/intelligence/evolution');
}

export async function fetchPatterns() {
  return apiRequest('/ai/patterns');
}

export async function fetchLifeScore() {
  return apiRequest('/intelligence/life-score');
}

export async function fetchLifeScoreHistory() {
  return apiRequest('/intelligence/life-score/history');
}

export async function fetchEmotionalDNA() {
  return apiRequest('/intelligence/emotional-dna');
}

export async function fetchFutureSelf() {
  return apiRequest('/intelligence/future-self');
}

export async function analyzeDecision(payload) {
  return apiRequest('/intelligence/decision', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchBurnout() {
  return apiRequest('/intelligence/burnout');
}

export async function fetchMoodMusic() {
  return apiRequest('/intelligence/mood-music');
}

export async function fetchSmartNotifications() {
  return apiRequest('/intelligence/smart-notifications');
}

export async function generatePersonalityReport() {
  return apiRequest('/intelligence/personality-report', { method: 'POST', body: '{}' });
}

export async function downloadPersonalityReport() {
  const token = getToken();
  const res = await fetch(apiUrl('/intelligence/personality-report'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ format: 'html' }),
  });
  if (!res.ok) throw new Error('Report download failed');
  const html = await res.text();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mira-personality-report.html';
  a.click();
  URL.revokeObjectURL(url);
}

export async function fetchLifeTimeline() {
  return apiRequest('/intelligence/timeline');
}

export async function fetchCapsules() {
  return apiRequest('/capsules');
}

export async function createCapsule(data) {
  return apiRequest('/capsules', { method: 'POST', body: JSON.stringify(data) });
}

export async function openCapsule(id) {
  return apiRequest(`/capsules/${id}/open`, { method: 'POST' });
}

export async function deleteCapsule(id) {
  return apiRequest(`/capsules/${id}`, { method: 'DELETE' });
}

export async function fetchDreams() {
  return apiRequest('/dreams');
}

export async function createDream(data) {
  return apiRequest('/dreams', { method: 'POST', body: JSON.stringify(data) });
}

export async function fetchDreamPatterns() {
  return apiRequest('/dreams/patterns');
}

export async function deleteDream(id) {
  return apiRequest(`/dreams/${id}`, { method: 'DELETE' });
}

export async function fetchVaultEntries() {
  return apiRequest('/vault');
}

export async function createVaultEntry(data) {
  return apiRequest('/vault', { method: 'POST', body: JSON.stringify(data) });
}

export async function unlockVaultEntry(id, passphrase) {
  return apiRequest(`/vault/${id}/unlock`, {
    method: 'POST',
    body: JSON.stringify({ passphrase }),
  });
}

export async function deleteVaultEntry(id) {
  return apiRequest(`/vault/${id}`, { method: 'DELETE' });
}
