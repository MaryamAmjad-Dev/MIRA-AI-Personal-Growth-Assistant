import { motion } from 'framer-motion';
import StarField from '../brand/fantasy/StarField';
import { seededRandom } from '../../hooks/useFantasyBackground';

function CosmicDust({ count, animate }) {
  return (
    <div className="cosmic-dust">
      {Array.from({ length: count }).map((_, i) => {
        const seed = i + 99;
        const style = {
          left: `${seededRandom(seed) * 100}%`,
          top: `${seededRandom(seed + 10) * 100}%`,
        };
        if (!animate) return <span key={i} className="cosmic-dust-dot" style={style} />;
        return (
          <motion.span
            key={i}
            className="cosmic-dust-dot"
            style={style}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.25 }}
          />
        );
      })}
    </div>
  );
}

const DARK_BLOBS = [
  { color: 'rgba(139, 92, 246, 0.18)', x: '-5%', y: '-8%', size: 440 },
  { color: 'rgba(88, 28, 135, 0.22)', x: '65%', y: '-5%', size: 380 },
  { color: 'rgba(56, 189, 248, 0.1)', x: '25%', y: '55%', size: 420 },
  { color: 'rgba(167, 139, 250, 0.12)', x: '75%', y: '65%', size: 360 },
];

function Layer({ depth, offset, parallax, className, children }) {
  const shift = parallax
    ? { x: offset.x * depth, y: offset.y * depth }
    : { x: 0, y: 0 };
  return (
    <div className={`garden-layer ${className}`} style={{ transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }}>
      {children}
    </div>
  );
}

/** AI galaxy — dark mode only */
export default function GalaxyScene({ config, offset, parallax, animate }) {
  const blobs = DARK_BLOBS.slice(0, config.blobs);

  return (
    <>
      <div className="garden-layer galaxy-sky" />
      <Layer depth={8} offset={offset} parallax={parallax} className="garden-layer-blobs">
        {blobs.map((blob, i) => (
          animate ? (
            <motion.div
              key={i}
              className="fantasy-blob"
              style={{ left: blob.x, top: blob.y, width: blob.size, height: blob.size, background: blob.color }}
              animate={{ x: [0, 25, -15, 0], y: [0, -20, 12, 0], scale: [1, 1.06, 0.96, 1] }}
              transition={{ duration: 20 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <div key={i} className="fantasy-blob" style={{ left: blob.x, top: blob.y, width: blob.size, height: blob.size, background: blob.color }} />
          )
        ))}
      </Layer>
      <Layer depth={16} offset={offset} parallax={parallax} className="garden-layer-stars">
        <StarField count={config.stars} mode="dark" animate={animate} />
        <CosmicDust count={config.cosmicDust} animate={animate} />
      </Layer>
      {animate && (
        <motion.div
          className="fantasy-nebula-pulse"
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}
