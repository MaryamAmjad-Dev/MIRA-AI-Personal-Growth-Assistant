import { motion } from 'framer-motion';

const LEVEL_CLASS = { Low: 'low', Medium: 'medium', High: 'high' };

export default function BurnoutMonitor({ burnout }) {
  if (!burnout) return null;

  return (
    <motion.div className={`intel-card burnout-monitor level-${LEVEL_CLASS[burnout.level]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="intel-card-header">
        <span className="intel-icon">🔥</span>
        <div>
          <h3>Burnout Monitor</h3>
          <p className={`burnout-level ${LEVEL_CLASS[burnout.level]}`}>{burnout.level} Risk</p>
        </div>
      </div>
      <div className="burnout-bar"><div style={{ width: `${burnout.score}%` }} /></div>
      <ul>{burnout.signals?.map((s) => <li key={s}>{s}</li>)}</ul>
      <p className="burnout-rec">{burnout.recommendation}</p>
    </motion.div>
  );
}
