import { useEffect, useState } from 'react';
import { fetchGoalInsights } from '../../api/ai';
import Card from '../ui/Card';

export default function GoalCoach() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchGoalInsights().then(setInsights).catch(() => {});
  }, []);

  if (!insights?.breakdowns?.length) return null;

  return (
    <Card className="ai-coach-card animate-in">
      <h3>🏆 AI Goal Coach</h3>
      {insights.breakdowns.map((g) => (
        <div key={g.title} className="goal-coach-item">
          <div className="goal-coach-header">
            <strong>{g.title}</strong>
            <span className="goal-chance">{g.completionChance}% likely</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${g.progress}%` }} /></div>
          {g.nextSteps?.length > 0 && (
            <ul>{g.nextSteps.map((s) => <li key={s}>{s}</li>)}</ul>
          )}
        </div>
      ))}
    </Card>
  );
}
