import { motion } from 'framer-motion';
import { seededRandom } from '../../hooks/useFantasyBackground';

const BUTTERFLY_COLORS = {
  pink: { left: '#FB7185', right: '#FDA4AF', body: '#BE185D' },
  purple: { left: '#A78BFA', right: '#C4B5FD', body: '#6D28D9' },
  blue: { left: '#38BDF8', right: '#7DD3FC', body: '#0369A1' },
};

function ButterflySvg({ color = 'pink', size = 32 }) {
  const c = BUTTERFLY_COLORS[color] || BUTTERFLY_COLORS.pink;

  return (
    <svg viewBox="0 0 40 32" width={size} height={size * 0.8} className={`garden-butterfly-svg garden-butterfly-${color}`} aria-hidden="true">
      <motion.g
        animate={{ scaleX: [1, 0.78, 1] }}
        transition={{ duration: 0.35 + seededRandom(size) * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 16px' }}
      >
        <path d="M20 6 C14 8 8 10 5 16 C10 14 14 13 16 10 C15 16 16 22 20 26 C18 20 17 14 18 10 C16 13 10 14 5 16 C8 10 14 8 20 6Z" fill={c.left} opacity="0.88" />
        <path d="M20 6 C26 8 32 10 35 16 C30 14 26 13 24 10 C25 16 24 22 20 26 C22 20 23 14 22 10 C24 13 30 14 35 16 C32 10 26 8 20 6Z" fill={c.right} opacity="0.72" />
        <ellipse cx="20" cy="14" rx="1.5" ry="8" fill={c.body} opacity="0.85" />
        <circle cx="20" cy="6" r="2" fill={c.body} />
      </motion.g>
    </svg>
  );
}

const FLIGHT_PATHS = [
  { x: [0, 80, -40, 60, 0], y: [0, -40, 20, -25, 0], rotate: [0, 8, -5, 6, 0] },
  { x: [0, -70, 50, -30, 0], y: [0, 30, -35, 15, 0], rotate: [0, -6, 8, -4, 0] },
  { x: [0, 50, 90, -20, 0], y: [0, -20, 25, -30, 0], rotate: [0, 5, -8, 4, 0] },
];

export default function ButterflyWorld({ count = 6, animate = true }) {
  const colors = ['pink', 'purple', 'blue'];

  return (
    <div className="butterfly-world" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const seed = i + 20;
        const color = colors[i % 3];
        const size = 28 + Math.round(seededRandom(seed) * 16);
        const left = `${seededRandom(seed + 5) * 88 + 4}%`;
        const top = `${seededRandom(seed + 10) * 82 + 6}%`;
        const duration = 22 + seededRandom(seed + 15) * 14;
        const delay = seededRandom(seed + 20) * 5;
        const path = FLIGHT_PATHS[i % FLIGHT_PATHS.length];
        const opacity = 0.65 + seededRandom(seed + 25) * 0.35;

        if (!animate) {
          return (
            <div key={i} className="garden-butterfly" style={{ left, top, opacity }}>
              <ButterflySvg color={color} size={size} />
            </div>
          );
        }

        return (
          <motion.div
            key={i}
            className="garden-butterfly"
            style={{ left, top, opacity }}
            animate={{ x: path.x, y: path.y, rotate: path.rotate }}
            transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <ButterflySvg color={color} size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

export { ButterflySvg, BUTTERFLY_COLORS };
