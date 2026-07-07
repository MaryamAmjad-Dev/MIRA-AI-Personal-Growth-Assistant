import { MOOD_CATEGORIES } from '../constants/moods';

export default function MoodCategoryTabs({ active, onChange }) {
  return (
    <div className="mood-category-tabs">
      <button type="button" className={`mcat-tab ${active === 'all' ? 'active' : ''}`} onClick={() => onChange('all')}>
        All
      </button>
      {Object.entries(MOOD_CATEGORIES).map(([key, cat]) => (
        <button
          key={key}
          type="button"
          className={`mcat-tab ${active === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
          style={active === key ? { borderColor: cat.color } : {}}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  );
}
