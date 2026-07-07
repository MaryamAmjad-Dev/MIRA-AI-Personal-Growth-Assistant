import { motion } from 'framer-motion';
import { seededRandom } from '../../../hooks/useFantasyBackground';

const BUBBLE_THEMES = {
  light: [
    { bg: 'rgba(251, 113, 133, 0.22)', border: 'rgba(251, 113, 133, 0.35)' },
    { bg: 'rgba(167, 139, 250, 0.2)', border: 'rgba(167, 139, 250, 0.38)' },
    { bg: 'rgba(56, 189, 248, 0.18)', border: 'rgba(56, 189, 248, 0.32)' },
    { bg: 'rgba(255, 255, 255, 0.25)', border: 'rgba(255, 255, 255, 0.5)' },
  ],
  dark: [
    { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(167, 139, 250, 0.25)' },
    { bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(125, 211, 252, 0.2)' },
    { bg: 'rgba(251, 113, 133, 0.08)', border: 'rgba(251, 113, 133, 0.18)' },
    { bg: 'rgba(255, 255, 255, 0.06)', border: 'rgba(255, 255, 255, 0.12)' },
  ],
};

export default function BubbleParticles({ count, mode = 'light', animate = true }) {
  const palette = BUBBLE_THEMES[mode] || BUBBLE_THEMES.light;

  const bubbles = Array.from({ length: count }, (_, i) => {
    const seed = i + 11;
    const theme = palette[i % palette.length];
    return {
      id: i,
      left: `${seededRandom(seed) * 95}%`,
      top: `${seededRandom(seed + 15) * 95}%`,
      size: 24 + Math.round(seededRandom(seed + 30) * 48),
      theme,
      duration: 14 + seededRandom(seed + 45) * 10,
      delay: seededRandom(seed + 60) * 5,
      rotate: seededRandom(seed + 75) * 360,
    };
  });

  return (
    <div className="bubble-particles">
      {bubbles.map((b) => {
        const style = {
          left: b.left,
          top: b.top,
          width: b.size,
          height: b.size,
          background: b.theme.bg,
          borderColor: b.theme.border,
        };

        if (!animate) {
          return <div key={b.id} className="bubble-particle" style={style} />;
        }

        return (
          <motion.div
            key={b.id}
            className="bubble-particle"
            style={style}
            animate={{
              y: [0, -35, 10, -20, 0],
              x: [0, 15, -10, 8, 0],
              rotate: [b.rotate, b.rotate + 20, b.rotate - 10, b.rotate],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
