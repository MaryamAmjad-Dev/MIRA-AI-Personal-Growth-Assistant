import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarCreator from './AvatarCreator';
import CustomAvatar from './CustomAvatar';
import ProfileAvatar from '../ProfileAvatar';
import Button from '../ui/Button';
import { uploadAvatar, updateProfile } from '../../api/user';
import { useToast } from '../../context/ToastContext';
import {
  getDefaultConfigForGender,
  getPresetAvatar,
} from '../../utils/avatarDefaults';
import { buildAvatarPayload, buildRemovePhotoPayload, isUserUploadedAvatar, normalizeUser } from '../../utils/userAvatar';

export default function AvatarEditorModal({ user, onClose, onSaved, initialTab = 'design' }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [tab, setTab] = useState(initialTab);
  const [gender, setGender] = useState(user?.gender || 'female');
  const [builderConfig, setBuilderConfig] = useState(
    user?.avatarConfig || getDefaultConfigForGender(user?.gender || 'female')
  );
  const [previewUser, setPreviewUser] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const displayUser = previewUser || user;

  const finishSave = (updated) => {
    const normalized = normalizeUser(updated);
    setPreviewUser(normalized);
    onSaved?.(normalized);
    addToast(t('toast.avatarUpdated'));
    onClose();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError(t('avatar.invalidType'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setSaving(true);
        setError('');
        const dataUrl = reader.result;
        setPreviewUser(normalizeUser({ ...user, avatar: { type: 'upload', image: dataUrl, config: null } }));

        let updated;
        try {
          updated = await uploadAvatar(file);
        } catch {
          updated = await updateProfile(buildAvatarPayload({
            type: 'upload',
            image: dataUrl,
            config: null,
          }));
        }
        finishSave(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePreset = async (g) => {
    try {
      setSaving(true);
      setError('');
      const config = getDefaultConfigForGender(g);
      setPreviewUser(normalizeUser({
        ...user,
        gender: g,
        avatar: { type: g, image: getPresetAvatar(g), config },
      }));

      const updated = await updateProfile(buildAvatarPayload({
        type: g,
        image: getPresetAvatar(g),
        config,
        gender: g,
      }));
      finishSave(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDesign = async () => {
    try {
      setSaving(true);
      setError('');
      const optimistic = normalizeUser({
        ...user,
        gender,
        avatar: { type: 'custom', image: getPresetAvatar(gender), config: builderConfig },
      });
      setPreviewUser(optimistic);

      const updated = await updateProfile(buildAvatarPayload({
        type: 'custom',
        image: getPresetAvatar(gender),
        config: builderConfig,
        gender,
      }));
      finishSave(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = buildRemovePhotoPayload(user);
      setPreviewUser(normalizeUser({ ...user, ...payload }));

      const updated = await updateProfile(payload);
      finishSave(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const showUpload = isUserUploadedAvatar(user);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay avatar-editor-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal glass-card card-3d avatar-editor-modal"
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="avatar-editor-header">
            <h2>{t('avatar.editTitle')}</h2>
            <button type="button" className="mobile-menu-close" onClick={onClose} aria-label={t('common.close')}>×</button>
          </div>

          <div className="avatar-editor-toolbar">
            <Button type="button" variant="ghost" onClick={handleRemovePhoto} disabled={saving}>
              {t('avatar.removePhoto')}
            </Button>
          </div>

          <div className="avatar-editor-current">
            <ProfileAvatar user={displayUser} size="lg" floating={false} />
          </div>

          <div className="avatar-editor-tabs">
            {['upload', 'preset', 'design'].map((key) => (
              <button
                key={key}
                type="button"
                className={`avatar-editor-tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                {t(`avatar.tab.${key}`)}
              </button>
            ))}
          </div>

          {error && <p className="auth-error">{error}</p>}

          {tab === 'upload' && (
            <div className="avatar-editor-panel">
              <p className="settings-desc">{t('avatar.uploadDesc')}</p>
              <label className="btn btn-primary avatar-upload-btn">
                {t('avatar.uploadPhoto')}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleUpload} disabled={saving} />
              </label>
              {showUpload && <p className="settings-desc">{t('avatar.currentUpload')}</p>}
            </div>
          )}

          {tab === 'preset' && (
            <div className="avatar-editor-panel">
              <p className="settings-desc">{t('avatar.presetDesc')}</p>
              <div className="avatar-preset-grid">
                <button type="button" className="avatar-preset-card glass-card" onClick={() => handlePreset('male')} disabled={saving}>
                  <CustomAvatar config={getDefaultConfigForGender('male')} />
                  <span>{t('avatar.male')}</span>
                </button>
                <button type="button" className="avatar-preset-card glass-card" onClick={() => handlePreset('female')} disabled={saving}>
                  <CustomAvatar config={getDefaultConfigForGender('female')} />
                  <span>{t('avatar.female')}</span>
                </button>
              </div>
            </div>
          )}

          {tab === 'design' && (
            <div className="avatar-editor-panel">
              <div className="avatar-gender-row">
                <button
                  type="button"
                  className={`avatar-chip ${gender === 'male' ? 'active' : ''}`}
                  onClick={() => {
                    setGender('male');
                    setBuilderConfig(getDefaultConfigForGender('male'));
                  }}
                >
                  {t('avatar.male')}
                </button>
                <button
                  type="button"
                  className={`avatar-chip ${gender === 'female' ? 'active' : ''}`}
                  onClick={() => {
                    setGender('female');
                    setBuilderConfig(getDefaultConfigForGender('female'));
                  }}
                >
                  {t('avatar.female')}
                </button>
              </div>
              <AvatarCreator
                gender={gender}
                initialConfig={builderConfig}
                onChange={setBuilderConfig}
              />
              <Button className="avatar-save-design" onClick={handleSaveDesign} disabled={saving}>
                {saving ? t('settings.saving') : t('avatar.saveDesign')}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
