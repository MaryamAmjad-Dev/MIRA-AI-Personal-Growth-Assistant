import PageHeader from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import DecisionRoom from '../components/intelligence/DecisionRoom';

export default function DecisionPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <PageHeader title={t('intelligence.decisionTitle')} subtitle={t('intelligence.decisionSubtitle')} />
      <DecisionRoom />
    </div>
  );
}
