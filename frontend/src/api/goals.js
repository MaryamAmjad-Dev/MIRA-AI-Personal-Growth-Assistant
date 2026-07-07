import { apiRequest } from './client';

export async function fetchGoals() {
  return apiRequest('/goals');
}

export async function createGoal(data) {
  return apiRequest('/goals', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateGoal(id, data) {
  return apiRequest(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function toggleMilestone(goalId, index) {
  return apiRequest(`/goals/${goalId}/milestones/${index}`, { method: 'PATCH' });
}

export async function deleteGoal(id) {
  return apiRequest(`/goals/${id}`, { method: 'DELETE' });
}
