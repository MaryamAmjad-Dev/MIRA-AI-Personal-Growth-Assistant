import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function FutureSelf({ data }) {
  if (!data) return null;

  const chartData = data.currentPath.map((c, i) => ({
    label: c.label,
    current: c.wellness,
    improved: data.improvedPath[i]?.wellness,
  }));

  return (
    <article className="ai-card intel-card future-self">
      <h3 className="ai-card-title">Future Self Simulation</h3>
      <p className="ai-card-content intel-sub">{data.horizon} projection</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
          <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
          <Legend />
          <Line type="monotone" dataKey="current" stroke="#94a3b8" strokeWidth={2} name="Current Path" dot={false} />
          <Line type="monotone" dataKey="improved" stroke="#6366f1" strokeWidth={2} name="Improved Path" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="future-narratives">
        <div className="future-path current ai-card ai-card-nested">
          <h4 className="ai-card-section-title">Current Path</h4>
          <p className="ai-card-content">{data.currentSummary}</p>
        </div>
        <div className="future-path improved ai-card ai-card-nested">
          <h4 className="ai-card-section-title">Improved Path</h4>
          <p className="ai-card-content">{data.improvedSummary}</p>
        </div>
      </div>
    </article>
  );
}
