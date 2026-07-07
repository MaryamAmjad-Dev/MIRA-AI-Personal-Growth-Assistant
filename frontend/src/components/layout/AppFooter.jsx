import { APP_NAME, BRAND_BYLINE } from '../../constants/branding';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} {APP_NAME} {BRAND_BYLINE}</p>
    </footer>
  );
}

