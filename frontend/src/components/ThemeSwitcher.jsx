import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher({ compact = false, className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      className={`theme-switcher glass-card ${compact ? 'compact' : ''} ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="theme-switcher-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      {!compact && (
        <span className="theme-switcher-label">
          {isDark ? t('theme.light') : t('theme.dark')}
        </span>
      )}
    </motion.button>
  );
}
