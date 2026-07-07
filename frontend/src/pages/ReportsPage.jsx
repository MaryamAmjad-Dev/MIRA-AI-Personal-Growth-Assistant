import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import AiCard from '../components/ui/AiCard';
import Button from '../components/ui/Button';
import { generateReport, downloadReport } from '../api/ai';
import PersonalityReportPanel from '../components/intelligence/PersonalityReportPanel';
import { useToast } from '../context/ToastContext';

export default function ReportsPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [period, setPeriod] = useState('weekly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generateReport(period);
      setReport(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await downloadReport(period);
      addToast(t('reports.download'));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page reports-page">
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />

      <AiCard className="reports-controls animate-in" as="div">
        <div className="reports-controls-row">
          <div className="reports-period">
            <button type="button" className={`btn ${period === 'weekly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('weekly')}>{t('reports.weekly')}</button>
            <button type="button" className={`btn ${period === 'monthly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('monthly')}>{t('reports.monthly')}</button>
          </div>
          <div className="reports-actions">
            <Button onClick={handleGenerate} disabled={loading}>{loading ? t('reports.generating') : t('reports.generate')}</Button>
            {report && <Button variant="ghost" onClick={handleExport}>{t('reports.download')}</Button>}
          </div>
        </div>
      </AiCard>

      {report && (
        <AiCard title={report.title || t('reports.title')} className="report-preview animate-in">
          <div className="report-body ai-text" dangerouslySetInnerHTML={{ __html: report.html || report.summary || '' }} />
        </AiCard>
      )}

      <PersonalityReportPanel />
    </div>
  );
}
