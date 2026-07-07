import { motion } from 'framer-motion';

const FAIRY_THEMES = {
  pink: {
    wingL: '#FDA4AF',
    wingR: '#FB7185',
    dress: '#F472B6',
    dressDark: '#EC4899',
    glow: 'rgba(251, 113, 133, 0.55)',
    hair: '#8B5CF6',
    skin: '#FDDCBF',
  },
  purple: {
    wingL: '#C4B5FD',
    wingR: '#A78BFA',
    dress: '#A78BFA',
    dressDark: '#8B5CF6',
    glow: 'rgba(167, 139, 250, 0.55)',
    hair: '#FB7185',
    skin: '#FDDCBF',
  },
  blue: {
    wingL: '#93C5FD',
    wingR: '#60A5FA',
    dress: '#38BDF8',
    dressDark: '#0EA5E9',
    glow: 'rgba(56, 189, 248, 0.5)',
    hair: '#A78BFA',
    skin: '#FDDCBF',
  },
};

/**
 * Visible SVG fairy character — Maryam's Growth Garden 🦋
 */
export default function Fairy({
  variant = 'pink',
  size = 56,
  animate = true,
  className = '',
}) {
  const t = FAIRY_THEMES[variant] || FAIRY_THEMES.pink;
  const uid = `fairy-${variant}-${size}`;

  const svg = (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={size * 1.25}
      className={`garden-fairy-svg garden-fairy-${variant} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={t.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id={`${uid}-blur`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* aura */}
      <ellipse cx="32" cy="38" rx="28" ry="30" fill={`url(#${uid}-glow)`} opacity="0.7" />

      {/* wings */}
      <g className="fairy-wings" filter={`url(#${uid}-blur)`}>
        <ellipse cx="18" cy="34" rx="14" ry="9" fill={t.wingL} opacity="0.9" />
        <ellipse cx="46" cy="34" rx="14" ry="9" fill={t.wingR} opacity="0.9" />
        <ellipse cx="18" cy="34" rx="8" ry="5" fill="#fff" opacity="0.35" />
        <ellipse cx="46" cy="34" rx="8" ry="5" fill="#fff" opacity="0.35" />
      </g>

      {/* legs */}
      <path d="M28 58 L26 68 M36 58 L38 68" stroke={t.dressDark} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* dress */}
      <path d="M24 44 Q32 62 40 44 L38 56 Q32 60 26 56 Z" fill={t.dress} />
      <path d="M26 44 Q32 50 38 44" fill={t.dressDark} opacity="0.35" />

      {/* arms */}
      <path d="M22 42 Q14 46 12 52" stroke={t.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M42 42 Q50 46 52 52" stroke={t.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* head */}
      <circle cx="32" cy="28" r="9" fill={t.skin} />
      {/* hair */}
      <path d="M23 26 Q32 14 41 26 Q38 22 32 20 Q26 22 23 26" fill={t.hair} />
      <circle cx="28" cy="22" r="2.5" fill={t.hair} />
      <circle cx="36" cy="22" r="2.5" fill={t.hair} />
      {/* face */}
      <circle cx="29" cy="28" r="1.2" fill="#4A3728" />
      <circle cx="35" cy="28" r="1.2" fill="#4A3728" />
      <path d="M30 32 Q32 34 34 32" stroke="#D4956A" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="26" cy="30" rx="2.5" ry="1.2" fill="#FB7185" opacity="0.25" />
      <ellipse cx="38" cy="30" rx="2.5" ry="1.2" fill="#FB7185" opacity="0.25" />

      {/* wand sparkle */}
      <circle cx="52" cy="50" r="2" fill="#FDE68A" opacity="0.9" />
      <path d="M50 52 L54 48" stroke="#FDE68A" strokeWidth="1" opacity="0.6" />
    </svg>
  );

  if (!animate) return svg;

  return (
    <motion.div
      className="garden-fairy-wrap"
      animate={{ scaleX: [1, 0.94, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {svg}
    </motion.div>
  );
}

export { FAIRY_THEMES };
