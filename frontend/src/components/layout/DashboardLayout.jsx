import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import UserMenu from './UserMenu';
import ThemeSwitcher from '../ThemeSwitcher';
import MobileMenu from './MobileMenu';
import NotificationCenter from '../NotificationCenter';
import CommandMenu, { useKeyboardShortcuts } from '../CommandMenu';
import OnboardingTour from '../OnboardingTour';
import AppFooter from './AppFooter';
import { ROUTES } from '../../constants/routes';
import BrandLogo from '../brand/BrandLogo';
import FantasyBackground from '../brand/FantasyBackground';
import PageTransition from './PageTransition';
import LanguageSwitcher from '../LanguageSwitcher';
import { useBrandVariant } from '../../hooks/useBrandVariant';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const brandVariant = useBrandVariant();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useKeyboardShortcuts(navigate);

  useEffect(() => {
    document.title = t('meta.title');
  }, [t]);

  return (
    <div className="dashboard">
      <FantasyBackground intensity="full" />
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-topbar glass-card">
          <MobileMenu
            open={isMenuOpen}
            onOpen={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
          />
          <div className="topbar-brand">
            <BrandLogo variant={brandVariant} to={ROUTES.DASHBOARD} />
          </div>
          <LanguageSwitcher compact />
          <ThemeSwitcher compact />
          <NotificationCenter />
          <UserMenu />
        </header>
        <main className="dashboard-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
          <AppFooter />
        </main>
      </div>
      <MobileNavigation />
      <CommandMenu />
      <OnboardingTour />
    </div>
  );
}
