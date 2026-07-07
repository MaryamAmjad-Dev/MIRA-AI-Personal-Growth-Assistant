import PageHeader from '../components/layout/PageHeader';
import { useTranslation } from 'react-i18next';
import Vault from '../components/intelligence/Vault';

export default function VaultPage() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <PageHeader title={t('intelligence.vaultTitle')} subtitle={t('intelligence.vaultSubtitle')} />
      <Vault />
    </div>
  );
}
