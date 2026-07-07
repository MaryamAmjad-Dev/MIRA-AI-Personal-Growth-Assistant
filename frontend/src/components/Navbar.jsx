import { useTranslation } from 'react-i18next';
import ThemeSwitcher from './ThemeSwitcher';
import BrandLogo from './brand/BrandLogo';
import { useBrandVariant } from '../hooks/useBrandVariant';

export default function Navbar() {
  const { t } = useTranslation();
  const brandVariant = useBrandVariant();

  return (
    <nav className="navbar glass-card">
      <div className="navbar-brand">
        <BrandLogo variant={brandVariant} />
        <p className="navbar-tagline">{t('brand.tagline')}</p>
      </div>
      <ThemeSwitcher compact />
    </nav>
  );
}
