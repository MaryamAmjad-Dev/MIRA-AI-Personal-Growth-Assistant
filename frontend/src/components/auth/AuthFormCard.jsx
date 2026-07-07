import { motion } from 'framer-motion';

export default function AuthFormCard({ children, className = '' }) {
  return (
    <motion.div
      className={`auth-form-card ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="auth-form-card-shine" aria-hidden="true" />
      {children}
    </motion.div>
  );
}
