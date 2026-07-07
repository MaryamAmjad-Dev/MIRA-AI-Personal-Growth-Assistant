import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function EmotionalDNA({ data }) {
  if (!data?.radar) return null;

  return (
    <div className="intel-card emotional-dna">
      <h3>Emotional DNA</h3>
      <p className="intel-sub">Your unique emotional fingerprint</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data.radar}>
          <PolarGrid stroke="var(--glass-border)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="dna-stats">
        <span>Stability: {data.fingerprint.emotionalStability}%</span>
        <span>Positivity: {data.fingerprint.positivityRatio}%</span>
        <span>Recovery: {data.fingerprint.recoverySpeed}%</span>
      </div>
      {data.fingerprint.triggers?.length > 0 && (
        <div className="dna-triggers">
          {data.fingerprint.triggers.map((t) => <span key={t} className="intel-chip">{t}</span>)}
        </div>
      )}
    </div>
  );
}
