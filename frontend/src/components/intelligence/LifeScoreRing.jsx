import { motion } from 'framer-motion';

export default function LifeScoreRing({ score }) {
  if (!score) return null;

  const pct = score.overall || 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  const dimensions = [
    { label: 'Mental', value: score.mentalHealth, color: '#6366f1' },
    { label: 'Productivity', value: score.productivity, color: '#8b5cf6' },
    { label: 'Consistency', value: score.consistency, color: '#06b6d4' },
    { label: 'Growth', value: score.growth, color: '#22c55e' },
    { label: 'Balance', value: score.balance, color: '#f59e0b' },
  ];

  return (
    <motion.div className="intel-card life-score-ring" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <h3>Life Score</h3>
      <div className="score-ring-wrap">
        <svg viewBox="0 0 120 120" className="score-ring-svg">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke="url(#scoreGrad)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="score-ring-value">{pct}</div>
      </div>
      <div className="score-dimensions">
        {dimensions.map((d) => (
          <div key={d.label} className="score-dim">
            <span>{d.label}</span>
            <div className="score-dim-bar"><div style={{ width: `${d.value}%`, background: d.color }} /></div>
            <span>{d.value}</span>
          </div>
        ))}
      </div>
      {score.explanation && <p className="score-explanation">{score.explanation}</p>}
    </motion.div>
  );
}
