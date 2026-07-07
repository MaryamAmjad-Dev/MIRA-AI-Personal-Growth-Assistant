import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS, INTELLIGENCE_NAV_ITEMS } from '../../constants/routes';

export default function MobileMenu({ open = false, onOpen, onClose }) {
  const { t } = useTranslation();
  const location = useLocation();

  const isMenuOpen = open;
  const setIsMenuOpen = (next) => {
    if (next) onOpen?.();
    else onClose?.();
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, onClose]);

  const menuPortal = (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="menu-overlay mobile-menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose?.()}
          role="presentation"
        >
          <motion.aside
            className="drawer mobile-menu-drawer glass-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <strong>{t('nav.menu')}</strong>
              <button
                type="button"
                className="drawer-close-btn mobile-menu-close"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose?.();
                }}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>

            <nav className="mobile-menu-nav menu-items">
              <p className="mobile-menu-section">{t('nav.dashboard')}</p>
              {NAV_ITEMS.map(({ path, labelKey, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => `mobile-menu-link ${isActive || location.pathname === path ? 'active' : ''}`}
                  onClick={() => onClose?.()}
                >
                  <span aria-hidden="true">{icon}</span>
                  {t(labelKey)}
                </NavLink>
              ))}

              <p className="mobile-menu-section">{t('nav.intelligence')}</p>
              {INTELLIGENCE_NAV_ITEMS.map(({ path, labelKey, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => `mobile-menu-link ${isActive || location.pathname === path ? 'active' : ''}`}
                  onClick={() => onClose?.()}
                >
                  <span aria-hidden="true">{icon}</span>
                  {t(labelKey)}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        className="mobile-menu-trigger glass-card"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(true);
        }}
        aria-label={t('nav.menu')}
        aria-expanded={isMenuOpen}
      >
        <span className="mobile-menu-icon" aria-hidden="true">☰</span>
      </button>

      {typeof document !== 'undefined' && createPortal(menuPortal, document.body)}
    </>
  );
}
