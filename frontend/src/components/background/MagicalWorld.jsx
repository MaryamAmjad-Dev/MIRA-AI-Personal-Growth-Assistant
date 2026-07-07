import { motion } from 'framer-motion';
import TinyFairy from './TinyFairy';
import TinyButterfly from './TinyButterfly';
import MagicStars from './MagicStars';
import MagicDust from './MagicDust';
import { seededRandom, getFairySize } from '../../hooks/useFantasyBackground';

const FAIRY_PATHS = [
  { x: ['0vw', '12vw', '6vw', '-4vw', '0vw'], y: [0, -18, 10, -8, 0], rotate: [0, 4, -3, 2, 0] },
  { x: ['0vw', '-10vw', '-6vw', '8vw', '0vw'], y: [0, 14, -12, 8, 0], rotate: [0, -3, 5, -2, 0] },
  { x: ['0vw', '14vw', '-10vw', '4vw', '0vw'], y: [0, -12, 16, -6, 0], rotate: [0, 2, -4, 3, 0] },
  { x: ['0vw', '-8vw', '10vw', '-5vw', '0vw'], y: [0, 10, -14, 6, 0], rotate: [0, -2, 4, -1, 0] },
  { x: ['0vw', '6vw', '-12vw', '8vw', '0vw'], y: [0, -10, 12, -5, 0], rotate: [0, 3, -2, 4, 0] },
];

const LIGHT_BLOBS = [
  { color: 'rgba(255,183,213,0.32)', x: '-4%', y: '-6%', size: 320 },
  { color: 'rgba(216,180,254,0.28)', x: '68%', y: '-4%', size: 280 },
  { color: 'rgba(165,216,255,0.24)', x: '22%', y: '58%', size: 300 },
  { color: 'rgba(255,241,193,0.22)', x: '72%', y: '62%', size: 260 },
];

const DARK_BLOBS = [
  { color: 'rgba(139, 92, 246, 0.22)', x: '-5%', y: '-8%', size: 380 },
  { color: 'rgba(49, 46, 129, 0.35)', x: '62%', y: '-5%', size: 340 },
  { color: 'rgba(56, 189, 248, 0.12)', x: '20%', y: '52%', size: 360 },
  { color: 'rgba(244, 114, 182, 0.14)', x: '78%', y: '68%', size: 300 },
];

const FLOWER_COLORS = ['#FDA4AF', '#C4B5FD', '#93C5FD', '#F9A8D4'];

function Layer({ depth, offset, parallax, className, children }) {
  const shift = parallax
    ? { x: offset.x * depth, y: offset.y * depth }
    : { x: 0, y: 0 };

  return (
    <div
      className={`magic-layer ${className}`}
      style={{ transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }}
    >
      {children}
    </div>
  );
}

function TinyFlower({ style, animate, delay, petalColor }) {
  const flower = (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="10"
          cy="6"
          rx="3"
          ry="5"
          fill={petalColor}
          opacity="0.85"
          transform={`rotate(${deg} 10 10)`}
        />
      ))}
      <circle cx="10" cy="10" r="3" fill="#FDE68A" />
    </svg>
  );

  if (!animate) return <div className="magic-tiny-flower" style={style}>{flower}</div>;

  return (
    <motion.div
      className="magic-tiny-flower"
      style={style}
      animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 7 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {flower}
    </motion.div>
  );
}

function PastelClouds({ count = 3, animate = true }) {
  return (
    <div className="magic-pastel-clouds" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const seed = i + 500;
        const style = {
          left: `${seededRandom(seed) * 80 + 5}%`,
          top: `${seededRandom(seed + 1) * 28 + 4}%`,
          width: 70 + seededRandom(seed + 2) * 50,
          opacity: 0.55 + seededRandom(seed + 3) * 0.25,
        };
        const cloud = (
          <svg viewBox="0 0 100 40" className="magic-pastel-cloud-svg" aria-hidden="true">
            <ellipse cx="30" cy="24" rx="26" ry="14" fill="rgba(255,255,255,0.82)" />
            <ellipse cx="55" cy="18" rx="22" ry="16" fill="rgba(255,255,255,0.9)" />
            <ellipse cx="78" cy="24" rx="20" ry="12" fill="rgba(255,255,255,0.75)" />
          </svg>
        );
        if (!animate) return <div key={i} className="magic-pastel-cloud" style={style}>{cloud}</div>;
        return (
          <motion.div
            key={i}
            className="magic-pastel-cloud"
            style={style}
            animate={{ x: [0, 20, -12, 0], y: [0, -6, 4, 0] }}
            transition={{ duration: 24 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {cloud}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Unified magical world — Morning Fairy Garden (light) | Night Fairy Galaxy (dark)
 */
export default function MagicalWorld({
  config,
  offset,
  parallax,
  animate,
  isDark,
  isMobile,
  emphasis = false,
}) {
  const mode = isDark ? 'dark' : 'light';
  const blobs = (isDark ? DARK_BLOBS : LIGHT_BLOBS).slice(0, config.blobs);

  const fairyPositions = [
    { left: '4%', top: '12%' },
    { left: '88%', top: '16%' },
    { left: '6%', top: '78%' },
    { left: '86%', top: '74%' },
  ];
  const fairyVariants = ['pink', 'purple', 'blue', 'pink', 'purple'];

  return (
    <>
      {/* Layer 1 — theme gradient */}
      <div className="magic-layer magic-layer-sky" aria-hidden="true">
        <div className={`magic-sky-gradient magic-sky-${mode}`} />
        {!isDark && animate && (
          <motion.div
            className="magic-sky-shimmer"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {isDark && (
          <>
            <div className="magic-moon-glow" aria-hidden="true" />
            {animate && (
              <motion.div
                className="magic-nebula-soft"
                animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.04, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </>
        )}
        {!isDark && <div className="magic-rainbow-soft" aria-hidden="true" />}
        {!isDark && <PastelClouds count={config.clouds || 3} animate={animate} />}
      </div>

      {/* Layer 2 — blur glow blobs */}
      <Layer depth={5} offset={offset} parallax={parallax} className="magic-layer-blobs">
        {blobs.map((blob, i) =>
          animate ? (
            <motion.div
              key={i}
              className="magic-glow-blob"
              style={{
                left: blob.x,
                top: blob.y,
                width: blob.size,
                height: blob.size,
                background: blob.color,
              }}
              animate={{ x: [0, 18, -12, 0], y: [0, -14, 8, 0], scale: [1, 1.05, 0.97, 1] }}
              transition={{ duration: 22 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <div
              key={i}
              className="magic-glow-blob"
              style={{
                left: blob.x,
                top: blob.y,
                width: blob.size,
                height: blob.size,
                background: blob.color,
              }}
            />
          )
        )}
      </Layer>

      {/* Layer 3 — stars, dust, bubbles, light flowers */}
      <Layer depth={10} offset={offset} parallax={parallax} className="magic-layer-dust magic-opacity-stars">
        <MagicStars
          count={config.stars}
          sparkles={config.sparkles}
          mode={mode}
          animate={animate}
        />
        <div className="magic-opacity-dust">
          <MagicDust
            dustCount={config.dust}
            bubbleCount={config.bubbles}
            mode={mode}
            animate={animate}
          />
        </div>
        {!isDark && (
          <div className="magic-opacity-flowers">
            {Array.from({ length: config.flowers }).map((_, i) => {
              const seed = i + 100;
              const style = {
                left: `${(seededRandom(seed) < 0.5 ? seededRandom(seed) * 40 : 60 + seededRandom(seed) * 38)}%`,
                top: `${seededRandom(seed + 1) * 75 + 10}%`,
              };
              return (
                <TinyFlower
                  key={`fl-${i}`}
                  style={style}
                  animate={animate}
                  delay={seededRandom(seed + 3) * 3}
                  petalColor={FLOWER_COLORS[i % FLOWER_COLORS.length]}
                />
              );
            })}
          </div>
        )}
      </Layer>

      {/* Layer 4 — butterflies */}
      <Layer depth={14} offset={offset} parallax={parallax} className="magic-layer-butterflies magic-opacity-butterflies">
        <TinyButterfly
          count={config.butterflies}
          mode={mode}
          animate={animate}
          isMobile={isMobile}
        />
      </Layer>

      {/* Layer 5 — tiny fairies (both themes) */}
      <Layer depth={18} offset={offset} parallax={parallax} className="magic-layer-fairies magic-opacity-fairies">
        {fairyVariants.slice(0, config.fairies).map((variant, i) => {
            const path = FAIRY_PATHS[i % FAIRY_PATHS.length];
            const pos = fairyPositions[i] || fairyPositions[0];
            const size = getFairySize(isMobile, i + 300);
            const duration = 32 + i * 5;
            const delay = seededRandom(i + 400) * 3;

            if (!animate) {
              return (
                <div key={`f-${i}`} className="magic-fairy-item" style={pos}>
                  <TinyFairy variant={variant} size={size} mode={mode} animate={false} />
                </div>
              );
            }

            return (
              <motion.div
                key={`f-${i}`}
                className="magic-fairy-item"
                style={pos}
                animate={{ x: path.x, y: path.y, rotate: path.rotate }}
                transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
              >
                <TinyFairy variant={variant} size={size} mode={mode} animate />
              </motion.div>
            );
          })}
      </Layer>

      {emphasis && <div className="magic-center-glow" aria-hidden="true" />}
    </>
  );
}
