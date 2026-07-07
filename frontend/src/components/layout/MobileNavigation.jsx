import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../../constants/routes';

const MOBILE_ITEMS = NAV_ITEMS.filter((i) =>
  ['dashboard', 'journal', 'habits', 'planner', 'coach'].some((k) => i.path.includes(k)),
);

export default function MobileNavigation() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="mobile-nav-dock" aria-label="Mobile navigation">
      <div className="mobile-nav-dock-inner glass-card">
        {MOBILE_ITEMS.map(({ path, labelKey, icon }) => {
          const active = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`mobile-dock-link ${active ? 'active' : ''}`}
              aria-label={t(labelKey)}
            >
              {active && (
                <motion.span
                  className="mobile-dock-indicator"
                  layoutId="dock-indicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="mobile-dock-icon" aria-hidden="true">{icon}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
