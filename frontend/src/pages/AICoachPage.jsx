import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import { fetchAiSummary, fetchAiRecommendations, explainMood } from '../api/ai';
import Card from '../components/ui/Card';
import AiCard from '../components/ui/AiCard';
import AIChat from '../components/ai/AIChat';
import MoodPredictionCard from '../components/ai/MoodPredictionCard';
import AISearch from '../components/ai/AISearch';
import { useToast } from '../context/ToastContext';

export default function AICoachPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [recs, setRecs] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAiSummary(), fetchAiRecommendations()])
      .then(([s, r]) => { setSummary(s); setRecs(r); })
      .finally(() => setLoading(false));
  }, []);

  const handleExplain = async () => {
    try {
      const res = await explainMood();
      setExplanation(res);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page"><PageHeader title={t('ai.coachTitle')} subtitle={t('common.loading')} /></div>;

  const listSection = (title, items, icon) => (
    <AiCard title={icon ? `${icon} ${title}` : title} className="animate-in">
      <ul className="ai-card-list">
        {(items || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </AiCard>
  );

  return (
    <div className="page ai-coach-page">
      <PageHeader title={t('ai.coachTitle')} subtitle={t('ai.coachSubtitle')} />

      <div className="ai-coach-layout">
        <div className="ai-coach-main">
          <Card className="ai-chat-card glass-card animate-in">
            <AIChat />
          </Card>
        </div>

        <div className="ai-coach-sidebar">
          <MoodPredictionCard />

          <AiCard title={t('ai.weeklySummary')} className="animate-in">
            <p className="ai-card-content">{summary?.weeklySummary || '—'}</p>
            <button type="button" className="btn btn-ghost btn-sm ai-card-action" onClick={handleExplain}>
              {t('ai.whyFeeling')}
            </button>
            {explanation?.explanation && (
              <p className="ai-card-content ai-response">{explanation.explanation}</p>
            )}
          </AiCard>

          {listSection(t('ai.reflections'), recs?.reflections, '✨')}

          <div className="coach-grid">
            {listSection(t('ai.habits'), recs?.habits)}
            {listSection(t('ai.productivity'), recs?.productivity)}
            {listSection(t('ai.growth'), recs?.growth)}
          </div>

          <AISearch />
        </div>
      </div>
    </div>
  );
}
