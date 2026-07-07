import { apiRequest } from './client';

export async function fetchHabits() {
  return apiRequest('/habits');
}

export async function createHabit(data) {
  return apiRequest('/habits', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateHabit(id, data) {
  return apiRequest(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteHabit(id) {
  return apiRequest(`/habits/${id}`, { method: 'DELETE' });
}

export async function completeHabit(id) {
  return apiRequest(`/habits/${id}/complete`, { method: 'POST' });
}
