import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
/**
 * MIRA AI brand logo — primary title + by Maryam 🦋 subtitle.
 * @param {'desktop'|'tablet'|'mobile'|'auto'} variant
 * @param {string} [to] — when set, logo navigates (e.g. /dashboard)
 */
export default function BrandLogo({ variant = 'desktop', className = '', to = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    if (!to) return;
    e.stopPropagation();
    navigate(to);
  };

  const wrap = (content) => {
    if (to) {
      return (
        <Link
          to={to}
          className={`brand-logo-link ${className}`}
          aria-label="MIRA AI by Maryam — Home"
          onClick={handleBrandClick}
        >
          {content}
        </Link>
      );
    }
    return content;
  };

  if (variant === 'mobile') {
    return wrap(
      <motion.div
        className={`brand-logo brand-logo-mobile-only ${to ? '' : className}`}
        aria-hidden={to ? undefined : true}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="brand-mira brand-mira-glow">{t('brand.mira')}</span>
      </motion.div>
    );
  }

  if (variant === 'tablet') {
    return wrap(
      <motion.div
        className={`brand-logo brand-logo-tablet ${to ? '' : className}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="brand-mira brand-mira-glow">{t('brand.mira')}</span>
        <span className="brand-byline brand-byline-tablet">
          {t('brand.byMaryam')}
        </span>
      </motion.div>
    );
  }

  return wrap(
    <motion.div
      className={`brand-logo brand-logo-desktop ${to ? '' : className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.span
        className="brand-mira brand-mira-glow"
        animate={{
          filter: [
            'drop-shadow(0 0 8px rgba(167,139,250,0.35))',
            'drop-shadow(0 0 16px rgba(251,113,133,0.5))',
            'drop-shadow(0 0 8px rgba(167,139,250,0.35))',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {t('brand.mira')}
      </motion.span>
      <span className="brand-byline">
        {t('brand.byMaryam')}
      </span>
    </motion.div>
  );
}
