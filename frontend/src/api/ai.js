import { apiRequest, apiUrl, getToken } from './client';

export async function analyzeEntry(payload) {
  return apiRequest('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function writingAssist(action, payload) {
  return apiRequest('/ai/writing', {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
  });
}

export async function fetchAiSummary() {
  return apiRequest('/ai/summary');
}

export async function fetchAiRecommendations() {
  return apiRequest('/ai/recommendations');
}

export async function chatWithCoach(message) {
  return apiRequest('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function fetchChatHistory() {
  return apiRequest('/ai/history');
}

export async function clearChatHistory() {
  return apiRequest('/ai/history', { method: 'DELETE' });
}

export async function explainMood() {
  return apiRequest('/ai/explain-mood');
}

export async function fetchMoodPrediction() {
  return apiRequest('/ai/prediction');
}

export async function fetchHabitInsights() {
  return apiRequest('/ai/habit-insights');
}

export async function fetchGoalInsights() {
  return apiRequest('/ai/goal-insights');
}

export async function fetchDailyCheckin() {
  return apiRequest('/ai/checkin');
}

export async function submitDailyCheckin(data) {
  return apiRequest('/ai/checkin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchDashboardInsights() {
  return apiRequest('/ai/dashboard');
}

export async function aiSearch(query) {
  return apiRequest(`/ai/search?q=${encodeURIComponent(query)}`);
}

export async function generateReport(period = 'weekly') {
  return apiRequest('/ai/report', {
    method: 'POST',
    body: JSON.stringify({ period }),
  });
}

export async function downloadReport(period = 'weekly') {
  const token = getToken();
  const res = await fetch(apiUrl('/ai/report'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ period, format: 'html' }),
  });
  if (!res.ok) throw new Error('Report download failed');
  const html = await res.text();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wellness-report-${period}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadFile(file) {
  const { apiUpload } = await import('./client');
  const formData = new FormData();
  formData.append('file', file);
  return apiUpload('/upload/image', formData);
}

export async function fetchAdvancedAnalytics() {
  return apiRequest('/journal/analytics/advanced');
}
