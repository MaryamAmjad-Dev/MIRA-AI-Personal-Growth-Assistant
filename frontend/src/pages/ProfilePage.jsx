import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';
import { fetchBadges } from '../api/achievements';
import { updateProfile } from '../api/user';
import Card from '../components/ui/Card';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AvatarSection from '../components/profile/AvatarSection';
import { useToast } from '../context/ToastContext';
import { normalizeUser } from '../utils/userAvatar';
import { ROUTES } from '../constants/routes';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { theme } = useTheme();
  const { stats } = useStats();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [badges, setBadges] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBadges().then(setBadges).catch(() => {}); }, []);
  useEffect(() => { setName(user?.name || ''); }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateProfile({
        name: name.trim(),
        preferences: { ...user?.preferences, theme },
      });
      updateUser(normalizeUser(updated));
      addToast(t('toast.profileUpdated'));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="page profile-page">
      <motion.div
        className="profile-hero card-3d glass-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="profile-hero-bg" aria-hidden="true" />
        <div className="profile-hero-content">
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          <p className="profile-crafted">{t('profile.wellnessJourney')}</p>
          <div className="xp-bar-wrap profile-xp">
            <span>{t('profile.level')} {user?.level ?? 1}</span>
            <div className="xp-bar">
              <motion.div
                className="xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${((user?.xp ?? 0) % 200) / 2}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <span><AnimatedCounter value={user?.xp ?? 0} /> XP</span>
          </div>
        </div>
      </motion.div>

      <Card className="profile-avatar-card" interactive={false}>
        <h3>{t('avatar.sectionTitle')}</h3>
        <p className="settings-desc">{t('avatar.sectionDesc')}</p>
        <AvatarSection user={user} onUpdated={updateUser} />
      </Card>

      <Card className="profile-edit-card" interactive={false}>
        <h3>{t('profile.editProfile')}</h3>
        <form onSubmit={handleSaveProfile} className="profile-edit-form">
          <Input label={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="profile-edit-row">
            <label className="profile-edit-label">{t('settings.language')}</label>
            <LanguageSwitcher />
          </div>
          <div className="profile-edit-row">
            <label className="profile-edit-label">{t('settings.appearance')}</label>
            <ThemeSwitcher />
          </div>
          <div className="profile-edit-actions">
            <Button type="submit" disabled={saving}>
              {saving ? t('settings.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </Card>

      <div className="profile-stats-grid">
        {[
          { label: t('profile.entries'), value: stats?.totalEntries ?? 0 },
          { label: t('profile.streak'), value: stats?.streak ?? 0 },
          { label: t('profile.topMood'), value: stats?.mostSelectedMood?.emoji ?? '—', isEmoji: true },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="profile-stat-card card-3d glass-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <span className="profile-stat-value">
              {s.isEmoji ? s.value : <AnimatedCounter value={s.value} />}
            </span>
            <span className="profile-stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {badges && (
        <Card className="badges-section" interactive={false}>
          <h3>{t('profile.achievements')}</h3>
          <div className="badges-grid">
            {badges.earned?.map((b, i) => (
              <motion.div
                key={b.key}
                className="badge-card badge-unlocked card-3d"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -8, scale: 1.04 }}
              >
                <span className="badge-glow" aria-hidden="true" />
                <span className="badge-icon">{b.icon}</span>
                <strong>{b.title}</strong>
                <p>{b.description}</p>
              </motion.div>
            ))}
            {badges.locked?.slice(0, 4).map((b) => (
              <div key={b.key} className="badge-card badge-locked card-3d">
                <span className="badge-icon">{b.icon}</span>
                <strong>{b.title}</strong>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="settings-section settings-security" interactive={false}>
        <h3>{t('settings.security')}</h3>
        <Button type="button" variant="ghost" className="settings-logout-btn" onClick={handleLogout}>
          {t('auth.logout')}
        </Button>
      </Card>
    </div>
  );
}
