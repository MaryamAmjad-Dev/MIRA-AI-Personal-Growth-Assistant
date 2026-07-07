import { useState } from 'react';

export default function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [category, setCategory] = useState(task?.category || 'general');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, priority, status, dueDate: dueDate || null, category });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
