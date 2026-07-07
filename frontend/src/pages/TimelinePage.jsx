import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import LifeTimeline from '../components/intelligence/LifeTimeline';
import { fetchLifeTimeline } from '../api/intelligence';

export default function TimelinePage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchLifeTimeline().then((data) => setEvents(data.events || [])).catch(() => {});
  }, []);

  return (
    <div className="page">
      <PageHeader title={t('intelligence.timelineTitle')} subtitle={t('intelligence.timelineSubtitle')} />
      <LifeTimeline events={events} />
    </div>
  );
}
