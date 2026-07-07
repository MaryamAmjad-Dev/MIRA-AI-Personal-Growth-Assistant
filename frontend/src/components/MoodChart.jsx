import { buildWeeklyChartData } from '../utils/dateUtils';

export default function MoodChart({ weeklyOverview, loading }) {
  const chartData = buildWeeklyChartData(weeklyOverview || []);
  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  if (loading) {
    return (
      <div className="mood-chart glass-card">
        <h3>Weekly Mood Overview</h3>
        <div className="chart-bars skeleton-chart" />
      </div>
    );
  }

  return (
    <div className="mood-chart glass-card animate-in">
      <h3>Weekly Mood Overview</h3>
      <div className="chart-bars" role="img" aria-label="Weekly mood overview chart">
        {chartData.map((day) => (
          <div key={day.date} className="chart-bar-group">
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{ height: `${(day.total / maxTotal) * 100}%` }}
                title={`${day.total} entries`}
              >
                {day.topMood && day.total > 0 && (
                  <span className="chart-bar-emoji">{day.topMood}</span>
                )}
              </div>
            </div>
            <span className="chart-bar-label">{day.label}</span>
            <span className="chart-bar-count">{day.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
