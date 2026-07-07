import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS, INTELLIGENCE_NAV_ITEMS, ROUTES } from '../../constants/routes';
import BrandLogo from '../brand/BrandLogo';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-brand">
        <BrandLogo variant="desktop" to={ROUTES.DASHBOARD} />
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, labelKey, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon" aria-hidden="true">{icon}</span>
            {t(labelKey)}
          </NavLink>
        ))}
        <div className="sidebar-section-label">{t('nav.intelligence')}</div>
        {INTELLIGENCE_NAV_ITEMS.map(({ path, labelKey, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon" aria-hidden="true">{icon}</span>
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
