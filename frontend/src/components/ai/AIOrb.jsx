import { motion } from 'framer-motion';

export default function AIOrb({ size = 'md', pulsing = true }) {
  return (
    <div className={`ai-orb size-${size}`} aria-hidden="true">
      <motion.div
        className="ai-orb-core"
        animate={pulsing ? { scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ai-orb-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="ai-orb-glow"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <span className="ai-orb-letter">M</span>
    </div>
  );
}
