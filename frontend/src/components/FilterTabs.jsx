import { MOOD_LIBRARY } from '../constants/moods';
import MoodCategoryTabs from './MoodCategoryTabs';
import { useState } from 'react';

export default function FilterTabs({ activeFilter, onFilterChange }) {
  const [category, setCategory] = useState('all');
  const moods = MOOD_LIBRARY.filter((m) => category === 'all' || m.category === category);

  return (
    <div className="filter-tabs-wrap">
      <MoodCategoryTabs active={category} onChange={setCategory} />
      <div className="filter-tabs" role="tablist">
        <button type="button" className={`filter-tab ${activeFilter === '' ? 'active' : ''}`} onClick={() => onFilterChange('')}>All</button>
        {moods.slice(0, 12).map((m) => (
          <button
            key={m.name}
            type="button"
            className={`filter-tab ${activeFilter === m.emoji ? 'active' : ''}`}
            onClick={() => onFilterChange(m.emoji)}
            title={m.name}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
