import { motion } from 'framer-motion';
import { seededRandom } from '../../../hooks/useFantasyBackground';

export default function StarField({ count, mode = 'light', animate = true }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const seed = i + 3;
    return {
      id: i,
      left: `${seededRandom(seed) * 100}%`,
      top: `${seededRandom(seed + 20) * 100}%`,
      size: mode === 'dark'
        ? 2 + seededRandom(seed + 40) * 3
        : 1.5 + seededRandom(seed + 40) * 2.5,
      delay: seededRandom(seed + 60) * 4,
      duration: 2 + seededRandom(seed + 80) * 3,
      glow: mode === 'dark'
        ? seededRandom(seed + 100) > 0.5
        : seededRandom(seed + 100) > 0.65,
    };
  });

  return (
    <div className={`star-field star-field-${mode}`}>
      {stars.map((star) => {
        const style = {
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
        };

        if (!animate) {
          return <span key={star.id} className="star-dot" style={{ ...style, opacity: 0.4 }} />;
        }

        return (
          <motion.span
            key={star.id}
            className={`star-dot ${star.glow ? 'star-glow' : ''}`}
            style={style}
            animate={{
              opacity: [0.2, star.glow ? 1 : 0.7, 0.2],
              scale: [0.8, star.glow ? 1.4 : 1.1, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
