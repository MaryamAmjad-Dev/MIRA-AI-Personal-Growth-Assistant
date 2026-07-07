import { motion } from 'framer-motion';
import { seededRandom } from '../../hooks/useFantasyBackground';

/**
 * Magic dust particles + floating bubbles
 */
export default function MagicDust({
  dustCount = 12,
  bubbleCount = 8,
  mode = 'light',
  animate = true,
}) {
  const dustColors = mode === 'dark'
    ? ['rgba(196,181,253,0.7)', 'rgba(147,197,253,0.65)', 'rgba(249,168,212,0.6)']
    : ['rgba(240,171,252,0.55)', 'rgba(165,216,255,0.5)', 'rgba(253,164,175,0.45)'];

  const bubbleFill = mode === 'dark'
    ? 'rgba(167,139,250,0.12)'
    : 'rgba(255,255,255,0.35)';
  const bubbleBorder = mode === 'dark'
    ? 'rgba(196,181,253,0.35)'
    : 'rgba(255,183,213,0.45)';

  return (
    <div className="magic-dust-layer" aria-hidden="true">
      {Array.from({ length: dustCount }).map((_, i) => {
        const seed = i + 99;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 10) * 100}%`,
          width: 2 + seededRandom(seed + 5) * 3,
          height: 2 + seededRandom(seed + 5) * 3,
          background: dustColors[i % 3],
          boxShadow: mode === 'dark' ? `0 0 4px ${dustColors[i % 3]}` : undefined,
        };

        if (!animate) {
          return <span key={`d-${i}`} className="magic-dust-dot" style={style} />;
        }

        return (
          <motion.span
            key={`d-${i}`}
            className="magic-dust-dot"
            style={style}
            animate={{
              opacity: [0.1, 0.65, 0.1],
              scale: [0.5, 1.1, 0.5],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {Array.from({ length: bubbleCount }).map((_, i) => {
        const seed = i + 150;
        const size = 8 + seededRandom(seed) * 18;
        const style = {
          left: `${seededRandom(seed + 1) * 92 + 2}%`,
          bottom: `${-seededRandom(seed + 2) * 20}%`,
          width: size,
          height: size,
          background: bubbleFill,
          border: `1px solid ${bubbleBorder}`,
        };

        if (!animate) {
          return <span key={`b-${i}`} className="magic-bubble" style={style} />;
        }

        return (
          <motion.span
            key={`b-${i}`}
            className="magic-bubble"
            style={style}
            animate={{
              y: ['0vh', '-115vh'],
              x: [0, seededRandom(seed + 3) * 30 - 15],
              rotate: [0, seededRandom(seed + 4) > 0.5 ? 180 : -180],
              opacity: [0, 0.5, 0.3, 0],
            }}
            transition={{
              duration: 20 + seededRandom(seed + 5) * 12,
              repeat: Infinity,
              delay: seededRandom(seed + 6) * 10,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}
