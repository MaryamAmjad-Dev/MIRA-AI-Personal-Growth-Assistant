import { apiRequest } from './client';

export async function fetchBadges() {
  return apiRequest('/achievements/badges');
}

export async function fetchNotifications() {
  return apiRequest('/achievements/notifications');
}

export async function markNotificationRead(id) {
  return apiRequest(`/achievements/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead() {
  return apiRequest('/achievements/notifications/read-all', { method: 'PATCH' });
}
