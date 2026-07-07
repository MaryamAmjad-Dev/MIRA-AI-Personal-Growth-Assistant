export const SKIN_TONES = [
  { id: 'light', color: '#FDDCBF' },
  { id: 'warm', color: '#F5C4A1' },
  { id: 'tan', color: '#E8B896' },
  { id: 'brown', color: '#C68642' },
  { id: 'deep', color: '#8D5524' },
];

export const HAIR_COLORS = [
  { id: 'brown', color: '#4A3728' },
  { id: 'black', color: '#1E1B4B' },
  { id: 'purple', color: '#8B5CF6' },
  { id: 'pink', color: '#FB7185' },
  { id: 'blonde', color: '#FDE68A' },
];

export const BG_COLORS = [
  { id: 'lavender', color: '#F5E8FF' },
  { id: 'pink', color: '#FCE7F3' },
  { id: 'rose', color: '#FECDD3' },
  { id: 'sky', color: '#E0F2FE' },
  { id: 'mint', color: '#D1FAE5' },
];

export const DEFAULT_MALE_CONFIG = {
  gender: 'male',
  skin: '#FDDCBF',
  hair: 'short',
  hairColor: '#4A3728',
  bg: '#E0F2FE',
  expression: 'smile',
  accessory: 'none',
};

export const DEFAULT_FEMALE_CONFIG = {
  gender: 'female',
  skin: '#FDDCBF',
  hair: 'long',
  hairColor: '#8B5CF6',
  bg: '#F5E8FF',
  expression: 'smile',
  accessory: 'none',
};

export function getDefaultConfigForGender(gender) {
  if (gender === 'male') return { ...DEFAULT_MALE_CONFIG };
  return { ...DEFAULT_FEMALE_CONFIG };
}

export function getPresetAvatar(gender) {
  return gender === 'male' ? 'preset:male' : 'preset:female';
}

export function isUploadedAvatar(src) {
  if (!src) return false;
  return src.includes('/uploads/') || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http');
}

export function isPresetAvatar(src) {
  return src === 'preset:male' || src === 'preset:female';
}

export function resolveAvatarConfig(user) {
  if (!user) return DEFAULT_FEMALE_CONFIG;

  const type = user.avatar?.type || user.avatarType;
  const config = user.avatar?.config ?? user.avatarConfig;
  const image = typeof user.avatar === 'string' ? user.avatar : user.avatar?.image;

  if (config && typeof config === 'object') {
    const baseGender = type === 'male' || config.gender === 'male' ? 'male' : 'female';
    return { ...getDefaultConfigForGender(baseGender), ...config };
  }

  if (type === 'male' || image === 'preset:male') return { ...DEFAULT_MALE_CONFIG };
  if (type === 'female' || image === 'preset:female') return { ...DEFAULT_FEMALE_CONFIG };
  if (type === 'custom' && config) return { ...config };

  return getDefaultConfigForGender(user.gender === 'male' ? 'male' : 'female');
}
