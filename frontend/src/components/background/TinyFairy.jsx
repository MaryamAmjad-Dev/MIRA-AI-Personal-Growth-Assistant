import { motion } from 'framer-motion';

const LIGHT_THEMES = {
  pink: { wingL: '#FDA4AF', wingR: '#FB7185', dress: '#F472B6', glow: 'rgba(251,113,133,0.45)', trail: '#F0ABFC' },
  purple: { wingL: '#C4B5FD', wingR: '#A78BFA', dress: '#A78BFA', glow: 'rgba(167,139,250,0.45)', trail: '#E9D5FF' },
  blue: { wingL: '#93C5FD', wingR: '#60A5FA', dress: '#38BDF8', glow: 'rgba(56,189,248,0.4)', trail: '#BAE6FD' },
};

const DARK_THEMES = {
  pink: { wingL: '#F472B6', wingR: '#FB7185', dress: '#EC4899', glow: 'rgba(244,114,182,0.65)', trail: '#F9A8D4' },
  purple: { wingL: '#A78BFA', wingR: '#8B5CF6', dress: '#7C3AED', glow: 'rgba(139,92,246,0.7)', trail: '#C4B5FD' },
  blue: { wingL: '#60A5FA', wingR: '#38BDF8', dress: '#0EA5E9', glow: 'rgba(56,189,248,0.65)', trail: '#7DD3FC' },
};

/**
 * Tiny elegant SVG fairy — 18–28px desktop, 12–18px mobile
 */
export default function TinyFairy({
  variant = 'pink',
  size = 22,
  mode = 'light',
  animate = true,
  className = '',
}) {
  const themes = mode === 'dark' ? DARK_THEMES : LIGHT_THEMES;
  const t = themes[variant] || themes.pink;
  const uid = `tf-${mode}-${variant}-${Math.round(size)}`;

  const svg = (
    <svg
      viewBox="0 0 24 30"
      width={size}
      height={size * 1.25}
      className={`magic-tiny-fairy magic-tiny-fairy-${variant} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-g`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={t.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {mode === 'dark' && (
          <filter id={`${uid}-glow`}>
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <ellipse cx="12" cy="14" rx="9" ry="10" fill={`url(#${uid}-g)`} opacity={mode === 'dark' ? 0.85 : 0.55} />

      <g
        className="magic-fairy-wings"
        filter={mode === 'dark' ? `url(#${uid}-glow)` : undefined}
        style={{ transformOrigin: '12px 13px' }}
      >
        <ellipse cx="6" cy="12" rx="5" ry="3.2" fill={t.wingL} opacity="0.92" />
        <ellipse cx="18" cy="12" rx="5" ry="3.2" fill={t.wingR} opacity="0.88" />
      </g>

      <path d="M10 16 L9 21 M14 16 L15 21" stroke={t.dress} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M9 15 Q12 20 15 15 L14 18 Q12 19 10 18 Z" fill={t.dress} />
      <circle cx="12" cy="10" r="3.2" fill="#FDDCBF" />
      <circle cx="10.8" cy="10" r="0.5" fill="#4A3728" />
      <circle cx="13.2" cy="10" r="0.5" fill="#4A3728" />
      <path d="M9 8 Q12 5 15 8" fill={mode === 'dark' ? '#C4B5FD' : '#A78BFA'} opacity="0.9" />
    </svg>
  );

  const trail = (
    <span
      className="magic-fairy-trail"
      style={{
        background: `radial-gradient(circle, ${t.trail}, transparent)`,
        boxShadow: mode === 'dark'
          ? `0 0 6px ${t.trail}, 0 -8px 14px ${t.glow}`
          : `0 0 5px ${t.trail}, 0 -6px 10px ${t.glow}`,
      }}
      aria-hidden="true"
    />
  );

  if (!animate) {
    return (
      <div className="magic-tiny-fairy-wrap">
        {svg}
        {trail}
      </div>
    );
  }

  return (
    <motion.div
      className="magic-tiny-fairy-wrap"
      animate={{ scaleX: [1, 0.9, 1] }}
      transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
    >
      {svg}
      <motion.span
        className="magic-fairy-trail"
        style={{
          background: `radial-gradient(circle, ${t.trail}, transparent)`,
          boxShadow: mode === 'dark'
            ? `0 0 6px ${t.trail}, 0 -8px 14px ${t.glow}`
            : `0 0 5px ${t.trail}, 0 -6px 10px ${t.glow}`,
        }}
        animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.7, 1.15, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export { LIGHT_THEMES, DARK_THEMES };
