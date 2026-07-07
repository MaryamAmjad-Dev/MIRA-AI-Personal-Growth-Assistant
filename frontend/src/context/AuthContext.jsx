import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {

  clearToken,

  fetchMe,

  login as apiLogin,

  loginWithGoogle as apiLoginWithGoogle,

  logout as apiLogout,

  register as apiRegister,

} from '../api/auth';

import { getToken, setUnauthorizedHandler } from '../api/client';

import { USER_CACHE_KEY } from '../api/user';
import { normalizeUser } from '../utils/userAvatar';

import { ROUTES } from '../constants/routes';

import { readStoredLanguage } from '../i18n/languages';
import i18n from '../i18n';

async function syncLanguage(profileLang) {
  const lang = readStoredLanguage() || profileLang || 'en';
  const current = i18n.language?.split('-')[0];
  if (current !== lang) await i18n.changeLanguage(lang);
}

const AuthContext = createContext(null);

function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY) || localStorage.getItem('user');
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}



function writeCachedUser(user) {
  try {
    const normalized = user ? normalizeUser(user) : null;
    if (normalized) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(normalized));
      localStorage.setItem('user', JSON.stringify(normalized));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem('user');
    }
  } catch {
    /* ignore quota errors */
  }
}



export function AuthProvider({ children }) {

  const navigate = useNavigate();

  const [user, setUser] = useState(() => readCachedUser());

  const [token, setTokenState] = useState(() => getToken());

  const [loading, setLoading] = useState(true);



  const applyUser = useCallback((nextUser) => {
    const normalized = nextUser ? normalizeUser(nextUser) : null;
    setUser(normalized);
    writeCachedUser(normalized);
  }, []);



  const handleUnauthorized = useCallback(() => {

    clearToken();

    setTokenState(null);

    applyUser(null);

    navigate(ROUTES.LOGIN, { replace: true });

  }, [navigate, applyUser]);



  useEffect(() => {

    setUnauthorizedHandler(handleUnauthorized);

    return () => setUnauthorizedHandler(null);

  }, [handleUnauthorized]);



  const loadUser = useCallback(async () => {

    const savedToken = getToken();

    setTokenState(savedToken);



    if (!savedToken) {

      applyUser(null);

      setLoading(false);

      return;

    }



    try {

      const data = await fetchMe();

      applyUser(data);

      await syncLanguage(data?.language);

    } catch {

      clearToken();

      setTokenState(null);

      applyUser(null);

    } finally {

      setLoading(false);

    }

  }, [applyUser]);



  useEffect(() => {

    loadUser();

  }, [loadUser]);



  const login = useCallback(async (credentials) => {

    const data = await apiLogin(credentials);

    setTokenState(data.token);

    applyUser(data.user);

    await syncLanguage(data.user?.language);

    return data;

  }, [applyUser]);



  const register = useCallback(async (payload) => {

    const data = await apiRegister(payload);

    setTokenState(data.token);

    applyUser(data.user);

    await syncLanguage(data.user?.language);

    return data;

  }, [applyUser]);



  const loginWithGoogle = useCallback(async (credential) => {

    const data = await apiLoginWithGoogle(credential);

    setTokenState(data.token);

    applyUser(data.user);

    await syncLanguage(data.user?.language);

    return data;

  }, [applyUser]);



  const logout = useCallback(async () => {

    try {

      await apiLogout();

    } catch {

      // Token may already be invalid; still clear local session.

    } finally {

      clearToken();

      setTokenState(null);

      applyUser(null);

    }

  }, [applyUser]);



  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!updates) return prev;
      const next = updates._id || updates.email
        ? normalizeUser(updates)
        : prev
          ? normalizeUser({ ...prev, ...updates })
          : prev;
      writeCachedUser(next);
      return next;
    });
  }, []);



  const value = useMemo(

    () => ({

      user,

      token,

      loading,

      login,

      register,

      loginWithGoogle,

      logout,

      loadUser,

      updateUser,

      isAuthenticated: Boolean(user && token),

    }),

    [user, token, loading, login, register, loginWithGoogle, logout, loadUser, updateUser]

  );



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}



export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within AuthProvider');

  return context;

}

