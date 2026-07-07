import { motion } from 'framer-motion';
import { seededRandom } from '../../../hooks/useFantasyBackground';

function ButterflyWings({ size, color }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      className="butterfly-particle-svg"
    >
      <motion.g
        animate={{ scaleX: [1, 0.82, 1] }}
        transition={{ duration: 0.45 + seededRandom(size) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '16px 16px' }}
      >
        <path
          d="M16 8 C12 10 8 12 6 16 C9 15 12 14 14 12 C13 16 14 20 16 24 C14 20 13 16 14 12 C12 14 9 15 6 16 C8 12 12 10 16 8Z"
          fill={color}
          opacity="0.75"
        />
        <path
          d="M16 8 C20 10 24 12 26 16 C23 15 20 14 18 12 C19 16 18 20 16 24 C18 20 19 16 18 12 C20 14 23 15 26 16 C24 12 20 10 16 8Z"
          fill={color}
          opacity="0.55"
        />
        <ellipse cx="16" cy="14" rx="1.2" ry="5" fill={color} opacity="0.9" />
      </motion.g>
    </svg>
  );
}

const COLORS = ['#A78BFA', '#FB7185', '#C4B5FD', '#F472B6', '#8B5CF6'];

export default function ButterflyParticle({ index, animate = true }) {
  const seed = index + 1;
  const left = `${seededRandom(seed) * 92 + 4}%`;
  const top = `${seededRandom(seed + 50) * 88 + 4}%`;
  const size = 14 + Math.round(seededRandom(seed + 100) * 14);
  const color = COLORS[index % COLORS.length];
  const duration = 16 + seededRandom(seed + 200) * 12;
  const opacity = 0.35 + seededRandom(seed + 300) * 0.45;
  const delay = seededRandom(seed + 400) * 4;

  if (!animate) {
    return (
      <div className="butterfly-particle" style={{ left, top, opacity: opacity * 0.6 }}>
        <ButterflyWings size={size} color={color} />
      </div>
    );
  }

  return (
    <motion.div
      className="butterfly-particle"
      style={{ left, top, opacity }}
      animate={{
        x: [0, 30 + seededRandom(seed + 500) * 40, -20, 0],
        y: [0, -25 - seededRandom(seed + 600) * 30, 15, 0],
        rotate: [0, 6, -6, 0],
      }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <ButterflyWings size={size} color={color} />
    </motion.div>
  );
}
