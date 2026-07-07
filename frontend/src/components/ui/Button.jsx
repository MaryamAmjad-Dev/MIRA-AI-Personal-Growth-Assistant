import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} btn-${size} btn-premium ${className}`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...props}
    >
      <span className="btn-shine" aria-hidden="true" />
      {children}
    </motion.button>
  );
}
