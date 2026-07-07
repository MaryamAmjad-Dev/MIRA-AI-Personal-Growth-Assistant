import { useState } from 'react';
import { generatePersonalityReport, downloadPersonalityReport } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import AiCard from '../ui/AiCard';

export default function PersonalityReportPanel() {
  const { addToast } = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generatePersonalityReport();
      setReport(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await downloadPersonalityReport();
      addToast('Personality report downloaded!');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const renderList = (items) => (
    <ul className="ai-card-list">
      {(Array.isArray(items) ? items : [items]).filter(Boolean).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  return (
    <AiCard title="AI Personality Report" className="personality-report-panel animate-in">
      <p className="ai-card-content intel-sub">Monthly insight — who you became this month</p>
      <div className="reports-actions">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Personality Report'}
        </Button>
        {report && <Button variant="ghost" onClick={handleExport}>Export PDF/HTML</Button>}
      </div>
      {report && (
        <div className="report-content ai-text">
          {report.whoYouBecame && <p className="report-highlight ai-card-content">{report.whoYouBecame}</p>}
          <section className="ai-report-section">
            <h4 className="ai-card-section-title">Personality Changes</h4>
            {renderList(report.personalityChanges)}
          </section>
          <section className="ai-report-section">
            <h4 className="ai-card-section-title">Emotional Growth</h4>
            {renderList(report.emotionalGrowth)}
          </section>
          <section className="ai-report-section">
            <h4 className="ai-card-section-title">Achievements</h4>
            {renderList(report.achievements)}
          </section>
          <section className="ai-report-section">
            <h4 className="ai-card-section-title">Struggles</h4>
            {renderList(report.struggles)}
          </section>
        </div>
      )}
    </AiCard>
  );
}
