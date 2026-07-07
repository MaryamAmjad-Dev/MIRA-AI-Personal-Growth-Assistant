import { DEFAULT_MALE_CONFIG, DEFAULT_FEMALE_CONFIG } from '../../utils/avatarDefaults';

function Hair({ config }) {
  const { hair, hairColor, gender } = config;

  if (hair === 'hijab') {
    return (
      <>
        <path
          d="M28 95 C28 45 55 22 100 22 C145 22 172 45 172 95 C172 130 158 155 130 168 C115 175 100 178 100 178 C100 178 85 175 70 168 C42 155 28 130 28 95 Z"
          fill={hairColor}
        />
        <path
          d="M62 72 C62 48 78 38 100 38 C122 38 138 48 138 72 C138 88 132 98 125 102 C118 82 110 75 100 75 C90 75 82 82 75 102 C68 98 62 88 62 72 Z"
          fill={hairColor}
        />
      </>
    );
  }

  if (hair === 'long') {
    return (
      <path
        d="M55 55 C55 30 72 18 100 18 C128 18 145 30 145 55 C145 90 140 130 125 155 C115 168 100 175 100 175 C100 175 85 168 75 155 C60 130 55 90 55 55 Z"
        fill={hairColor}
      />
    );
  }

  if (hair === 'curly') {
    return (
      <>
        {[72, 88, 100, 112, 128].map((cx, i) => (
          <circle key={i} cx={cx} cy={42 - (i % 2) * 4} r="14" fill={hairColor} />
        ))}
      </>
    );
  }

  if (hair === 'bun') {
    return (
      <>
        <circle cx="100" cy="32" r="18" fill={hairColor} />
        <ellipse cx="100" cy="58" rx="42" ry="28" fill={hairColor} />
      </>
    );
  }

  // short (default male)
  return (
    <path
      d="M62 72 C62 48 78 38 100 38 C122 38 138 48 138 72 C138 82 135 58 100 55 C65 58 62 82 62 72 Z"
      fill={hairColor}
    />
  );
}

function Face({ config }) {
  const { skin, expression } = config;
  const smile = expression === 'happy' ? 'M88 112 Q100 122 112 112' : expression === 'calm' ? 'M92 112 Q100 116 108 112' : 'M90 112 Q100 118 110 112';

  return (
    <>
      <ellipse cx="100" cy="98" rx="38" ry="42" fill={skin} />
      <ellipse cx="86" cy="96" rx="5" ry="6" fill="#4A3728" />
      <ellipse cx="114" cy="96" rx="5" ry="6" fill="#4A3728" />
      <circle cx="88" cy="94" r="1.5" fill="#fff" opacity="0.85" />
      <circle cx="116" cy="94" r="1.5" fill="#fff" opacity="0.85" />
      <path d={smile} stroke="#D4956A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="78" cy="106" rx="8" ry="4" fill="#FB7185" opacity="0.22" />
      <ellipse cx="122" cy="106" rx="8" ry="4" fill="#FB7185" opacity="0.22" />
    </>
  );
}

function Accessory({ config }) {
  if (config.accessory === 'glasses') {
    return (
      <>
        <circle cx="86" cy="96" r="10" stroke="#8B5CF6" strokeWidth="2" fill="none" />
        <circle cx="114" cy="96" r="10" stroke="#8B5CF6" strokeWidth="2" fill="none" />
        <path d="M96 96 H104" stroke="#8B5CF6" strokeWidth="2" />
      </>
    );
  }
  if (config.accessory === 'flower') {
    return (
      <g transform="translate(128, 68)">
        <circle r="6" fill="#FB7185" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-9" rx="4" ry="7" fill="#F9A8D4" transform={`rotate(${deg})`} />
        ))}
      </g>
    );
  }
  return null;
}

export default function CustomAvatar({ config, className = '' }) {
  const c = config?.gender === 'male'
    ? { ...DEFAULT_MALE_CONFIG, ...config }
    : { ...DEFAULT_FEMALE_CONFIG, ...config };

  return (
    <svg
      className={`custom-avatar-svg ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <rect width="200" height="200" rx="100" fill={c.bg} />
      <circle cx="100" cy="105" r="72" fill={c.bg} opacity="0.5" />

      {/* shoulders / shirt */}
      <ellipse cx="100" cy="168" rx="58" ry="28" fill={c.gender === 'male' ? '#38BDF8' : '#FB7185'} opacity="0.85" />
      <path d="M45 168 Q100 148 155 168 L155 200 L45 200 Z" fill={c.gender === 'male' ? '#0EA5E9' : '#F472B6'} opacity="0.9" />

      <Hair config={c} />
      <Face config={c} />
      <Accessory config={c} />
    </svg>
  );
}
