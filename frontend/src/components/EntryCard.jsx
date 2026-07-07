import { getMoodFromEntry } from '../constants/moods';
import Badge from './ui/Badge';
import AIAnalysisCard from './ai/AIAnalysisCard';
function IntensityBar({ value }) {
  const color = value <= 3 ? 'var(--danger)' : value <= 6 ? 'var(--warning)' : 'var(--success)';
  return (
    <div className="entry-intensity">
      <div className="entry-intensity-bar"><div className="entry-intensity-fill" style={{ width: `${value * 10}%`, background: color }} /></div>
      <span style={{ color }}>{value}/10</span>
    </div>
  );
}

export default function EntryCard({ entry, onEdit, onDeleteRequest, onFavorite, deleting, readOnly = false }) {
  const mood = getMoodFromEntry(entry);

  return (
    <article className="entry-card glass-card animate-in">
      <div className="entry-header">
        <div className="entry-header-left">
          <span className="entry-emoji" style={{ filter: `drop-shadow(0 0 8px ${mood.color}60)` }}>{mood.emoji}</span>
          <div>
            <span className="mood-name" style={{ color: mood.color }}>{mood.name}</span>
            <IntensityBar value={entry.intensity ?? 5} />
          </div>
        </div>
        <div className="entry-header-right">
          {!readOnly && onFavorite && (
            <button type="button" className={`favorite-btn ${entry.isFavorite ? 'active' : ''}`} onClick={() => onFavorite(entry._id)}>
              {entry.isFavorite ? '★' : '☆'}
            </button>
          )}
          <time className="entry-date" dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
        </div>
      </div>
      {entry.tags?.length > 0 && (
        <div className="entry-tags">{entry.tags.map((tag) => <Badge key={tag} variant="tag">#{tag}</Badge>)}</div>
      )}
      <p className="entry-text">{entry.text}</p>
      <AIAnalysisCard analysis={entry.aiAnalysis} />
      {entry.weather && <p className="entry-meta">🌤️ {entry.weather.condition} {entry.weather.temp}°C</p>}      {!readOnly && (
        <div className="entry-actions">
          {onEdit && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(entry)}>Edit</button>}
          {onDeleteRequest && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDeleteRequest(entry)} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
