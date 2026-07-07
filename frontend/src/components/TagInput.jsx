import { TAGS } from '../constants/tags';

export default function TagInput({ selectedTags, onChange }) {
  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="tag-input">
      <p className="field-label">Tags</p>
      <div className="tag-grid">
        {TAGS.map(({ id, label, emoji }) => (
          <button
            key={id}
            type="button"
            className={`tag-btn ${selectedTags.includes(id) ? 'selected' : ''}`}
            onClick={() => toggleTag(id)}
          >
            {emoji} #{id}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TagFilter({ activeTag, onChange }) {
  return (
    <div className="tag-filter">
      <button
        type="button"
        className={`tag-filter-btn ${!activeTag ? 'active' : ''}`}
        onClick={() => onChange('')}
      >
        All tags
      </button>
      {TAGS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`tag-filter-btn ${activeTag === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          #{id}
        </button>
      ))}
    </div>
  );
}
