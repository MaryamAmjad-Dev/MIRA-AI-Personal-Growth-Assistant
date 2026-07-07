import { motion } from 'framer-motion';

export default function AuthGradientButton({
  children,
  type = 'button',
  className = '',
  disabled,
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={`auth-gradient-btn ${className}`}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -3, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      {...props}
    >
      <span className="auth-gradient-btn-bg" aria-hidden="true" />
      <span className="auth-gradient-btn-sparkle" aria-hidden="true">✨</span>
      <span className="auth-gradient-btn-text">{children}</span>
    </motion.button>
  );
}
