import { LANGUAGE_STORAGE_KEY } from '../i18n/languages';

const TOKEN_KEY = 'access_token';
const LEGACY_TOKEN_KEY = 'mood_journal_token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || API_URL.replace(/\/api\/?$/, '');

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);
  if (legacyToken) {
    localStorage.setItem(TOKEN_KEY, legacyToken);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return legacyToken;
  }

  return null;
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function apiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

export function resolveAssetUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return url;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearToken();
    unauthorizedHandler?.();
  }

  if (!response.ok || data.success === false) {
    const message = data.message || 'Something went wrong';
    const error = new Error(message);
    if (data.errors) error.errors = data.errors;
    error.unauthorized = response.status === 401;
    throw error;
  }

  return data.data ?? data;
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  let lang = 'en';
  try {
    lang = localStorage.getItem(LANGUAGE_STORAGE_KEY)?.split('-')[0] || 'en';
  } catch { /* SSR */ }

  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': lang,
    'X-MIRA-Language': lang,
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl(path), { ...options, headers });
  return handleResponse(response);
}

export async function apiDownload(path) {
  const token = getToken();
  const response = await fetch(apiUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 401) {
    clearToken();
    unauthorizedHandler?.();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Download failed');
  }

  return response;
}

export async function apiUpload(path, formData) {
  const token = getToken();
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  return handleResponse(response);
}

export { API_URL, TOKEN_KEY };
