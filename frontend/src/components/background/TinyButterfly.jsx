import { motion } from 'framer-motion';
import { seededRandom, getButterflySize } from '../../hooks/useFantasyBackground';

const LIGHT_COLORS = {
  pink: { left: '#FB7185', right: '#FDA4AF', body: '#BE185D' },
  purple: { left: '#A78BFA', right: '#C4B5FD', body: '#6D28D9' },
  blue: { left: '#38BDF8', right: '#7DD3FC', body: '#0369A1' },
};

const DARK_COLORS = {
  pink: { left: '#F472B6', right: '#FB7185', body: '#831843', glow: 'rgba(244,114,182,0.6)' },
  purple: { left: '#A78BFA', right: '#8B5CF6', body: '#5B21B6', glow: 'rgba(167,139,250,0.65)' },
  blue: { left: '#38BDF8', right: '#60A5FA', body: '#1E40AF', glow: 'rgba(56,189,248,0.6)' },
};

function ButterflySvg({ color = 'pink', size = 16, mode = 'light', seed = 0 }) {
  const palette = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const c = palette[color] || palette.pink;
  const flapDuration = 0.32 + seededRandom(seed) * 0.12;

  return (
    <svg
      viewBox="0 0 24 20"
      width={size}
      height={size * 0.83}
      className={`magic-tiny-butterfly magic-butterfly-${color}`}
      aria-hidden="true"
      style={mode === 'dark' && c.glow ? { filter: `drop-shadow(0 0 4px ${c.glow})` } : undefined}
    >
      <motion.g
        animate={{ scaleX: [1, 0.72, 1] }}
        transition={{ duration: flapDuration, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 10px' }}
      >
        <path
          d="M12 4 C9 5 5 6 3 10 C6 9 8 8 9 6 C8 10 9 14 12 16 C11 12 10 8 11 6 C9 8 6 9 3 10 C5 6 9 5 12 4Z"
          fill={c.left}
          opacity="0.9"
        />
        <path
          d="M12 4 C15 5 19 6 21 10 C18 9 16 8 15 6 C16 10 15 14 12 16 C13 12 14 8 13 6 C15 8 18 9 21 10 C19 6 15 5 12 4Z"
          fill={c.right}
          opacity="0.78"
        />
        <ellipse cx="12" cy="9" rx="0.8" ry="5" fill={c.body} opacity="0.85" />
        <circle cx="12" cy="4" r="1.2" fill={c.body} />
      </motion.g>
    </svg>
  );
}

const FLIGHT_PATHS = [
  { x: [0, 48, -28, 36, 0], y: [0, -22, 14, -16, 0], rotate: [0, 6, -4, 5, 0] },
  { x: [0, -42, 32, -22, 0], y: [0, 16, -20, 10, 0], rotate: [0, -5, 7, -3, 0] },
  { x: [0, 30, 55, -18, 0], y: [0, -14, 18, -22, 0], rotate: [0, 4, -6, 3, 0] },
];

/**
 * Tiny butterflies — 12–22px desktop, 10–14px mobile
 */
export default function TinyButterfly({
  count = 8,
  mode = 'light',
  animate = true,
  isMobile = false,
}) {
  const colors = ['pink', 'purple', 'blue'];

  return (
    <div className="magic-butterfly-layer" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const seed = i + 30;
        const color = colors[i % 3];
        const size = getButterflySize(isMobile, seed);
        const left = `${(seededRandom(seed + 5) < 0.5 ? seededRandom(seed + 5) * 38 : 58 + seededRandom(seed + 5) * 38)}%`;
        const top = `${seededRandom(seed + 10) * 80 + 8}%`;
        const duration = 24 + seededRandom(seed + 15) * 16;
        const delay = seededRandom(seed + 20) * 4;
        const path = FLIGHT_PATHS[i % FLIGHT_PATHS.length];
        const opacity = mode === 'dark' ? 0.75 + seededRandom(seed + 25) * 0.25 : 0.55 + seededRandom(seed + 25) * 0.4;

        if (!animate) {
          return (
            <div key={i} className="magic-tiny-butterfly-item" style={{ left, top, opacity }}>
              <ButterflySvg color={color} size={size} mode={mode} seed={seed} />
            </div>
          );
        }

        return (
          <motion.div
            key={i}
            className="magic-tiny-butterfly-item"
            style={{ left, top, opacity }}
            animate={{ x: path.x, y: path.y, rotate: path.rotate }}
            transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <ButterflySvg color={color} size={size} mode={mode} seed={seed} />
          </motion.div>
        );
      })}
    </div>
  );
}

export { ButterflySvg, LIGHT_COLORS, DARK_COLORS };
