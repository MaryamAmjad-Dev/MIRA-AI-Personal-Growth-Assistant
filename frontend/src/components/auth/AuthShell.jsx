import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedBackground from '../brand/AnimatedBackground';
import AuthTopBar from '../layout/AuthTopBar';
import AppFooter from '../layout/AppFooter';
import AuthBrandPanel from './AuthBrandPanel';

/**
 * Premium auth layout — MIRA AI by Maryam 🦋
 * Desktop: brand panel 40% + form 60% | Mobile: centered card
 */
export default function AuthShell({ children, showBrandPanel = true }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('meta.title');
  }, [t]);

  return (
    <div className="auth-shell">
      <div className="app-bg" aria-hidden="true" />
      <AnimatedBackground intensity="soft" />

      <div className="auth-shell-inner">
        {showBrandPanel && (
          <aside className="auth-shell-brand" aria-hidden="false">
            <AuthBrandPanel />
          </aside>
        )}

        <main className="auth-shell-main">
          <div className="auth-shell-form-wrap">
            {children}
            <AppFooter />
          </div>
        </main>
      </div>

      <AuthTopBar />
    </div>
  );
}
