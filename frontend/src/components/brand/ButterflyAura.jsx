import { motion } from 'framer-motion';

/**
 * Subtle transformation aura — use on auth & hero moments only.
 */
export default function ButterflyAura({ intensity = 'medium', className = '' }) {
  const particles = Array.from({ length: intensity === 'soft' ? 4 : 8 });

  return (
    <div className={`butterfly-aura ${className}`} aria-hidden="true">
      <motion.div
        className="butterfly-glow"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="butterfly-particle"
          style={{ left: `${12 + (i * 11) % 76}%`, top: `${8 + (i * 17) % 72}%` }}
          animate={{
            y: [0, -18 - (i % 3) * 6, 0],
            x: [0, (i % 2 ? 8 : -8), 0],
            opacity: [0.15, 0.45, 0.15],
            scale: [0.6, 1, 0.6],
          }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
