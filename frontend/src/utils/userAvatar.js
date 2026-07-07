import {
  getDefaultConfigForGender,
  getPresetAvatar,
  isUploadedAvatar,
} from './avatarDefaults';

function isNonEmptyImage(image) {
  return Boolean(image && String(image).trim());
}

/** Resolve male/female preset key from stored user fields */
export function resolveAvatarPreset(user) {
  if (!user) return 'female';

  const explicit = user.avatarPreset ?? user.avatar?.preset;
  if (explicit === 'male' || explicit === 'female') return explicit;

  const type = user.avatar?.type || user.avatarType;
  if (type === 'male' || type === 'female') return type;

  if (type === 'custom') {
    const gender = user.avatar?.config?.gender ?? user.avatarConfig?.gender;
    if (gender === 'male') return 'male';
  }

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

export function normalizeAvatarPayload(avatar, user) {
  if (!avatar || typeof avatar !== 'object') return null;

  const preset = avatar.preset === 'male' ? 'male' : avatar.preset === 'female' ? 'female' : resolveAvatarPreset(user);
  let type = avatar.type;
  let image = avatar.image;
  let config = avatar.config ?? null;

  if (type === 'preset') {
    type = preset;
    image = getPresetAvatar(preset);
    config = config || getDefaultConfigForGender(preset);
  }

  const clearingUpload =
    (type === 'upload' || user?.avatarType === 'upload' || user?.avatar?.type === 'upload')
    && !isNonEmptyImage(image);

  if (clearingUpload || (image === null && (type === 'upload' || !hasValidAvatar({ ...avatar, image, type, preset })))) {
    type = preset;
    image = getPresetAvatar(preset);
    config = getDefaultConfigForGender(preset);
  }

  if ((type === 'male' || type === 'female') && !isNonEmptyImage(image)) {
    image = getPresetAvatar(type);
    config = config || getDefaultConfigForGender(type);
  }

  if (type === 'custom' && config && !isNonEmptyImage(image)) {
    const gender = config.gender === 'male' ? 'male' : 'female';
    image = getPresetAvatar(gender);
  }

  return { type, preset, image, config };
}

/** Normalize API user to always include avatar: { type, image, config } */
export function normalizeUser(user) {
  if (!user) return user;

  const avatar = normalizeAvatar(user);
  const avatarPreset = resolveAvatarPreset(user);

  return {
    ...user,
    avatar,
    avatarType: avatar.type,
    avatarConfig: avatar.config,
    avatarPreset,
  };
}

export function normalizeAvatar(user) {
  if (!user) {
    return { type: 'female', image: getPresetAvatar('female'), config: getDefaultConfigForGender('female') };
  }

  if (user.avatar && typeof user.avatar === 'object' && user.avatar.type) {
    return {
      type: user.avatar.type,
      image: user.avatar.image ?? '',
      config: user.avatar.config ?? null,
      ...(user.avatar.preset ? { preset: user.avatar.preset } : {}),
    };
  }

  const type = user.avatarType || 'female';
  const image = typeof user.avatar === 'string' ? user.avatar : '';

  return {
    type,
    image,
    config: user.avatarConfig ?? null,
  };
}

export function getAvatarImage(user) {
  return normalizeAvatar(user).image;
}

export function getAvatarType(user) {
  return normalizeAvatar(user).type;
}

export function isUserUploadedAvatar(user) {
  const { type, image } = normalizeAvatar(user);
  return type === 'upload' || isUploadedAvatar(image);
}

export function buildAvatarPayload({ type, preset, image, config, gender }) {
  const normalized = normalizeAvatarPayload({ type, preset, image, config }, { gender, avatarType: type });
  const resolvedType = normalized?.type ?? type ?? 'female';
  const resolvedImage = normalized?.image ?? image ?? '';
  const resolvedConfig = normalized?.config ?? config ?? null;
  const resolvedPreset = normalized?.preset ?? (resolvedType === 'male' || resolvedType === 'female' ? resolvedType : preset);

  return {
    avatar: {
      type: resolvedType,
      ...(resolvedPreset ? { preset: resolvedPreset } : {}),
      image: resolvedImage,
      config: resolvedConfig,
    },
    avatarType: resolvedType,
    avatarConfig: resolvedConfig,
    ...(gender ? { gender } : {}),
  };
}

export function buildRemovePhotoPayload(user) {
  const preset = resolveAvatarPreset(user);
  const config = getDefaultConfigForGender(preset);

  return buildAvatarPayload({
    type: 'preset',
    preset,
    image: null,
    config,
    gender: preset,
  });
}
