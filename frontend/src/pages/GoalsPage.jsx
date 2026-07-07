import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createGoal, deleteGoal, fetchGoals, toggleMilestone, updateGoal } from '../api/goals';
import GoalCoach from '../components/ai/GoalCoach';
import PageHeader from '../components/layout/PageHeader';
import GoalCard from '../components/goals/GoalCard';
import { useToast } from '../context/ToastContext';

export default function GoalsPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(null);

  const load = () => fetchGoals().then(setGoals);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await createGoal({
      title: fd.get('title'),
      description: fd.get('description'),
      type: fd.get('type'),
      deadline: fd.get('deadline') || null,
      milestones: fd.get('milestones') ? fd.get('milestones').split(',').map((t) => ({ title: t.trim(), completed: false })) : [],
    });
    addToast(t('goals.created'));
    setForm(null);
    load();
  };

  return (
    <div className="page">
      <PageHeader title={t('goals.title')} subtitle={t('goals.subtitle')} action={
        <button type="button" className="btn btn-primary" onClick={() => setForm(true)}>{t('goals.newGoal')}</button>
      } />
      <GoalCoach />
      <div className="goals-grid">
        {goals.map((g) => (
          <GoalCard
            key={g._id}
            goal={g}
            onToggleMilestone={(id, i) => toggleMilestone(id, i).then(load)}
            onEdit={() => {}}
            onDelete={(id) => deleteGoal(id).then(load)}
          />
        ))}
      </div>
      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <form className="modal glass-card settings-form" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
            <h2>New Goal</h2>
            <input className="input" name="title" placeholder="Goal title" required />
            <textarea className="journal-textarea" name="description" placeholder="Description" rows={2} />
            <select className="input" name="type"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
            <input className="input" type="date" name="deadline" />
            <input className="input" name="milestones" placeholder="Milestones (comma separated)" />
            <button type="submit" className="btn btn-primary">Create Goal</button>
          </form>
        </div>
      )}
    </div>
  );
}
