import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks';
import PageHeader from '../components/layout/PageHeader';
import TaskBoard from '../components/planner/TaskBoard';
import TaskModal from '../components/planner/TaskModal';
import { useToast } from '../context/ToastContext';

export default function PlannerPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);

  const load = () => fetchTasks().then(setTasks);

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal?._id) await updateTask(modal._id, data);
      else await createTask(data);
      addToast(t('planner.saved'));
      setModal(null);
      load();
    } catch (e) { addToast(e.message, 'error'); }
  };

  return (
    <div className="page">
      <PageHeader title={t('planner.title')} subtitle={t('planner.subtitle')} action={
        <button type="button" className="btn btn-primary" onClick={() => setModal({})}>{t('planner.newTask')}</button>
      } />
      <TaskBoard
        tasks={tasks}
        onStatusChange={(id, status) => updateTask(id, { status }).then(load)}
        onEdit={setModal}
        onDelete={(id) => deleteTask(id).then(load)}
      />
      {modal && <TaskModal task={modal._id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
