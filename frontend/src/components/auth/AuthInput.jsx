import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ICONS = {
  email: '✉️',
  password: '🔒',
  user: '👤',
  text: '✨',
};

export default function AuthInput({
  label,
  type = 'text',
  icon,
  error,
  className = '',
  value,
  allowToggle = false,
  ...props
}) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const filled = value !== undefined && value !== '';
  const iconKey = icon || (type === 'email' ? 'email' : type === 'password' ? 'password' : 'text');
  const id = props.id || props.name || label?.toLowerCase().replace(/\s/g, '-');
  const isPassword = type === 'password';
  const inputType = isPassword && allowToggle && visible ? 'text' : type;

  return (
    <div className={`auth-input-group ${focused ? 'focused' : ''} ${filled ? 'filled' : ''} ${error ? 'has-error' : ''} ${allowToggle && isPassword ? 'has-toggle' : ''} ${className}`}>
      <span className="auth-input-icon" aria-hidden="true">{ICONS[iconKey] || ICONS.text}</span>
      <input
        id={id}
        type={inputType}
        className="auth-input-field"
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        {...props}
      />
      {allowToggle && isPassword && (
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
          tabIndex={-1}
        >
          {visible ? '🙈' : '👁️'}
        </button>
      )}
      {label && (
        <label className="auth-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      {error && <span className="auth-input-error">{error}</span>}
    </div>
  );
}
