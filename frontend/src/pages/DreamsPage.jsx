import PageHeader from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import DreamJournal from '../components/intelligence/DreamJournal';

export default function DreamsPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <PageHeader title={t('intelligence.dreamsTitle')} subtitle={t('intelligence.dreamsSubtitle')} />
      <DreamJournal />
    </div>
  );
}
