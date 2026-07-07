import StatsCards from '../components/StatsCards';
import MoodChart from '../components/MoodChart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useStats } from '../hooks/useStats';
import { useJournal } from '../hooks/useJournal';
import AIWidgets from '../components/ai/AIWidgets';
import IntelligenceWidgets from '../components/intelligence/IntelligenceWidgets';
import BrandLogo from '../components/brand/BrandLogo';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTranslation } from 'react-i18next';
import { useBrandVariant } from '../hooks/useBrandVariant';

export default function DashboardPage() {
  const { t } = useTranslation();
  const brandVariant = useBrandVariant();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useStats();
  const { entries } = useJournal({});
  const recentEntries = entries.slice(0, 3);

  return (
    <div className="page dashboard-page">
      <div className="dashboard-welcome animate-in">
        <BrandLogo variant={brandVariant} />
        <p>{t('brand.tagline')} · {t('brand.craftedWith')}</p>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>{t('dashboard.habitFlow')}</h2>
        </div>
        <StatsCards stats={stats} loading={statsLoading} />
      </section>

      <section className="dashboard-section">
        <IntelligenceWidgets sectionTitle={t('dashboard.growthScore')} />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>{t('dashboard.aiInsights')}</h2>
        </div>
        <AIWidgets />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>{t('dashboard.reflectionJourney')}</h2>
          <Link to={ROUTES.JOURNAL} className="link-btn">{t('dashboard.journalLink')}</Link>
        </div>
        <MoodChart weeklyOverview={stats?.weeklyOverview} loading={statsLoading} />

        <Card className="recent-entries animate-in">
          <div className="section-header">
            <h3>{t('dashboard.recentEntries')}</h3>
            <Link to={ROUTES.JOURNAL} className="link-btn">{t('dashboard.viewAll')}</Link>
          </div>
          {recentEntries.length === 0 ? (
            <p className="empty-hint">{t('dashboard.noEntries')}</p>
          ) : (
            <div className="recent-list">
              {recentEntries.map((e) => (
                <div key={e._id} className="recent-item">
                  <span>{e.emoji}</span>
                  <p>{e.text.slice(0, 80)}{e.text.length > 80 ? '...' : ''}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>{t('dashboard.futureSelf')}</h2>
        </div>
        <div className="future-self-card glass-card card-3d">
          <div className="future-self-card-body">
            <h3 className="future-self-card-title">{t('dashboard.futureSelfTitle')}</h3>
            <p className="future-self-card-desc">{t('dashboard.futureSelfDesc')}</p>
          </div>
          <Button type="button" className="future-self-card-btn" onClick={() => navigate(ROUTES.TWIN)}>
            {t('dashboard.exploreFuture')}
          </Button>
        </div>
      </section>
    </div>
  );
}
