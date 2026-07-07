import { motion } from 'framer-motion';

export default function PersonalityEvolution({ evolution }) {
  if (!evolution?.timeline?.length) return null;

  return (
    <article className="ai-card intel-card personality-evolution">
      <h3 className="ai-card-title">Personality Evolution</h3>
      <div className="evolution-track">
        {evolution.timeline.map((item, i) => (
          <motion.div
            key={item.month}
            className="evolution-node"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`evolution-dot ${item.dominant}`} />
            <div>
              <strong>{item.month}</strong>
              <span>{item.entries} entries · {item.dominant}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {evolution.twin && (
        <p className="ai-card-content evolution-summary">
          Current type: <strong>{evolution.twin.personalityType}</strong> — {evolution.twin.communicationStyle}
        </p>
      )}
    </article>
  );
}
