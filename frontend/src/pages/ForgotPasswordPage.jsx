import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../api/auth';
import { ROUTES } from '../constants/routes';
import AuthShell from '../components/auth/AuthShell';
import AuthFormCard from '../components/auth/AuthFormCard';
import AuthInput from '../components/auth/AuthInput';
import AuthGradientButton from '../components/auth/AuthGradientButton';
import { Spinner } from '../components/Loader';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('errors.validEmail'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setResetUrl('');
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await authAPI.forgotPassword(email.trim());
      setSuccess(true);
      if (data.resetUrl) setResetUrl(data.resetUrl);
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
          <h1>{t('auth.forgotPasswordTitle')}</h1>
          <p className="auth-form-subtitle">{t('auth.forgotPasswordSubtitle')}</p>
        </div>

        {success ? (
          <div className="auth-success-panel">
            <p className="auth-success-message">{t('auth.resetLinkSent')}</p>
            <p className="auth-form-subtitle">{t('auth.resetLinkSentDesc')}</p>
            {resetUrl && (
              <div className="auth-dev-reset-link">
                <p className="auth-dev-reset-label">{t('auth.devResetLink')}</p>
                <a href={resetUrl} className="auth-dev-reset-url">
                  {resetUrl}
                </a>
              </div>
            )}
            <Link to={ROUTES.LOGIN} className="auth-switch-link auth-back-login">
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
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

            {error && <p className="auth-error">{error}</p>}

            <AuthGradientButton type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <span className="auth-loading-inline">
                  <Spinner size="sm" />
                  {t('auth.sendingResetLink')}
                </span>
              ) : (
                t('auth.sendResetLink')
              )}
            </AuthGradientButton>
          </form>
        )}

        {!success && (
          <p className="auth-switch">
            {t('auth.hasAccount')}{' '}
            <Link to={ROUTES.LOGIN} className="auth-switch-link">
              {t('auth.signIn')}
            </Link>
          </p>
        )}
      </AuthFormCard>
    </AuthShell>
  );
}
