import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createHabit, deleteHabit, fetchHabits, updateHabit, completeHabit } from '../api/habits';
import HabitCoach from '../components/ai/HabitCoach';
import PageHeader from '../components/layout/PageHeader';
import HabitDashboard from '../components/habits/HabitDashboard';
import { useToast } from '../context/ToastContext';

export default function HabitsPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => fetchHabits().then(setHabits).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSave = async (data, id) => {
    try {
      if (id) await updateHabit(id, data);
      else await createHabit(data);
      addToast(t('habits.saved'));
      load();
    } catch (e) { addToast(e.message, 'error'); }
  };

  return (
    <div className="page">
      <PageHeader title={t('habits.title')} subtitle={t('habits.subtitle')} />
      <HabitCoach />
      <HabitDashboard
        habits={habits}
        loading={loading}
        onComplete={(id) => completeHabit(id).then(load)}
        onSave={handleSave}
        onDelete={(id) => deleteHabit(id).then(load)}
        showForm={showForm}
        setShowForm={setShowForm}
        editing={editing}
        setEditing={setEditing}
      />
    </div>
  );
}
