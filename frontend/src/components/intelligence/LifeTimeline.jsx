import { motion } from 'framer-motion';

const TYPE_ICON = { mood: '😊', goal: '🎯', achievement: '🏆', capsule: '⏳' };

export default function LifeTimeline({ events }) {
  if (!events?.length) {
    return (
      <div className="intel-card">
        <h3>Life Timeline</h3>
        <p className="intel-sub">Important moments will appear as you journal, complete goals, and earn achievements.</p>
      </div>
    );
  }

  return (
    <div className="intel-card life-timeline">
      <h3>Life Timeline</h3>
      <div className="timeline-track">
        {events.map((e, i) => (
          <motion.div
            key={`${e.type}-${e.date}-${i}`}
            className="timeline-event"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="timeline-dot">{TYPE_ICON[e.type] || '•'}</div>
            <div className="timeline-content">
              <time>{new Date(e.date).toLocaleDateString()}</time>
              <strong>{e.title}</strong>
              {e.description && <p>{e.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
