import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchDashboardInsights } from '../../api/ai';
import Card from '../ui/Card';
import AnimatedCounter from '../ui/AnimatedCounter';

const WEATHER = { positive: '☀️ Sunny', neutral: '⛅ Cloudy', negative: '🌧️ Stormy' };

const WIDGETS = [
  { key: 'insight', icon: '💡', title: "Today's Insight", field: 'todayInsight' },
  { key: 'weather', icon: '🌤️', title: 'Emotional Weather', field: 'emotionalWeather', isWeather: true },
  { key: 'score', icon: '💚', title: 'Wellness Score', field: 'wellnessScore', isScore: true },
  { key: 'forecast', icon: '🔮', title: 'Mood Forecast', field: 'moodForecast', isForecast: true },
  { key: 'habit', icon: '✅', title: 'Habit Tip', field: 'habitRecommendation' },
];

const GRADIENTS = ['rose', 'violet', 'sky', 'mint', 'cream'];

export default function AIWidgets() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchDashboardInsights().then(setInsights).catch(() => {});
  }, []);

  if (!insights) return null;

  const renderContent = (w) => {
    if (w.isWeather) return WEATHER[insights.emotionalWeather] || insights.emotionalWeather;
    if (w.isScore) return <span className="ai-score"><AnimatedCounter value={insights.wellnessScore} />/100</span>;
    if (w.isForecast) return `${insights.moodForecast?.predictedMood} (${insights.moodForecast?.confidence}%)`;
    return insights[w.field];
  };

  return (
    <div className="ai-widgets-grid">
      {WIDGETS.map((w, i) => (
        <motion.div
          key={w.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
        >
          <Card className={`ai-card ai-widget ai-widget-${GRADIENTS[i]}`}>
            <span className="ai-widget-icon">{w.icon}</span>
            <h4 className="ai-card-section-title">{w.title}</h4>
            <p className="ai-card-content">{renderContent(w)}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
