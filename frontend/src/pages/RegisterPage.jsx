import { useState, useMemo } from 'react';
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
import AuthProgress from '../components/auth/AuthProgress';
import AuthAvatarPicker from '../components/auth/AuthAvatarPicker';
import { Spinner } from '../components/Loader';
import { uploadAvatar } from '../api/user';
import { getDefaultConfigForGender, getPresetAvatar } from '../utils/avatarDefaults';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarPreference, setAvatarPreference] = useState('female');
  const [builderGender, setBuilderGender] = useState('female');
  const [avatarConfig, setAvatarConfig] = useState(getDefaultConfigForGender('female'));
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewUser = useMemo(() => {
    if (avatarPreference === 'upload' && uploadFile) {
      return { avatar: URL.createObjectURL(uploadFile), avatarConfig: null };
    }
    if (avatarPreference === 'male') {
      return { gender: 'male', avatar: getPresetAvatar('male'), avatarConfig: getDefaultConfigForGender('male') };
    }
    if (avatarPreference === 'female') {
      return { gender: 'female', avatar: getPresetAvatar('female'), avatarConfig: getDefaultConfigForGender('female') };
    }
    return { gender: builderGender, avatar: getPresetAvatar(builderGender), avatarConfig };
  }, [avatarPreference, avatarConfig, builderGender, uploadFile]);

  const handlePrefChange = (pref) => {
    setAvatarPreference(pref);
    if (pref === 'male') setAvatarConfig(getDefaultConfigForGender('male'));
    if (pref === 'female') setAvatarConfig(getDefaultConfigForGender('female'));
    if (pref === 'custom') setAvatarConfig(getDefaultConfigForGender(builderGender));
  };

  const handleUploadPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError(t('avatar.invalidType'));
      return;
    }
    setUploadFile(file);
    setError('');
  };

  const validateAccount = () => {
    if (!name.trim()) { setError(t('errors.nameRequired')); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError(t('errors.validEmail')); return false; }
    if (password.length < 8) { setError(t('errors.passwordMin')); return false; }
    if (password !== confirmPassword) { setError(t('errors.passwordMismatch')); return false; }
    return true;
  };

  const validatePersonalize = () => {
    if (!avatarPreference) { setError(t('avatar.preferenceRequired')); return false; }
    if (avatarPreference === 'upload' && !uploadFile) { setError(t('avatar.uploadRequired')); return false; }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 2 && !validateAccount()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePersonalize()) return;

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        avatarPreference,
      };
      if (avatarPreference === 'custom') {
        payload.avatarConfig = avatarConfig;
        payload.gender = builderGender;
      }
      await register(payload);

      if (avatarPreference === 'upload' && uploadFile) {
        const updated = await uploadAvatar(uploadFile);
        updateUser(updated);
      }

      addToast(t('toast.accountCreated'));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthFormCard className="auth-form-card--register">
        <AuthProgress step={step} total={3} />

        {step === 1 && (
          <div className="auth-step auth-step-welcome">
            <div className="auth-form-header">
              <span className="auth-form-emoji" aria-hidden="true">🦋</span>
              <h1>{t('auth.enterGrowthWorld')}</h1>
              <p className="auth-form-subtitle">{t('auth.welcomeStepDesc')}</p>
            </div>

            <ul className="auth-welcome-list">
              <li>{t('auth.welcomePoint1')}</li>
              <li>{t('auth.welcomePoint2')}</li>
              <li>{t('auth.welcomePoint3')}</li>
            </ul>

            {error && <p className="auth-error">{error}</p>}

            <AuthGradientButton type="button" onClick={handleNext} className="auth-submit">
              {t('auth.continueJourney')}
            </AuthGradientButton>

            <GoogleAuthButton signup />

            <p className="auth-switch">
              {t('auth.hasAccount')}{' '}
              <Link to={ROUTES.LOGIN} className="auth-switch-link">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="auth-step">
            <div className="auth-form-header">
              <h1>{t('auth.stepAccount')}</h1>
              <p className="auth-form-subtitle">{t('auth.accountStepDesc')}</p>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleNext(); }}
              className="auth-form"
            >
              <AuthInput
                label={t('auth.name')}
                name="name"
                icon="user"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                autoComplete="name"
              />
              <AuthInput
                label={t('auth.email')}
                type="email"
                name="email"
                icon="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
              <AuthInput
                label={t('auth.password')}
                type="password"
                name="password"
                icon="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
                autoComplete="new-password"
              />
              <AuthInput
                label={t('auth.confirmPassword')}
                type="password"
                name="confirmPassword"
                icon="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
                autoComplete="new-password"
              />

              {error && <p className="auth-error">{error}</p>}

              <div className="auth-step-actions">
                <button type="button" className="auth-secondary-btn" onClick={handleBack} disabled={loading}>
                  {t('common.back')}
                </button>
                <AuthGradientButton type="submit" disabled={loading}>
                  {t('auth.continueJourney')}
                </AuthGradientButton>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="auth-step">
            <div className="auth-form-header">
              <h1>{t('auth.stepPersonalize')}</h1>
              <p className="auth-form-subtitle">{t('auth.personalizeStepDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <AuthAvatarPicker
                avatarPreference={avatarPreference}
                onPreferenceChange={handlePrefChange}
                previewUser={previewUser}
                builderGender={builderGender}
                onBuilderGenderChange={setBuilderGender}
                avatarConfig={avatarConfig}
                onAvatarConfigChange={setAvatarConfig}
                onUploadPick={handleUploadPick}
                uploadFileName={uploadFile?.name}
                disabled={loading}
              />

              {error && <p className="auth-error">{error}</p>}

              <div className="auth-step-actions">
                <button type="button" className="auth-secondary-btn" onClick={handleBack} disabled={loading}>
                  {t('common.back')}
                </button>
                <AuthGradientButton type="submit" disabled={loading} className="auth-submit">
                  {loading ? (
                    <span className="auth-loading-inline">
                      <Spinner size="sm" />
                      {t('auth.creatingAccount')}
                    </span>
                  ) : (
                    t('auth.startJourney')
                  )}
                </AuthGradientButton>
              </div>
            </form>
          </div>
        )}
      </AuthFormCard>
    </AuthShell>
  );
}
