import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';

export default function HabitCard({ habit, onComplete, onEdit, onDelete }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isDone = habit.completedDates?.includes(today);

  const heatmap = Array.from({ length: 28 }).map((_, i) => {
    const d = format(subDays(new Date(), 27 - i), 'yyyy-MM-dd');
    return habit.completedDates?.includes(d);
  });

  return (
    <motion.div className="habit-card glass-card" layout whileHover={{ y: -2 }}>
      <div className="habit-card-header">
        <span className="habit-icon" style={{ background: `${habit.color}25` }}>{habit.icon}</span>
        <div>
          <h3>{habit.title}</h3>
          <p>{habit.category} · 🔥 {habit.streak || 0} day streak</p>
        </div>
        <span className="habit-rate">{habit.completionRate || 0}%</span>
      </div>
      <div className="habit-heatmap">
        {heatmap.map((done, i) => (
          <span key={i} className={`heat-cell ${done ? 'done' : ''}`} style={done ? { background: habit.color } : {}} />
        ))}
      </div>
      {habit.reminderTime && <p className="habit-reminder">⏰ Reminder: {habit.reminderTime}</p>}
      <div className="habit-actions">
        <button type="button" className={`btn btn-sm ${isDone ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onComplete(habit._id)}>
          {isDone ? '✓ Done Today' : 'Mark Complete'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(habit)}>Edit</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(habit._id)}>Delete</button>
      </div>
    </motion.div>
  );
}
