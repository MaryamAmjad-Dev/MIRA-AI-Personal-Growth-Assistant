import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { EntryListSkeleton } from '../Loader';

export default function HabitDashboard({ habits, loading, onComplete, onSave, onDelete, showForm, setShowForm, editing, setEditing }) {
  const doneToday = habits.filter((h) => h.completedDates?.includes(new Date().toISOString().split('T')[0])).length;
  const pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;

  return (
    <div className="habit-dashboard">
      <div className="habit-stats-row">
        <div className="stat-card glass-card"><span className="stat-value">{habits.length}</span><span className="stat-label">Total Habits</span></div>
        <div className="stat-card glass-card"><span className="stat-value">{doneToday}/{habits.length}</span><span className="stat-label">Today</span></div>
        <div className="stat-card glass-card"><span className="stat-value">{pct}%</span><span className="stat-label">Daily Progress</span></div>
      </div>

      <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Habit</button>

      {loading ? <EntryListSkeleton count={3} /> : (
        <div className="habits-grid">
          {habits.map((h) => (
            <HabitCard key={h._id} habit={h} onComplete={onComplete} onEdit={setEditing} onDelete={onDelete} />
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <HabitForm
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={(data) => onSave(data, editing?._id)}
        />
      )}
    </div>
  );
}
