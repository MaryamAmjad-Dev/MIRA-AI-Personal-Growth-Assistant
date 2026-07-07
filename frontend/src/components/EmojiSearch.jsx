export default function EmojiSearch({ value, onChange }) {
  return (
    <div className="emoji-search">
      <span aria-hidden="true">🔍</span>
      <input
        type="search"
        placeholder="Search moods..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search moods"
      />
    </div>
  );
}
