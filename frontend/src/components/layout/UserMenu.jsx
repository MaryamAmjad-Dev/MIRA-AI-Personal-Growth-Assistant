import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import ProfileAvatar from '../ProfileAvatar';
import AvatarEditorModal from '../avatar/AvatarEditorModal';

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, logout, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <div className="user-menu" ref={ref}>
        <button
          type="button"
          className="user-menu-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={t('profile.menu')}
        >
          <ProfileAvatar user={user} size="sm" level={user?.level} floating={false} />
          <span className="user-name">{user?.name}</span>
          <span className="user-chevron" aria-hidden="true">▾</span>
        </button>

        {open && (
          <div className="user-menu-dropdown app-dropdown-panel animate-scale-in">
            <Link to={ROUTES.PROFILE} className="user-menu-item" onClick={() => setOpen(false)}>
              {t('nav.profile')}
            </Link>
            <Link to={ROUTES.SETTINGS} className="user-menu-item" onClick={() => setOpen(false)}>
              {t('nav.settings')}
            </Link>
            <button type="button" className="user-menu-item" onClick={() => { setOpen(false); setShowAvatarEditor(true); }}>
              {t('avatar.editTitle')}
            </button>
            <button type="button" className="user-menu-item user-menu-logout" onClick={handleLogout}>
              {t('auth.logout')}
            </button>
          </div>
        )}
      </div>

      {showAvatarEditor && (
        <AvatarEditorModal
          user={user}
          onClose={() => setShowAvatarEditor(false)}
          onSaved={(updated) => { updateUser(updated); setShowAvatarEditor(false); }}
        />
      )}
    </>
  );
}
