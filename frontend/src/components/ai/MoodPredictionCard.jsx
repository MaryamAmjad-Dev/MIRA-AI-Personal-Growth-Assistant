import { useEffect, useState } from 'react';
import { fetchMoodPrediction } from '../../api/ai';

const MOOD_EMOJI = { positive: '☀️', neutral: '⛅', negative: '🌧️' };

export default function MoodPredictionCard() {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetchMoodPrediction().then(setPrediction).catch(() => {});
  }, []);

  if (!prediction) return null;

  return (
    <article className="ai-card ai-widget mood-prediction animate-in">
      <div className="ai-widget-header">
        <span className="ai-widget-icon">{MOOD_EMOJI[prediction.predictedMood] || '🔮'}</span>
        <div>
          <h4 className="ai-card-section-title">Mood Forecast</h4>
          <p className="ai-widget-sub">Confidence: {prediction.confidence}%</p>
        </div>
      </div>
      <p className="prediction-mood">Predicted: <strong>{prediction.predictedMood}</strong></p>
      {prediction.reasons?.length > 0 && (
        <ul className="ai-widget-list">{prediction.reasons.slice(0, 2).map((r) => <li key={r}>{r}</li>)}</ul>
      )}
      {prediction.suggestions?.[0] && <p className="ai-card-content ai-widget-tip">💡 {prediction.suggestions[0]}</p>}
    </article>
  );
}
