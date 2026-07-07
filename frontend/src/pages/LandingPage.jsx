import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../constants/routes';
import BrandLogo from '../components/brand/BrandLogo';
import AnimatedBackground from '../components/brand/AnimatedBackground';
import ButterflyAura from '../components/brand/ButterflyAura';
import AuthTopBar from '../components/layout/AuthTopBar';
import AppFooter from '../components/layout/AppFooter';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="landing-page auth-page">
      <div className="app-bg" aria-hidden="true" />
      <AnimatedBackground intensity="soft" />
      <ButterflyAura intensity="medium" />
      <AuthTopBar />

      <div className="landing-hero animate-scale-in">
        <BrandLogo variant="desktop" />
        <h1 className="landing-title">{t('landing.title')}</h1>
        <p className="landing-tagline">{t('brand.tagline')}</p>
        <p className="landing-sub">{t('landing.subtitle')}</p>

        <div className="landing-actions">
          <Link to={ROUTES.REGISTER}>
            <Button className="landing-cta">{t('landing.getStarted')}</Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost">{t('auth.signIn')}</Button>
          </Link>
        </div>
      </div>

      <AppFooter />
      <AuthTopBar />
    </div>
  );
}
