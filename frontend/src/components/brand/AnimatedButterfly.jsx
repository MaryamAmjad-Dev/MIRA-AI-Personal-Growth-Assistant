import { motion } from 'framer-motion';

export default function AnimatedButterfly({ className = '' }) {
  return (
    <motion.span
      className={`animated-butterfly ${className}`}
      aria-hidden="true"
      animate={{ y: [0, -3, 0], rotate: [0, 4, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.span
        className="butterfly-emoji"
        animate={{
          filter: [
            'drop-shadow(0 0 2px rgba(251,113,133,0.3))',
            'drop-shadow(0 0 8px rgba(167,139,250,0.6))',
            'drop-shadow(0 0 2px rgba(251,113,133,0.3))',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        🦋
      </motion.span>
    </motion.span>
  );
}
