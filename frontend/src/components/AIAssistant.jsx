import { useState } from 'react';
import { analyzeEntry } from '../api/ai';
import { useToast } from '../context/ToastContext';
import { AI_NAME } from '../constants/branding';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

export default function AIAssistant({ text, emoji, mood, intensity }) {
  const moodEmoji = mood?.emoji || emoji;
  const { addToast } = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text?.trim()) {
      addToast('Write some journal text first', 'error');
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeEntry({ text, emoji: moodEmoji, mood, intensity });
      setAnalysis(result);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="ai-assistant animate-in">
      <div className="ai-header">
        <div>
          <h3>{AI_NAME} Assistant</h3>
          <p>Get sentiment insights and supportive suggestions</p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading || !text?.trim()}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {!analysis && !loading && (
        <p className="ai-placeholder">
          Write a journal entry and click Analyze for personalized mood insights.
        </p>
      )}

      {loading && <div className="ai-loading skeleton-line skeleton-line-lg" />}

      {analysis && (
        <div className="ai-results animate-in">
          <div className="ai-sentiment">
            <Badge variant={analysis.sentiment}>{analysis.sentiment}</Badge>
            {analysis.source && (
              <Badge variant="default">{analysis.source === 'ai' ? 'AI powered' : 'Local analysis'}</Badge>
            )}
          </div>
          <p className="ai-response">{analysis.response}</p>
          {analysis.activities?.length > 0 && (
            <div className="ai-section">
              <h4>Suggested Activities</h4>
              <ul>
                {analysis.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.insights?.length > 0 && (
            <div className="ai-section">
              <h4>Insights</h4>
              <ul>
                {analysis.insights.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
