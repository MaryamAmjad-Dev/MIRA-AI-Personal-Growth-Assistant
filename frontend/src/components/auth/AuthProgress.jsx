import { useTranslation } from 'react-i18next';

export default function AuthProgress({ step = 1, total = 3 }) {
  const { t } = useTranslation();

  const labels = [t('auth.stepWelcome'), t('auth.stepAccount'), t('auth.stepPersonalize')];

  return (
    <div className="auth-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
      <div className="auth-progress-track">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={n} className={`auth-progress-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
              <span className="auth-progress-dot">{done ? '✓' : n}</span>
              <span className="auth-progress-label">{labels[i]}</span>
            </div>
          );
        })}
      </div>
      <div className="auth-progress-bar">
        <div className="auth-progress-fill" style={{ width: `${((step - 1) / (total - 1)) * 100}%` }} />
      </div>
    </div>
  );
}
