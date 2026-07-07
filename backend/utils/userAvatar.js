import { getDefaultAvatarConfig, getPresetAvatar } from './defaultAvatar.js';

function isNonEmptyImage(image) {
  return Boolean(image && String(image).trim());
}

function resolveAvatarPreset(user) {
  if (!user) return 'female';

  if (user.avatarPreset === 'male' || user.avatarPreset === 'female') {
    return user.avatarPreset;
  }

  const type = user.avatarType || user.avatar?.type;
  if (type === 'male' || type === 'female') return type;

  if (type === 'custom' && user.avatarConfig?.gender === 'male') return 'male';
  if (user.gender === 'male') return 'male';
  return 'female';
}

export function hasValidAvatar(avatar) {
  if (!avatar || typeof avatar !== 'object') return false;

  const { image, preset, config, type } = avatar;

  if (isNonEmptyImage(image)) return true;
  if (preset === 'male' || preset === 'female') return true;
  if (type === 'male' || type === 'female') return true;
  if (type === 'custom' && config && typeof config === 'object') return true;
  if (config && typeof config === 'object' && Object.keys(config).length > 0) return true;

  return false;
}

export function normalizeAvatarPayload(payload, user) {
  if (!payload || typeof payload !== 'object') return null;

  const preset = payload.preset === 'male' ? 'male' : payload.preset === 'female' ? 'female' : resolveAvatarPreset(user);
  let { type, image, config } = payload;
  config = config ?? null;

  if (type === 'preset') {
    type = preset;
    image = getPresetAvatar(preset);
    config = config || getDefaultAvatarConfig(preset);
  }

  const clearingUpload =
    (type === 'upload' || user?.avatarType === 'upload')
    && !isNonEmptyImage(image);

  if (clearingUpload || (image === null && !hasValidAvatar({ type, image, preset, config }))) {
    type = preset;
    image = getPresetAvatar(preset);
    config = getDefaultAvatarConfig(preset);
  }

  if ((type === 'male' || type === 'female') && !isNonEmptyImage(image)) {
    image = getPresetAvatar(type);
    config = config || getDefaultAvatarConfig(type);
  }

  if (type === 'custom' && config && !isNonEmptyImage(image)) {
    const gender = config.gender === 'male' ? 'male' : 'female';
    image = getPresetAvatar(gender);
  }

  return { type, preset, image, config };
}

export function toPublicAvatar(user) {
  const legacyImage = typeof user.avatar === 'string' ? user.avatar : user.avatar?.image || '';
  const type = user.avatarType || user.avatar?.type || 'female';
  const config = user.avatarConfig ?? user.avatar?.config ?? null;
  const preset = type === 'male' || type === 'female' ? type : resolveAvatarPreset(user);

  return {
    type: ['male', 'female', 'custom', 'upload'].includes(type) ? type : 'female',
    preset,
    image: legacyImage,
    config,
  };
}

export function applyAvatarPayload(user, payload) {
  const normalized = normalizeAvatarPayload(payload, user);
  if (!normalized) return;

  const { type, image, config } = normalized;

  if (type && ['male', 'female', 'custom', 'upload'].includes(type)) {
    user.avatarType = type;
  }

  if (type === 'male') {
    user.avatar = isNonEmptyImage(image) ? image : getPresetAvatar('male');
    user.avatarConfig = config || getDefaultAvatarConfig('male');
    user.avatarType = 'male';
    user.markModified('avatarConfig');
    return;
  }

  if (type === 'female') {
    user.avatar = isNonEmptyImage(image) ? image : getPresetAvatar('female');
    user.avatarConfig = config || getDefaultAvatarConfig('female');
    user.avatarType = 'female';
    user.markModified('avatarConfig');
    return;
  }

  if (type === 'custom' && config) {
    const gender = config.gender === 'male' ? 'male' : 'female';
    user.avatar = getPresetAvatar(gender);
    user.avatarConfig = config;
    user.avatarType = 'custom';
    user.markModified('avatarConfig');
    return;
  }

  if (type === 'upload' && isNonEmptyImage(image)) {
    user.avatar = image;
    user.avatarConfig = config ?? null;
    user.avatarType = 'upload';
    return;
  }

  const fallback = resolveAvatarPreset(user);
  user.avatarType = fallback;
  user.avatar = getPresetAvatar(fallback);
  user.avatarConfig = getDefaultAvatarConfig(fallback);
  user.markModified('avatarConfig');
}
