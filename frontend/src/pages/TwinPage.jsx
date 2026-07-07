import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import { fetchDigitalTwin, fetchPersonalityEvolution, fetchFutureSelf, syncDigitalTwin } from '../api/intelligence';
import DigitalTwinChat from '../components/intelligence/DigitalTwinChat';
import PersonalityEvolution from '../components/intelligence/PersonalityEvolution';
import FutureSelf from '../components/intelligence/FutureSelf';
import PatternPanel from '../components/intelligence/PatternPanel';
import { fetchPatterns } from '../api/intelligence';
import Button from '../components/ui/Button';

export default function TwinPage() {
  const { t } = useTranslation();
  const [twin, setTwin] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [future, setFuture] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      fetchDigitalTwin(),
      fetchPersonalityEvolution(),
      fetchFutureSelf(),
      fetchPatterns(),
    ]).then(([t, e, f, p]) => {
      setTwin(t);
      setEvolution(e);
      setFuture(f);
      setPatterns(p.patterns || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resync = async () => {
    await syncDigitalTwin();
    load();
  };

  if (loading) return <div className="page"><PageHeader title={t('intelligence.twinTitle')} subtitle={t('common.loading')} /></div>;

  return (
    <div className="page intelligence-page">
      <PageHeader
        title={t('intelligence.twinTitle')}
        subtitle={t('intelligence.twinSubtitle')}
        action={<Button variant="ghost" onClick={resync}>{t('intelligence.syncTwin')}</Button>}
      />
      <div className="intel-grid">
        <div className="intel-main">
          <DigitalTwinChat twin={twin} />
          <FutureSelf data={future} />
        </div>
        <div className="intel-side">
          <PersonalityEvolution evolution={evolution} />
          <PatternPanel patterns={patterns} />
          {twin && (
            <div className="intel-card twin-profile ai-card">
              <h4 className="ai-card-section-title">{t('intelligence.twinProfile')}</h4>
              <p className="ai-card-content"><strong>{t('intelligence.strengths')}:</strong> {twin.strengths?.join(', ')}</p>
              <p className="ai-card-content"><strong>{t('intelligence.values')}:</strong> {twin.lifeValues?.join(', ')}</p>
              <p className="ai-card-content"><strong>{t('intelligence.patterns')}:</strong> {twin.repeatedPatterns?.join('; ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
