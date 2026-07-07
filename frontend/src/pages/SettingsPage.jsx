import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../context/ToastContext';
import { updateProfile, updatePassword, deleteAccount } from '../api/user';
import { exportJournal } from '../api/journal';
import { ROUTES } from '../constants/routes';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ConfirmModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AvatarSection from '../components/profile/AvatarSection';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading('profile');
      const updated = await updateProfile({ name, bio, timezone });
      updateUser(updated);
      addToast(t('toast.profileUpdated'));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading('password');
      await updatePassword({ currentPassword, newPassword });
      addToast(t('toast.passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading('');
    }
  };

  const handleExport = async (format) => {
    try {
      await exportJournal(format);
      addToast(format === 'json' ? t('export.successJson') : t('export.successCsv'));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading('delete');
      await deleteAccount(user?.provider === 'local' ? { password: deletePassword } : {});
      await logout();
      addToast(t('toast.accountDeleted'));
      navigate(ROUTES.LOGIN);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading('');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page settings-page">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Card className="settings-section animate-in" interactive={false}>
        <h3>{t('settings.account')}</h3>
        <p className="settings-desc settings-email-readonly">
          {t('auth.email')}: <strong>{user?.email}</strong>
        </p>
        <form onSubmit={handleUpdateProfile} className="settings-form">
          <Input label={t('settings.displayName')} value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label={t('settings.bio')} value={bio} onChange={(e) => setBio(e.target.value)} />
          <Input label={t('settings.timezone')} value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          <Button type="submit" disabled={loading === 'profile'}>
            {loading === 'profile' ? t('settings.saving') : t('settings.saveName')}
          </Button>
        </form>
        <div className="settings-avatar-block">
          <h4>{t('avatar.sectionTitle')}</h4>
          <AvatarSection user={user} onUpdated={updateUser} />
        </div>
      </Card>

      <Card className="settings-section animate-in" interactive={false}>
        <h3>{t('settings.appearance')}</h3>
        <p className="settings-desc">{t('settings.currentTheme')}: <strong>{theme}</strong></p>
        <ThemeSwitcher />
        <div className="settings-language-block">
          <h4>{t('settings.language')}</h4>
          <p className="settings-desc">{t('settings.languageDesc')}</p>
          <LanguageSwitcher />
        </div>
      </Card>

      <Card className="settings-section animate-in" interactive={false}>
        <h3>{t('settings.password')}</h3>
        {user?.provider === 'google' ? (
          <p className="settings-desc">{t('settings.googlePasswordNote')}</p>
        ) : (
          <form onSubmit={handleUpdatePassword} className="settings-form">
            <Input label={t('settings.currentPassword')} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input label={t('settings.newPassword')} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
            <Button type="submit" disabled={loading === 'password'}>
              {loading === 'password' ? t('settings.updating') : t('settings.updatePassword')}
            </Button>
          </form>
        )}
      </Card>

      <Card className="settings-section settings-security animate-in" interactive={false}>
        <h3>{t('settings.security')}</h3>
        <p className="settings-desc">{t('settings.logoutDesc')}</p>
        <Button type="button" variant="ghost" className="settings-logout-btn" onClick={handleLogout}>
          {t('auth.logout')}
        </Button>
      </Card>

      <Card className="settings-section animate-in" interactive={false}>
        <h3>{t('settings.exportData')}</h3>
        <p className="settings-desc">{t('settings.exportDesc')}</p>
        <div className="settings-actions">
          <Button variant="ghost" onClick={() => handleExport('json')}>{t('settings.exportJson')}</Button>
          <Button variant="ghost" onClick={() => handleExport('csv')}>{t('settings.exportCsv')}</Button>
        </div>
      </Card>

      <Card className="settings-section settings-danger animate-in" interactive={false}>
        <h3>{t('settings.deleteAccount')}</h3>
        <p className="settings-desc">{t('settings.deleteDesc')}</p>
        {user?.provider === 'local' && (
          <Input label={t('settings.confirmPassword')} type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
        )}
        <Button variant="danger" onClick={() => setShowDeleteModal(true)} disabled={user?.provider === 'local' && !deletePassword}>
          {t('settings.deleteAccount')}
        </Button>
      </Card>

      {showDeleteModal && (
        <ConfirmModal
          title={t('settings.deleteModalTitle')}
          message={t('settings.deleteModalMessage')}
          confirmLabel={t('settings.deleteForever')}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading === 'delete'}
        />
      )}
    </div>
  );
}
