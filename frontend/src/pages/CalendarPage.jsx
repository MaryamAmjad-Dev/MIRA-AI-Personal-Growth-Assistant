import PageHeader from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import CalendarDashboard from '../components/calendar/CalendarDashboard';

export default function CalendarPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <PageHeader title={t('calendar.title')} subtitle={t('calendar.subtitle')} />
      <CalendarDashboard />
    </div>
  );
}
