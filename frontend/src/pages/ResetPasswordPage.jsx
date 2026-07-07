import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../api/auth';
import { ROUTES } from '../constants/routes';
import AuthShell from '../components/auth/AuthShell';
import AuthFormCard from '../components/auth/AuthFormCard';
import AuthInput from '../components/auth/AuthInput';
import AuthGradientButton from '../components/auth/AuthGradientButton';
import { Spinner } from '../components/Loader';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (password.length < 8) {
      setError(t('errors.passwordMin'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'));
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
      await authAPI.resetPassword(token, { password, confirmPassword });
      setPassword('');
      setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2500);
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
          <h1>{t('auth.resetPasswordTitle')}</h1>
          <p className="auth-form-subtitle">{t('auth.resetPasswordSubtitle')}</p>
        </div>

        {success ? (
          <div className="auth-success-panel">
            <p className="auth-success-message">{t('auth.passwordResetSuccess')}</p>
            <p className="auth-form-subtitle">{t('auth.redirectingToLogin')}</p>
            <Link to={ROUTES.LOGIN} className="auth-switch-link auth-back-login">
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : !token ? (
          <div className="auth-success-panel">
            <p className="auth-error">{t('auth.invalidResetLink')}</p>
            <Link to={ROUTES.FORGOT_PASSWORD} className="auth-switch-link auth-back-login">
              {t('auth.sendResetLink')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <AuthInput
              label={t('auth.newPassword')}
              type="password"
              name="password"
              icon="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              allowToggle
            />
            <AuthInput
              label={t('auth.confirmPassword')}
              type="password"
              name="confirmPassword"
              icon="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              allowToggle
            />

            {error && <p className="auth-error">{error}</p>}

            <AuthGradientButton type="submit" disabled={loading || !token} className="auth-submit">
              {loading ? (
                <span className="auth-loading-inline">
                  <Spinner size="sm" />
                  {t('auth.resettingPassword')}
                </span>
              ) : (
                t('auth.resetPassword')
              )}
            </AuthGradientButton>
          </form>
        )}

        {!success && token && (
          <p className="auth-switch">
            <Link to={ROUTES.LOGIN} className="auth-switch-link">
              {t('auth.backToLogin')}
            </Link>
          </p>
        )}
      </AuthFormCard>
    </AuthShell>
  );
}
