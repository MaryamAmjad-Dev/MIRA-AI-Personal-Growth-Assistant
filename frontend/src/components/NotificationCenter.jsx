import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/achievements';

export default function NotificationCenter() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);

  const load = () => fetchNotifications().then(setNotifications).catch(() => {});

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleRead = async (id) => {
    await markNotificationRead(id);
    load();
  };

  return (
    <div className="notification-center" ref={ref}>
      <button
        type="button"
        className="notif-trigger"
        onClick={() => setOpen(!open)}
        aria-label={t('notifications.ariaLabel')}
        aria-expanded={open}
      >
        🔔
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-panel app-dropdown-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div className="notif-header">
              <h4>{t('notifications.title')}</h4>
              {notifications.length > 0 && (
                <button type="button" className="link-btn app-dropdown-link" onClick={() => markAllNotificationsRead().then(load)}>
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="notif-empty">{t('notifications.empty')}</p>
            ) : (
              <div className="notif-list">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-item ${n.read ? '' : 'unread'}`}
                    onClick={() => handleRead(n._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleRead(n._id)}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
