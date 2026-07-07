import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from './ui/AnimatedCounter';

export default function StatsCards({ stats, loading }) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card card-3d glass-card skeleton-stat" />
        ))}
      </div>
    );
  }

  const weekTotal = stats?.weeklyOverview?.reduce((sum, w) => sum + w.count, 0) ?? 0;

  const CARDS = [
    { variant: 'rose', label: t('dashboard.totalEntries') },
    { variant: 'violet', label: t('dashboard.mostSelectedMood') },
    { variant: 'sky', label: t('dashboard.dayStreak') },
    { variant: 'mint', label: t('dashboard.thisWeek') },
  ];
  const values = [
    stats?.totalEntries ?? 0,
    stats?.mostSelectedMood?.count ?? 0,
    stats?.streak ?? 0,
    weekTotal,
  ];
  const icons = ['📔', stats?.mostSelectedMood?.emoji ?? '—', '🔥', '📅'];

  return (
    <div className="stats-grid">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.variant}
          className={`stat-card card-3d glass-card stat-gradient-${card.variant}`}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="stat-icon-wrap">{icons[i]}</div>
          <div>
            <p className="stat-value">
              {i === 1 && stats?.mostSelectedMood?.emoji ? (
                <span>{stats.mostSelectedMood.emoji} <AnimatedCounter value={values[i]} /></span>
              ) : (
                <AnimatedCounter value={values[i]} />
              )}
            </p>
            <p className="stat-label">{card.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
