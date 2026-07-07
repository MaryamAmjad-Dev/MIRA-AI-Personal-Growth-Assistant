import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES, NAV_ITEMS, INTELLIGENCE_NAV_ITEMS } from '../constants/routes';

const AI_COMMANDS = [
  { id: 'create-habit', labelKey: 'nav.habits', icon: '✅', path: ROUTES.HABITS },
  { id: 'analyze-week', labelKey: 'nav.analytics', icon: '📊', path: ROUTES.ANALYTICS },
  { id: 'ask-twin', labelKey: 'nav.digitalTwin', icon: '🧬', path: ROUTES.TWIN },
  { id: 'write-journal', labelKey: 'nav.journal', icon: '📔', path: ROUTES.JOURNAL },
  { id: 'decision', labelKey: 'nav.decisionRoom', icon: '⚖️', path: ROUTES.DECISION },
  { id: 'checkin', labelKey: 'nav.dailyCheckin', icon: '🌅', path: ROUTES.DAILY_CHECKIN },
  { id: 'coach', labelKey: 'nav.coach', icon: '🤖', path: ROUTES.COACH },
  { id: 'reports', labelKey: 'nav.reports', icon: '📑', path: ROUTES.REPORTS },
];

export default function CommandMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const allItems = useMemo(
    () => [
      ...AI_COMMANDS.map((c) => ({ ...c, type: 'command', label: t(c.labelKey) })),
      ...NAV_ITEMS.map((i) => ({ ...i, type: 'nav', label: t(i.labelKey) })),
      ...INTELLIGENCE_NAV_ITEMS.map((i) => ({ ...i, type: 'nav', label: t(i.labelKey) })),
    ],
    [t],
  );

  const filtered = allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  const commands = filtered.filter((i) => i.type === 'command');
  const pages = filtered.filter((i) => i.type === 'nav');

  const go = (path) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="command-menu glass-card card-3d" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              placeholder={`${t('common.search')} (Ctrl+K)`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="command-input"
            />
            {commands.length > 0 && (
              <div className="command-section">
                <div className="command-section-label">{t('commandMenu.aiSection')}</div>
                <div className="command-list">
                  {commands.map((item) => (
                    <button key={item.id} type="button" className="command-item" onClick={() => go(item.path)}>
                      <span>{item.icon}</span>
                      <span className="command-item-text">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {pages.length > 0 && (
              <div className="command-section">
                <div className="command-section-label">{t('commandMenu.pagesSection')}</div>
                <div className="command-list">
                  {pages.map((item) => (
                    <button key={item.path} type="button" className="command-item" onClick={() => go(item.path)}>
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {filtered.length === 0 && <p className="command-empty">{t('common.noResults')}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useKeyboardShortcuts(navigate) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'j' && !e.metaKey) navigate(ROUTES.JOURNAL);
      if (e.key === 'h' && !e.metaKey) navigate(ROUTES.HABITS);
      if (e.key === 'p' && !e.metaKey) navigate(ROUTES.PLANNER);
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) navigate(ROUTES.TWIN);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
}
