import { motion } from 'framer-motion';
import { seededRandom } from '../../hooks/useFantasyBackground';

function Cloud({ style, animate, delay, duration }) {
  const cloud = (
    <svg viewBox="0 0 120 48" className="garden-cloud-svg" aria-hidden="true">
      <ellipse cx="40" cy="28" rx="32" ry="18" fill="rgba(255,255,255,0.75)" />
      <ellipse cx="65" cy="22" rx="28" ry="20" fill="rgba(255,255,255,0.82)" />
      <ellipse cx="88" cy="30" rx="24" ry="16" fill="rgba(255,255,255,0.7)" />
    </svg>
  );

  if (!animate) return <div className="garden-cloud" style={style}>{cloud}</div>;

  return (
    <motion.div
      className="garden-cloud"
      style={style}
      animate={{ x: [0, 25, -15, 0], y: [0, -8, 5, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {cloud}
    </motion.div>
  );
}

function Flower({ style, animate, delay, petalColor }) {
  const flower = (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="16" cy="10" rx="5" ry="8" fill={petalColor} opacity="0.85" transform={`rotate(${deg} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="5" fill="#FDE68A" />
      <circle cx="16" cy="16" r="2.5" fill="#FBBF24" opacity="0.6" />
    </svg>
  );

  if (!animate) return <div className="garden-flower" style={style}>{flower}</div>;

  return (
    <motion.div
      className="garden-flower"
      style={style}
      animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {flower}
    </motion.div>
  );
}

export default function MagicalObjects({ config, animate = true }) {
  const petalColors = ['#FDA4AF', '#C4B5FD', '#93C5FD', '#F9A8D4'];

  return (
    <div className="magical-objects" aria-hidden="true">
      {/* Rainbow glow arc */}
      <div className="garden-rainbow-glow" />

      {/* Soft glow orbs */}
      {Array.from({ length: config.glowOrbs }).map((_, i) => {
        const seed = i + 40;
        const colors = ['rgba(255,183,213,0.35)', 'rgba(216,180,254,0.32)', 'rgba(165,216,255,0.28)'];
        const style = {
          left: `${seededRandom(seed) * 85 + 5}%`,
          top: `${seededRandom(seed + 3) * 80 + 5}%`,
          width: 80 + seededRandom(seed + 6) * 100,
          height: 80 + seededRandom(seed + 6) * 100,
          background: colors[i % 3],
        };
        if (!animate) return <div key={`orb-${i}`} className="garden-glow-orb" style={style} />;
        return (
          <motion.div
            key={`orb-${i}`}
            className="garden-glow-orb"
            style={style}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Clouds */}
      {Array.from({ length: config.clouds }).map((_, i) => {
        const seed = i + 50;
        const style = {
          left: `${seededRandom(seed) * 75}%`,
          top: `${seededRandom(seed + 2) * 35 + 2}%`,
          width: 100 + seededRandom(seed + 4) * 60,
        };
        return (
          <Cloud
            key={`cloud-${i}`}
            style={style}
            animate={animate}
            delay={seededRandom(seed + 6) * 4}
            duration={18 + i * 4}
          />
        );
      })}

      {/* Twinkling stars */}
      {Array.from({ length: config.stars }).map((_, i) => {
        const seed = i + 60;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 1) * 55}%`,
          fontSize: 8 + seededRandom(seed + 2) * 8,
        };
        if (!animate) return <span key={`star-${i}`} className="garden-star" style={style}>⭐</span>;
        return (
          <motion.span
            key={`star-${i}`}
            className="garden-star"
            style={style}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5 + seededRandom(seed + 3) * 2, repeat: Infinity, delay: seededRandom(seed + 4) * 3 }}
          >
            ⭐
          </motion.span>
        );
      })}

      {/* Sparkles */}
      {Array.from({ length: config.sparkles }).map((_, i) => {
        const seed = i + 80;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 1) * 100}%`,
        };
        if (!animate) return <span key={`sp-${i}`} className="garden-sparkle" style={style}>✨</span>;
        return (
          <motion.span
            key={`sp-${i}`}
            className="garden-sparkle"
            style={style}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], rotate: [0, 45, 0] }}
            transition={{ duration: 3 + seededRandom(seed + 2) * 2, repeat: Infinity, delay: seededRandom(seed + 3) * 4 }}
          >
            ✨
          </motion.span>
        );
      })}

      {/* Floating flowers */}
      {Array.from({ length: config.flowers }).map((_, i) => {
        const seed = i + 100;
        const style = {
          left: `${seededRandom(seed) * 92 + 4}%`,
          top: `${seededRandom(seed + 1) * 75 + 15}%`,
          opacity: 0.7 + seededRandom(seed + 2) * 0.3,
        };
        return (
          <Flower
            key={`fl-${i}`}
            style={style}
            animate={animate}
            delay={seededRandom(seed + 3) * 3}
            petalColor={petalColors[i % petalColors.length]}
          />
        );
      })}

      {/* Crystal particles */}
      {Array.from({ length: config.crystals }).map((_, i) => {
        const seed = i + 120;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 1) * 100}%`,
        };
        if (!animate) return <span key={`cr-${i}`} className="garden-crystal" style={style}>💎</span>;
        return (
          <motion.span
            key={`cr-${i}`}
            className="garden-crystal"
            style={style}
            animate={{ y: [0, -15, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 5 + seededRandom(seed + 2) * 3, repeat: Infinity, delay: seededRandom(seed + 3) * 2 }}
          >
            💎
          </motion.span>
        );
      })}
    </div>
  );
}
