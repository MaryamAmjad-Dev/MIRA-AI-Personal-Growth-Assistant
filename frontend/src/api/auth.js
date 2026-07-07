import { apiRequest, clearToken, setToken } from './client';

export async function register(payload) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function loginWithGoogle(credential) {
  const data = await apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  setToken(data.token);
  return data;
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export async function fetchMe() {
  return apiRequest('/auth/me');
}

export async function forgotPassword(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, { password, confirmPassword }) {
  return apiRequest(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password, confirmPassword }),
  });
}

export const authAPI = {
  register,
  login,
  loginWithGoogle,
  logout,
  fetchMe,
  forgotPassword,
  resetPassword,
};

export { clearToken, getToken, setToken } from './client';
