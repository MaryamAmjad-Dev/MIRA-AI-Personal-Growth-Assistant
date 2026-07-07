import { apiRequest, apiUpload } from './client';

export const USER_CACHE_KEY = 'mira_user_cache';

export async function updateProfile(payload) {
  const data = await apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data?.user ?? data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  const data = await apiUpload('/users/avatar', formData);
  return data?.user ?? data;
}

export async function updatePassword({ currentPassword, newPassword }) {
  return apiRequest('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function deleteAccount({ password }) {
  return apiRequest('/users/account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
