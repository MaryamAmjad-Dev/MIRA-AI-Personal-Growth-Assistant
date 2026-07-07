export function getDefaultAvatarConfig(gender) {
  if (gender === 'male') {
    return {
      gender: 'male',
      skin: '#FDDCBF',
      hair: 'short',
      hairColor: '#4A3728',
      bg: '#E0F2FE',
      expression: 'smile',
      accessory: 'none',
    };
  }
  return {
    gender: 'female',
    skin: '#FDDCBF',
    hair: 'long',
    hairColor: '#8B5CF6',
    bg: '#F5E8FF',
    expression: 'smile',
    accessory: 'none',
  };
}

export function getPresetAvatar(gender) {
  return gender === 'male' ? 'preset:male' : 'preset:female';
}

export function normalizeGender(gender) {
  if (gender === 'male' || gender === 'female') return gender;
  return 'female';
}
