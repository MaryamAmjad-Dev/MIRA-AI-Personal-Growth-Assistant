import { apiRequest } from './client';

export async function fetchTasks(status) {
  const q = status ? `?status=${status}` : '';
  return apiRequest(`/tasks${q}`);
}

export async function createTask(data) {
  return apiRequest('/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTask(id, data) {
  return apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteTask(id) {
  return apiRequest(`/tasks/${id}`, { method: 'DELETE' });
}
