import Card from '../ui/Card';

export default function AIAnalysisCard({ analysis }) {
  if (!analysis?.summary && !analysis?.sentiment) return null;

  return (
    <Card className="ai-analysis-card animate-in">
      <div className="ai-analysis-header">
        <span className="ai-badge">AI Analysis</span>
        <span className={`sentiment-badge sentiment-${analysis.sentiment}`}>{analysis.sentiment}</span>
      </div>
      <p className="ai-analysis-summary">{analysis.summary}</p>
      <div className="ai-analysis-scores">
        {analysis.stressScore != null && <span>Stress: {analysis.stressScore}/10</span>}
        {analysis.energyScore != null && <span>Energy: {analysis.energyScore}/10</span>}
        {analysis.positivityScore != null && <span>Positivity: {analysis.positivityScore}%</span>}
      </div>
      {analysis.emotions?.length > 0 && (
        <div className="ai-tags">
          {analysis.emotions.map((e) => <span key={e} className="ai-tag">{e}</span>)}
        </div>
      )}
      {analysis.suggestions?.length > 0 && (
        <ul className="ai-suggestions-list">
          {analysis.suggestions.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
    </Card>
  );
}
