import { motion } from 'framer-motion';

export default function PatternPanel({ patterns }) {
  if (!patterns?.length) return null;

  return (
    <div className="intel-card pattern-panel">
      <h3>🔍 Pattern Detection AI</h3>
      <div className="pattern-list">
        {patterns.map((p, i) => (
          <motion.div key={i} className="pattern-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <span className="pattern-type">{p.type}</span>
            <p>{p.insight}</p>
            <span className="pattern-confidence">{p.confidence}% confidence</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
