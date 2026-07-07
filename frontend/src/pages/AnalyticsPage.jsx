import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import { useStats } from '../hooks/useStats';
import { fetchAdvancedAnalytics } from '../api/coach';
import Card from '../components/ui/Card';
import { EntryListSkeleton } from '../components/Loader';

const RATIO_COLORS = ['#34d399', '#f87171', '#94a3b8'];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { stats, loading } = useStats();
  const [advanced, setAdvanced] = useState(null);

  useEffect(() => {
    fetchAdvancedAnalytics().then(setAdvanced).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="page">
        <PageHeader title={t('analytics.title')} subtitle={t('analytics.subtitle')} />
        <EntryListSkeleton count={3} />
      </div>
    );
  }

  const moodFrequency = stats?.moodCounts?.map((m) => ({ name: m.emoji, count: m.count })) || [];

  const weeklyTrends = (() => {
    const map = {};
    stats?.weeklyOverview?.forEach((w) => {
      if (!map[w.date]) map[w.date] = { date: w.date, count: 0, intensity: 0, n: 0 };
      map[w.date].count += w.count;
      map[w.date].intensity += w.avgIntensity || 0;
      map[w.date].n += 1;
    });
    return Object.values(map).map((d) => ({
      date: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
      entries: d.count,
      intensity: d.n ? Math.round((d.intensity / d.n) * 10) / 10 : 0,
    }));
  })();

  const monthlyHistory =
    stats?.monthlyOverview?.map((m) => ({
      date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      entries: m.count,
      intensity: m.avgIntensity,
    })) || [];

  const ratioData = stats?.moodRatio
    ? [
        { name: t('analytics.positive'), value: stats.moodRatio.positive },
        { name: t('analytics.negative'), value: stats.moodRatio.negative },
        { name: t('analytics.neutral'), value: stats.moodRatio.neutral },
      ]
    : [];

  return (
    <div className="page analytics-page">
      <PageHeader title={t('analytics.title')} subtitle={t('analytics.subtitle')} />

      <div className="analytics-stats-row">
        <Card className="ai-card analytics-stat animate-in">
          <span className="analytics-stat-label">{t('analytics.longestStreak')}</span>
          <span className="analytics-stat-value">{stats?.longestStreak ?? 0} {t('common.days')}</span>
        </Card>
        <Card className="ai-card analytics-stat animate-in">
          <span className="analytics-stat-label">{t('analytics.currentStreak')}</span>
          <span className="analytics-stat-value">{stats?.streak ?? 0} {t('common.days')}</span>
        </Card>
        <Card className="ai-card analytics-stat animate-in">
          <span className="analytics-stat-label">{t('analytics.avgMoodScore')}</span>
          <span className="analytics-stat-value">{stats?.averageIntensity ?? 0}/10</span>
        </Card>
      </div>

      <div className="analytics-grid">
        <Card className="ai-card chart-card animate-in">
          <h3 className="ai-card-title">{t('analytics.moodFrequency')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={moodFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="ai-card chart-card animate-in">
          <h3 className="ai-card-title">{t('analytics.weeklyTrends')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
              <Line type="monotone" dataKey="entries" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="intensity" stroke="var(--success)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="ai-card chart-card animate-in">
          <h3 className="ai-card-title">{t('analytics.monthlyHistory')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
              <Bar dataKey="entries" fill="var(--gradient-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="ai-card chart-card animate-in">
          <h3 className="ai-card-title">{t('analytics.positiveNegativeRatio')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={ratioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {ratioData.map((_, i) => (
                  <Cell key={i} fill={RATIO_COLORS[i % RATIO_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {advanced && (
          <>
            <Card className="ai-card chart-card animate-in">
              <h3 className="ai-card-title">{t('analytics.yearlyMood')}</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={advanced.yearlyMood}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="#34d399" fill="#34d39940" />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="#f87171" fill="#f8717140" />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#94a3b8" fill="#94a3b840" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="ai-card chart-card animate-in">
              <h3 className="ai-card-title">{t('analytics.habitSuccessRate')}: {advanced.habitSuccessRate}%</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={advanced.moodVsHabits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="habit" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="ai-card chart-card animate-in">
              <h3 className="ai-card-title">{t('analytics.productivityScore')}: {advanced.productivityScore}%</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={advanced.emotionalTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="intensity" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
