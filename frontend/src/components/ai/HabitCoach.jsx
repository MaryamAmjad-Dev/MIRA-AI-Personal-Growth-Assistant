import { useEffect, useState } from 'react';
import { fetchHabitInsights } from '../../api/ai';
import Card from '../ui/Card';

export default function HabitCoach() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchHabitInsights().then(setInsights).catch(() => {});
  }, []);

  if (!insights) return null;

  return (
    <Card className="ai-coach-card animate-in">
      <h3>🎯 AI Habit Coach</h3>
      {insights.recommendations?.length > 0 && (
        <div className="coach-section">
          <h4>Recommendations</h4>
          <ul>{insights.recommendations.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )}
      {insights.failingHabits?.length > 0 && (
        <div className="coach-section">
          <h4>Needs Attention</h4>
          {insights.failingHabits.map((h) => (
            <div key={h.title} className="coach-item">
              <strong>{h.title}</strong> ({h.completionRate}%)
              <p>{h.suggestion}</p>
            </div>
          ))}
        </div>
      )}
      {insights.strongHabits?.length > 0 && (
        <div className="coach-section">
          <h4>Strong Streaks</h4>
          <ul>{insights.strongHabits.map((h) => <li key={h.title}>{h.title} — {h.streak} days 🔥</li>)}</ul>
        </div>
      )}
    </Card>
  );
}
