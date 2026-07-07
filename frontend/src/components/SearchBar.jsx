export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="search"
        className="search-input"
        placeholder="Search journal entries..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search journal entries"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
