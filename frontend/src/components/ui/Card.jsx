import { motion } from 'framer-motion';

export default function Card({ children, className = '', interactive = true, ...props }) {
  const classes = ['glass-card', 'card-3d', className].filter(Boolean).join(' ');

  if (!interactive) {
    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={classes}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
