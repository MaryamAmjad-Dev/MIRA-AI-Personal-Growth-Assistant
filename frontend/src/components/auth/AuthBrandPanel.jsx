import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../brand/BrandLogo';
import AIOrb from '../ai/AIOrb';
import ProfileAvatar from '../ProfileAvatar';
import { getDefaultConfigForGender, getPresetAvatar } from '../../utils/avatarDefaults';

const FEATURES = [
  { icon: '🧠', key: 'aiCoach' },
  { icon: '🌱', key: 'habitGrowth' },
  { icon: '📖', key: 'smartJournal' },
  { icon: '🦋', key: 'digitalTwin' },
];

const demoUser = {
  gender: 'female',
  avatar: getPresetAvatar('female'),
  avatarConfig: getDefaultConfigForGender('female'),
};

export default function AuthBrandPanel() {
  const { t } = useTranslation();

  return (
    <div className="auth-brand-panel">
      <div className="auth-brand-glow" aria-hidden="true" />

      <BrandLogo variant="desktop" />

      <p className="auth-brand-tagline">{t('auth.brandTagline')}</p>

      <div className="auth-brand-avatar-stage">
        <motion.div
          className="auth-brand-avatar-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
        <div className="auth-brand-avatar-glow">
          <ProfileAvatar user={demoUser} size="xl" floating={false} />
        </div>
        <motion.span
          className="auth-brand-butterfly auth-brand-butterfly-1"
          animate={{ x: [0, 12, -8, 0], y: [0, -10, 6, 0], rotate: [0, 8, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          🦋
        </motion.span>
        <motion.span
          className="auth-brand-butterfly auth-brand-butterfly-2"
          animate={{ x: [0, -10, 14, 0], y: [0, 8, -12, 0], rotate: [0, -5, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          aria-hidden="true"
        >
          🦋
        </motion.span>
      </div>

      <div className="auth-brand-companion">
        <AIOrb size="sm" />
        <span>{t('auth.miniCompanion')}</span>
      </div>

      <div className="auth-brand-pills">
        {FEATURES.map(({ icon, key }, i) => (
          <motion.span
            key={key}
            className="auth-brand-pill"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            {icon} {t(`auth.features.${key}`)}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
