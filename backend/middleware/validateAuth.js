import { sendError } from '../utils/apiResponse.js';

const AVATAR_PREFS = ['male', 'female', 'custom', 'upload'];

export function validateRegister(req, res, next) {
  const { name, email, password, avatarPreference, gender, avatarConfig } = req.body;
  const errors = [];

  if (!name?.trim()) errors.push('Name is required');
  if (!email?.trim()) errors.push('Email is required');
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Invalid email format');
  if (!password) errors.push('Password is required');
  else if (password.length < 8) errors.push('Password must be at least 8 characters');

  const pref = avatarPreference || gender;
  if (!pref) {
    errors.push('Please choose an avatar preference');
  } else if (!AVATAR_PREFS.includes(pref) && !['male', 'female'].includes(pref)) {
    errors.push('Invalid avatar preference');
  }

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatarPreference: AVATAR_PREFS.includes(pref) ? pref : pref,
    gender: gender || undefined,
    avatarConfig: avatarConfig || undefined,
    provider: 'local',
  };
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = { email: email.trim().toLowerCase(), password };
  next();
}

export function validateGoogleAuth(req, res, next) {
  const { credential } = req.body;

  if (!credential?.trim()) {
    return sendError(res, 'Google credential is required', 400);
  }

  req.body = { credential: credential.trim() };
  next();
}

export function validateForgotPassword(req, res, next) {
  const { email } = req.body;
  const errors = [];

  if (!email?.trim()) errors.push('Email is required');
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.push('Invalid email format');

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = { email: email.trim().toLowerCase() };
  next();
}

export function validateResetPassword(req, res, next) {
  const { password, confirmPassword } = req.body;
  const errors = [];

  if (!password) errors.push('Password is required');
  else if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!confirmPassword) errors.push('Confirm password is required');
  else if (password !== confirmPassword) errors.push('Passwords do not match');

  if (errors.length) return sendError(res, 'Validation failed', 400, errors);

  req.body = { password, confirmPassword };
  next();
}
