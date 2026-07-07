import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchLifeScore,
  fetchEmotionalDNA,
  fetchBurnout,
  fetchPatterns,
  fetchSmartNotifications,
} from '../../api/intelligence';
import { ROUTES } from '../../constants/routes';
import LifeScoreRing from './LifeScoreRing';
import EmotionalDNA from './EmotionalDNA';
import BurnoutMonitor from './BurnoutMonitor';
import MoodMusic from './MoodMusic';
import PatternPanel from './PatternPanel';

export default function IntelligenceWidgets({ sectionTitle = 'Growth Score' }) {
  const { t } = useTranslation();
  const [lifeScore, setLifeScore] = useState(null);
  const [emotionalDNA, setEmotionalDNA] = useState(null);
  const [burnout, setBurnout] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [smartNotifs, setSmartNotifs] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchLifeScore().then(setLifeScore).catch(() => {}),
      fetchEmotionalDNA().then(setEmotionalDNA).catch(() => {}),
      fetchBurnout().then(setBurnout).catch(() => {}),
      fetchPatterns().then((p) => setPatterns(p.patterns || [])).catch(() => {}),
      fetchSmartNotifications().then((data) => setSmartNotifs(data.notifications || [])).catch(() => {}),
    ]);
  }, []);

  const topNotif = smartNotifs.sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return (rank[a.priority] ?? 2) - (rank[b.priority] ?? 2);
  })[0];

  return (
    <section className="intelligence-dashboard">
      <div className="intel-section-header dashboard-section-header">
        <h2>{sectionTitle}</h2>
        <Link to={ROUTES.TWIN} className="link-btn">{t('dashboard.digitalTwin')}</Link>
      </div>

      {topNotif?.message && (
        <div className="smart-notif-banner animate-in">
          <span>🤖</span>
          <p>{topNotif.message}</p>
          {topNotif.action && (
            <Link to={topNotif.action} className="btn btn-ghost btn-sm">Go</Link>
          )}
        </div>
      )}

      <div className="intel-dashboard-grid">
        <LifeScoreRing score={lifeScore} />
        <BurnoutMonitor burnout={burnout} />
        <EmotionalDNA data={emotionalDNA} />
        <MoodMusic />
      </div>

      {patterns.length > 0 && <PatternPanel patterns={patterns.slice(0, 3)} />}

      <div className="intel-quick-links">
        <Link to={ROUTES.DECISION} className="intel-quick-link">⚖️ Decision Room</Link>
        <Link to={ROUTES.TIMELINE} className="intel-quick-link">📜 Life Timeline</Link>
        <Link to={ROUTES.VAULT} className="intel-quick-link">🔐 Private Vault</Link>
        <Link to={ROUTES.DREAMS} className="intel-quick-link">🌙 Dream Journal</Link>
      </div>
    </section>
  );
}
