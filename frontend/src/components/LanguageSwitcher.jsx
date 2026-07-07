import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/user';

const DROPDOWN_WIDTH = 260;
const DROPDOWN_GAP = 12;

function getDropdownPosition(buttonEl) {
  if (!buttonEl || typeof window === 'undefined') {
    return { top: 0, left: 0, width: DROPDOWN_WIDTH, useRight: false };
  }

  const rect = buttonEl.getBoundingClientRect();
  const top = rect.bottom + DROPDOWN_GAP;
  const isMobile = window.innerWidth < 500;

  if (isMobile) {
    return {
      top,
      left: null,
      right: 16,
      width: Math.min(window.innerWidth * 0.9, DROPDOWN_WIDTH),
      useRight: true,
    };
  }

  const width = DROPDOWN_WIDTH;
  let left = rect.right - width;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

  return { top, left, right: null, width, useRight: false };
}

export default function LanguageSwitcher({ compact = false, onChanged }) {
  const { t, language, setLanguage } = useLanguage();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: DROPDOWN_WIDTH });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const pos = getDropdownPosition(buttonRef.current);
    setMenuStyle(pos);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      const inButton = buttonRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inButton && !inMenu) setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const changeLanguage = async (code) => {
    await setLanguage(code);
    setOpen(false);
    onChanged?.(code);

    if (isAuthenticated) {
      try {
        const updated = await updateProfile({ language: code });
        updateUser(updated);
      } catch {
        /* localStorage still persists language */
      }
    }
  };

  const menuPortal = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className="language-menu language-switcher-menu"
          style={{
            position: 'fixed',
            top: menuStyle.top,
            left: menuStyle.useRight ? 'auto' : menuStyle.left,
            right: menuStyle.useRight ? menuStyle.right : 'auto',
            width: menuStyle.width,
          }}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          role="listbox"
          aria-label={t('common.selectLanguage')}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-option ${lang.code === current.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
              role="option"
              aria-selected={lang.code === current.code}
            >
              <span className="language-flag">{lang.short}</span>
              <span className="language-option-text">
                <strong>{lang.nativeName}</strong>
                <small>{lang.name}</small>
              </span>
              {lang.code === current.code && <span className="language-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`language-switcher ${compact ? 'compact' : ''}`}>
      <button
        ref={buttonRef}
        type="button"
        className="language-switcher-trigger glass-card"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => {
            if (!prev) updateMenuPosition();
            return !prev;
          });
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('common.selectLanguage')}
      >
        <span className="language-flag">{current.short}</span>
        <span className="language-chevron" aria-hidden="true">▾</span>
      </button>

      {typeof document !== 'undefined' && createPortal(menuPortal, document.body)}
    </div>
  );
}
