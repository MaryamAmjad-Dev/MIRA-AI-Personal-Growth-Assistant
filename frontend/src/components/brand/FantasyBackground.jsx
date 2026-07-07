import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useFantasyConfig, useParallax } from '../../hooks/useFantasyBackground';
import MagicalWorld from '../background/MagicalWorld';

/**
 * MIRA by Maryam 🦋 — unified magical background
 * Light: Morning Fairy Garden | Dark: Night Fairy Galaxy
 * @param {'full'|'soft'} intensity — soft for auth, full for app pages
 */
export default function FantasyBackground({ intensity = 'full' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = useFantasyConfig(intensity);
  const offset = useParallax(config.parallax);

  return (
    <div
      className={`fantasy-background magic-world ${isDark ? 'fantasy-mode-dark' : 'fantasy-mode-light'}`}
      aria-hidden="true"
      data-magic={isDark ? 'night-fairy-galaxy' : 'morning-fairy-garden'}
    >
      <MagicalWorld
        config={config}
        offset={offset}
        parallax={config.parallax}
        animate={config.animate}
        isDark={isDark}
        isMobile={config.isMobile}
        emphasis={config.emphasis}
      />

      <div className={`fantasy-readability-overlay ${config.emphasis ? 'fantasy-readability-auth' : ''}`} />

      {!isDark && config.animate && (
        <motion.div
          className="magic-light-sweep"
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', repeatDelay: 10 }}
        />
      )}
    </div>
  );
}
