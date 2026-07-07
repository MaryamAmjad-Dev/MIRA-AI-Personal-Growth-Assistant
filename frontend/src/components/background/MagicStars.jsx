import { motion } from 'framer-motion';
import { seededRandom } from '../../hooks/useFantasyBackground';

/**
 * Tiny twinkling stars & sparkle particles — 3–8px
 */
export default function MagicStars({
  count = 30,
  mode = 'light',
  animate = true,
  sparkles = 0,
}) {
  const starColors = mode === 'dark'
    ? ['#E9D5FF', '#C4B5FD', '#93C5FD', '#F9A8D4', '#FFFFFF']
    : ['#FDE68A', '#F0ABFC', '#FDA4AF', '#93C5FD', '#FFF1C1'];

  return (
    <div className={`magic-stars-layer magic-stars-${mode}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const seed = i + 60;
        const size = 3 + seededRandom(seed + 2) * 5;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 1) * (mode === 'dark' ? 100 : 65)}%`,
          width: size,
          height: size,
          background: starColors[i % starColors.length],
          boxShadow: mode === 'dark'
            ? `0 0 ${size}px ${starColors[i % starColors.length]}`
            : `0 0 ${size * 0.8}px rgba(240, 171, 252, 0.5)`,
        };

        if (!animate) {
          return <span key={i} className="magic-star-dot" style={style} />;
        }

        return (
          <motion.span
            key={i}
            className="magic-star-dot"
            style={style}
            animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.6, 1.25, 0.6] }}
            transition={{
              duration: 2.2 + seededRandom(seed + 3) * 2.5,
              repeat: Infinity,
              delay: seededRandom(seed + 4) * 4,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {Array.from({ length: sparkles }).map((_, i) => {
        const seed = i + 200;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 1) * 100}%`,
          fontSize: 6 + seededRandom(seed + 2) * 4,
        };

        if (!animate) {
          return (
            <span key={`sp-${i}`} className="magic-sparkle-particle" style={style}>
              ✨
            </span>
          );
        }

        return (
          <motion.span
            key={`sp-${i}`}
            className="magic-sparkle-particle"
            style={style}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], rotate: [0, 30, 0] }}
            transition={{
              duration: 3 + seededRandom(seed + 2) * 2,
              repeat: Infinity,
              delay: seededRandom(seed + 3) * 5,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.span>
        );
      })}
    </div>
  );
}
