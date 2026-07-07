import { useState } from 'react';
import { HABIT_CATEGORIES } from '../../constants/routes';

export default function HabitForm({ onSave, onClose, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [icon, setIcon] = useState(initial?.icon || '✅');
  const [category, setCategory] = useState(initial?.category || 'health');
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime || '');
  const [color, setColor] = useState(initial?.color || '#818cf8');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, icon, category, reminderTime, color, frequency: 'daily', target: 1 });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? 'Edit Habit' : 'New Habit'}</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <input className="input" placeholder="Habit title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" placeholder="Icon emoji" value={icon} onChange={(e) => setIcon(e.target.value)} />
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {HABIT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <input className="input" type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
          <input className="input" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
