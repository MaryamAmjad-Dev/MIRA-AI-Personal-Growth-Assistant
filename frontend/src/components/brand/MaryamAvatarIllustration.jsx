/**
 * Premium hijabi AI assistant illustration — Maryam avatar
 */
export default function MaryamAvatarIllustration({ className = '' }) {
  return (
    <svg
      className={`maryam-avatar-svg ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Maryam AI avatar"
    >
      <defs>
        <linearGradient id="maryamSkin" x1="100" y1="60" x2="100" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDDCBF" />
          <stop offset="1" stopColor="#F5C4A1" />
        </linearGradient>
        <linearGradient id="maryamHijab" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#FB7185" />
        </linearGradient>
        <linearGradient id="maryamHijabInner" x1="70" y1="50" x2="130" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <radialGradient id="maryamGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 90) rotate(90) scale(80)">
          <stop stopColor="#F0ABFC" stopOpacity="0.4" />
          <stop offset="1" stopColor="#F0ABFC" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="maryamAbaya" x1="100" y1="130" x2="100" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="98" fill="url(#maryamGlow)" />

      {/* Shoulders / abaya */}
      <ellipse cx="100" cy="168" rx="72" ry="38" fill="url(#maryamAbaya)" />
      <path d="M35 168 Q100 145 165 168 L165 200 L35 200 Z" fill="url(#maryamAbaya)" opacity="0.9" />

      {/* Hijab drape */}
      <path
        d="M28 95 C28 45 55 22 100 22 C145 22 172 45 172 95 C172 130 158 155 130 168 C115 175 100 178 100 178 C100 178 85 175 70 168 C42 155 28 130 28 95 Z"
        fill="url(#maryamHijab)"
      />
      <path
        d="M55 88 C55 55 72 38 100 38 C128 38 145 55 145 88 C145 115 135 138 115 148 C108 152 100 154 100 154 C100 154 92 152 85 148 C65 138 55 115 55 88 Z"
        fill="url(#maryamHijabInner)"
        opacity="0.35"
      />

      {/* Face */}
      <ellipse cx="100" cy="98" rx="38" ry="42" fill="url(#maryamSkin)" />

      {/* Hijab frame around face */}
      <path
        d="M62 72 C62 48 78 38 100 38 C122 38 138 48 138 72 C138 88 132 98 125 102 C118 82 110 75 100 75 C90 75 82 82 75 102 C68 98 62 88 62 72 Z"
        fill="url(#maryamHijab)"
      />
      <ellipse cx="100" cy="98" rx="36" ry="40" fill="url(#maryamSkin)" />

      {/* Eyes */}
      <ellipse cx="86" cy="96" rx="5" ry="6" fill="#4A3728" />
      <ellipse cx="114" cy="96" rx="5" ry="6" fill="#4A3728" />
      <circle cx="88" cy="94" r="1.5" fill="#fff" opacity="0.8" />
      <circle cx="116" cy="94" r="1.5" fill="#fff" opacity="0.8" />

      {/* Soft smile */}
      <path d="M90 112 Q100 118 110 112" stroke="#D4956A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <ellipse cx="78" cy="106" rx="8" ry="4" fill="#FB7185" opacity="0.2" />
      <ellipse cx="122" cy="106" rx="8" ry="4" fill="#FB7185" opacity="0.2" />

      {/* Hijab fold highlight */}
      <path d="M45 70 Q100 55 155 70" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
