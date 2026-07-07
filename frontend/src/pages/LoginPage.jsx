import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../constants/routes';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import AuthShell from '../components/auth/AuthShell';
import AuthFormCard from '../components/auth/AuthFormCard';
import AuthInput from '../components/auth/AuthInput';
import AuthGradientButton from '../components/auth/AuthGradientButton';
import { Spinner } from '../components/Loader';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('errors.validEmail'));
      return false;
    }
    if (!password) {
      setError(t('errors.passwordRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      addToast(t('toast.welcomeBack'));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthFormCard>
        <div className="auth-form-header">
          <h1>{t('auth.welcomeBackExplorer')}</h1>
          <p className="auth-form-subtitle">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AuthInput
            label={t('auth.email')}
            type="email"
            name="email"
            icon="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
          <AuthInput
            label={t('auth.password')}
            type="password"
            name="password"
            icon="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <p className="auth-forgot">
            <Link to={ROUTES.FORGOT_PASSWORD} className="auth-forgot-link">
              {t('auth.forgotPassword')}
            </Link>
          </p>

          {error && <p className="auth-error">{error}</p>}

          <AuthGradientButton type="submit" disabled={loading} className="auth-submit">
            {loading ? (
              <span className="auth-loading-inline">
                <Spinner size="sm" />
                {t('auth.signingIn')}
              </span>
            ) : (
              t('auth.signIn')
            )}
          </AuthGradientButton>
        </form>

        <GoogleAuthButton />

        <p className="auth-switch">
          {t('auth.noAccount')}{' '}
          <Link to={ROUTES.REGISTER} className="auth-switch-link">
            {t('auth.register')}
          </Link>
        </p>
      </AuthFormCard>
    </AuthShell>
  );
}
