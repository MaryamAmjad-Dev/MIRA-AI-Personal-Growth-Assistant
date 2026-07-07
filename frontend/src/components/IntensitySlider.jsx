export default function IntensitySlider({ value, onChange }) {
  const getColor = (v) => {
    if (v <= 3) return 'var(--danger)';
    if (v <= 6) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="intensity-slider">
      <div className="intensity-header">
        <p className="field-label">Mood Intensity</p>
        <span className="intensity-value" style={{ color: getColor(value) }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="intensity-range"
        style={{ '--intensity-color': getColor(value) }}
        aria-label="Mood intensity"
      />
      <div className="intensity-bar">
        <div
          className="intensity-fill"
          style={{ width: `${value * 10}%`, background: getColor(value) }}
        />
      </div>
      <div className="intensity-labels">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
