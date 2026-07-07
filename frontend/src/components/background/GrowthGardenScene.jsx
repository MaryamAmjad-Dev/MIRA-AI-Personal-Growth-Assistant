import { motion } from 'framer-motion';
import Fairy from './Fairy';
import ButterflyWorld from './ButterflyWorld';
import MagicalObjects from './MagicalObjects';
import { seededRandom } from '../../hooks/useFantasyBackground';

const FAIRY_VARIANTS = ['pink', 'purple', 'blue'];

const FAIRY_PATHS = [
  { x: ['-5vw', '15vw', '8vw', '-3vw', '-5vw'], y: [0, -25, 15, -10, 0], rotate: [0, 5, -3, 2, 0] },
  { x: ['5vw', '-12vw', '-8vw', '10vw', '5vw'], y: [0, 20, -15, 10, 0], rotate: [0, -4, 6, -2, 0] },
  { x: ['0vw', '20vw', '-15vw', '5vw', '0vw'], y: [0, -18, 22, -8, 0], rotate: [0, 3, -5, 4, 0] },
];

function Layer({ depth, offset, parallax, className, children }) {
  const shift = parallax
    ? { x: offset.x * depth, y: offset.y * depth }
    : { x: 0, y: 0 };

  return (
    <div
      className={`garden-layer ${className}`}
      style={{ transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }}
    >
      {children}
    </div>
  );
}

/**
 * Maryam's Growth Garden 🦋 — light mode magical world
 */
export default function GrowthGardenScene({ config, offset, parallax, animate, emphasis = false }) {
  const fairySize = emphasis ? 64 : 52;
  const fairyPositions = emphasis
    ? [
        { left: '8%', top: '18%' },
        { left: '78%', top: '22%' },
        { left: '42%', top: '72%' },
      ]
    : [
        { left: '5%', top: '25%' },
        { left: '82%', top: '30%' },
        { left: '38%', top: '68%' },
      ];

  return (
    <>
      {/* Back — pastel animated sky */}
      <div className="garden-layer garden-sky" aria-hidden="true">
        <div className="garden-sky-gradient" />
        {animate && (
          <motion.div
            className="garden-sky-shimmer"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Middle — clouds, glow, stars, sparkles, flowers, crystals */}
      <Layer depth={6} offset={offset} parallax={parallax} className="garden-layer-middle">
        <MagicalObjects config={config} animate={animate} />
      </Layer>

      {/* Front — butterflies */}
      <Layer depth={14} offset={offset} parallax={parallax} className="garden-layer-butterflies">
        <ButterflyWorld count={config.butterflies} animate={animate} />
      </Layer>

      {/* Front — visible fairy characters */}
      <Layer depth={18} offset={offset} parallax={parallax} className="garden-layer-fairies">
        {FAIRY_VARIANTS.slice(0, config.fairyCharacters).map((variant, i) => {
          const path = FAIRY_PATHS[i];
          const pos = fairyPositions[i];
          const duration = 28 + i * 6;
          const delay = seededRandom(i + 200) * 3;

          if (!animate) {
            return (
              <div key={variant} className="garden-fairy-character" style={pos}>
                <Fairy variant={variant} size={fairySize} animate={false} />
                <span className="garden-fairy-trail" aria-hidden="true" />
              </div>
            );
          }

          return (
            <motion.div
              key={variant}
              className="garden-fairy-character"
              style={pos}
              animate={{ x: path.x, y: path.y, rotate: path.rotate }}
              transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
            >
              <Fairy variant={variant} size={fairySize} animate />
              <motion.span
                className="garden-fairy-trail"
                aria-hidden="true"
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          );
        })}
      </Layer>

      {/* Magic glow around center (login card area) */}
      {emphasis && (
        <div className="garden-center-glow" aria-hidden="true" />
      )}
    </>
  );
}
