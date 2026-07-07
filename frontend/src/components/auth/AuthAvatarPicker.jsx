import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProfileAvatar from '../ProfileAvatar';
import CustomAvatar from '../avatar/CustomAvatar';
import AvatarCreator from '../avatar/AvatarCreator';
import { getDefaultConfigForGender } from '../../utils/avatarDefaults';

const PREFS = [
  { id: 'male', icon: '👨', preview: 'male' },
  { id: 'female', icon: '👩', preview: 'female' },
  { id: 'custom', icon: '✨', preview: null },
  { id: 'upload', icon: '📷', preview: null },
];

export default function AuthAvatarPicker({
  avatarPreference,
  onPreferenceChange,
  previewUser,
  builderGender,
  onBuilderGenderChange,
  avatarConfig,
  onAvatarConfigChange,
  onUploadPick,
  uploadFileName,
  disabled = false,
}) {
  const { t } = useTranslation();

  return (
    <div className="auth-avatar-picker">
      <div className="auth-avatar-preview-stage">
        <motion.div
          className="auth-avatar-orbit"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
        <div className="auth-avatar-glow-ring">
          <ProfileAvatar user={previewUser} size="xl" floating={false} />
        </div>
        <motion.span
          className="auth-avatar-float-butterfly"
          animate={{ x: [0, 14, -10, 0], y: [0, -12, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          🦋
        </motion.span>
      </div>

      <p className="auth-avatar-picker-label">{t('avatar.choosePreference')}</p>

      <div className="auth-avatar-options">
        {PREFS.map(({ id, icon }) => (
          <button
            key={id}
            type="button"
            className={`auth-avatar-option ${avatarPreference === id ? 'selected' : ''}`}
            onClick={() => onPreferenceChange(id)}
            disabled={disabled}
          >
            <span className="auth-avatar-option-icon">{icon}</span>
            <span className="auth-avatar-option-label">{t(`avatar.pref.${id}`)}</span>
            {avatarPreference === id && <span className="auth-avatar-option-sparkle" aria-hidden="true">✨</span>}
          </button>
        ))}
      </div>

      {avatarPreference === 'custom' && (
        <div className="auth-avatar-custom">
          <div className="avatar-gender-row">
            <button
              type="button"
              className={`avatar-chip ${builderGender === 'male' ? 'active' : ''}`}
              onClick={() => {
                onBuilderGenderChange('male');
                onAvatarConfigChange(getDefaultConfigForGender('male'));
              }}
            >
              {t('avatar.male')}
            </button>
            <button
              type="button"
              className={`avatar-chip ${builderGender === 'female' ? 'active' : ''}`}
              onClick={() => {
                onBuilderGenderChange('female');
                onAvatarConfigChange(getDefaultConfigForGender('female'));
              }}
            >
              {t('avatar.female')}
            </button>
          </div>
          <AvatarCreator gender={builderGender} initialConfig={avatarConfig} onChange={onAvatarConfigChange} />
        </div>
      )}

      {avatarPreference === 'upload' && (
        <label className="auth-upload-zone">
          <span className="auth-upload-icon">📷</span>
          <span>{uploadFileName || t('avatar.uploadPhoto')}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onUploadPick} disabled={disabled} />
        </label>
      )}

      {(avatarPreference === 'male' || avatarPreference === 'female') && (
        <div className="auth-avatar-mini-previews">
          <CustomAvatar config={getDefaultConfigForGender(avatarPreference)} />
        </div>
      )}
    </div>
  );
}
