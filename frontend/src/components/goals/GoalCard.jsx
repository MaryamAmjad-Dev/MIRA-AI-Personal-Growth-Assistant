import { motion } from 'framer-motion';

export default function GoalCard({ goal, onToggleMilestone, onEdit, onDelete }) {
  return (
    <motion.div className="goal-card glass-card" whileHover={{ y: -2 }}>
      <div className="goal-header">
        <h3>{goal.title}</h3>
        <span className="goal-type">{goal.type}</span>
      </div>
      <p className="goal-desc">{goal.description}</p>
      <div className="goal-progress-bar">
        <div className="goal-progress-fill" style={{ width: `${goal.progress}%`, background: goal.color }} />
      </div>
      <span className="goal-progress-label">{goal.progress}% complete</span>
      {goal.deadline && <p className="goal-deadline">Due: {new Date(goal.deadline).toLocaleDateString()}</p>}
      {goal.milestones?.length > 0 && (
        <ul className="goal-milestones">
          {goal.milestones.map((m, i) => (
            <li key={i}>
              <button type="button" className={`milestone-btn ${m.completed ? 'done' : ''}`} onClick={() => onToggleMilestone(goal._id, i)}>
                {m.completed ? '✓' : '○'} {m.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="goal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(goal)}>Edit</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(goal._id)}>Delete</button>
      </div>
    </motion.div>
  );
}
