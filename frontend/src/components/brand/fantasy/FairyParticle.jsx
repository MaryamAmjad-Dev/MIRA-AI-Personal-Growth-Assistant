import { motion } from 'framer-motion';
import { seededRandom } from '../../../hooks/useFantasyBackground';

function FairySvg({ size, index }) {
  const gradId = `fairyGlow-${index}-${size}`;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="fairy-particle-svg">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0ABFC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="14" fill={`url(#${gradId})`} opacity="0.5" />
      <motion.g
        animate={{ scale: [1, 0.92, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 18px' }}
      >
        <ellipse cx="12" cy="18" rx="8" ry="5" fill="#E9D5FF" opacity="0.85" />
        <ellipse cx="28" cy="18" rx="8" ry="5" fill="#FBCFE8" opacity="0.85" />
      </motion.g>
      <ellipse cx="20" cy="22" rx="3" ry="5" fill="#C4B5FD" />
      <circle cx="20" cy="14" r="4" fill="#FDDCBF" />
      <circle cx="18" cy="12" r="1" fill="#FB7185" opacity="0.8" />
      <circle cx="22" cy="11" r="0.8" fill="#A78BFA" opacity="0.8" />
    </svg>
  );
}

export default function FairyParticle({ index, animate = true }) {
  const seed = index + 7;
  const left = `${seededRandom(seed) * 90 + 5}%`;
  const top = `${seededRandom(seed + 30) * 85 + 5}%`;
  const size = 22 + Math.round(seededRandom(seed + 60) * 10);
  const duration = 8 + seededRandom(seed + 90) * 6;
  const delay = seededRandom(seed + 120) * 3;
  const opacity = 0.4 + seededRandom(seed + 150) * 0.35;

  if (!animate) {
    return (
      <div className="fairy-particle" style={{ left, top, opacity: opacity * 0.7 }}>
        <FairySvg size={size} index={index} />
      </div>
    );
  }

  return (
    <motion.div
      className="fairy-particle"
      style={{ left, top, opacity }}
      animate={{
        y: [0, -18, 0, 12, 0],
        x: [0, 8, -6, 4, 0],
      }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <FairySvg size={size} />
      <span className="fairy-sparkle-trail" aria-hidden="true" />
    </motion.div>
  );
}
