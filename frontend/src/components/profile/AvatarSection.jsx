import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileAvatar from '../ProfileAvatar';
import AvatarEditorModal from '../avatar/AvatarEditorModal';
import Button from '../ui/Button';
import { uploadAvatar, updateProfile } from '../../api/user';
import {
  buildAvatarPayload,
  buildRemovePhotoPayload,
  normalizeUser,
} from '../../utils/userAvatar';
import { useToast } from '../../context/ToastContext';

/**
 * Profile / Settings avatar management — upload, create, remove
 */
export default function AvatarSection({ user, onUpdated }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [modalTab, setModalTab] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  const previewUser = useMemo(() => {
    if (previewDataUrl) {
      return normalizeUser({ ...user, avatar: { type: 'upload', image: previewDataUrl, config: null } });
    }
    if (pendingFile) {
      return normalizeUser({ ...user, avatar: { type: 'upload', image: URL.createObjectURL(pendingFile), config: null } });
    }
    return normalizeUser(user);
  }, [user, pendingFile, previewDataUrl]);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      addToast(t('avatar.invalidType'), 'error');
      return;
    }

    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewDataUrl(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const persistAvatar = async (payload) => {
    const updated = await updateProfile(payload);
    return syncSavedUser(updated);
  };

  const syncSavedUser = (updated) => {
    const normalized = normalizeUser(updated);
    onUpdated?.(normalized);
    return normalized;
  };

  const handleSaveUpload = async () => {
    if (!pendingFile && !previewDataUrl) return;
    try {
      setSaving(true);
      let updated;
      if (pendingFile) {
        try {
          updated = await uploadAvatar(pendingFile);
        } catch {
          updated = await updateProfile(buildAvatarPayload({
            type: 'upload',
            image: previewDataUrl,
            config: null,
          }));
        }
      } else {
        updated = await updateProfile(buildAvatarPayload({
          type: 'upload',
          image: previewDataUrl,
          config: null,
        }));
      }
      setPendingFile(null);
      setPreviewDataUrl(null);
      syncSavedUser(updated);
      addToast(t('toast.avatarUpdated'));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setSaving(true);
      setPendingFile(null);
      setPreviewDataUrl(null);
      await persistAvatar(buildRemovePhotoPayload(user));
      addToast(t('toast.avatarUpdated'));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleModalSaved = (updated) => {
    setPendingFile(null);
    setPreviewDataUrl(null);
    onUpdated?.(normalizeUser(updated));
    setModalTab(null);
  };

  return (
    <div className="avatar-section">
      <div className="avatar-section-preview">
        <ProfileAvatar user={previewUser} size="xl" level={user?.level} floating={false} />
        {(pendingFile || previewDataUrl) && (
          <span className="avatar-pending-badge">{t('avatar.previewPending')}</span>
        )}
      </div>

      <div className="avatar-section-actions">
        <label className="btn btn-primary avatar-section-btn">
          {t('avatar.uploadPhoto')}
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFilePick} />
        </label>
        <Button type="button" variant="ghost" onClick={() => setModalTab('design')}>
          {t('avatar.creator')}
        </Button>
        <Button type="button" variant="ghost" onClick={handleRemovePhoto} disabled={saving}>
          {t('avatar.removePhoto')}
        </Button>
      </div>

      {(pendingFile || previewDataUrl) && (
        <div className="avatar-section-save-row">
          <Button type="button" onClick={handleSaveUpload} disabled={saving}>
            {saving ? t('settings.saving') : t('avatar.savePhoto')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setPendingFile(null); setPreviewDataUrl(null); }}
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}

      {modalTab && (
        <AvatarEditorModal
          user={previewUser}
          initialTab={modalTab}
          onClose={() => setModalTab(null)}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}
