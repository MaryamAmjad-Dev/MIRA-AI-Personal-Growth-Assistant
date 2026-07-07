import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';

export default function AuthTopBar() {
  return (
    <div className="auth-topbar">
      <LanguageSwitcher compact />
      <ThemeSwitcher compact />
    </div>
  );
}
