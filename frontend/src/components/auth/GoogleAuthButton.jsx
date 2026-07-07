import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuthButton({ signup = false }) {
  const { t } = useTranslation();
  const { loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!GOOGLE_CLIENT_ID) return null;

  const handleSuccess = async (response) => {
    try {
      await loginWithGoogle(response.credential);
      addToast(t('googleAuth.signInSuccess'));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      addToast(err.message || t('googleAuth.error'), 'error');
    }
  };

  return (
    <div className="google-auth">
      <div className="auth-divider">
        <span>or</span>
      </div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => addToast(t('googleAuth.error'), 'error')}
        theme="outline"
        size="large"
        width="100%"
        text={signup ? 'signup_with' : 'continue_with'}
        shape="rectangular"
      />
    </div>
  );
}
