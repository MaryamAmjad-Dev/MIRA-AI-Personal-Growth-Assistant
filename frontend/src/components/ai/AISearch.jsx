import { useState } from 'react';
import { aiSearch } from '../../api/ai';
import { useToast } from '../../context/ToastContext';
import AiCard from '../ui/AiCard';

export default function AISearch() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const data = await aiSearch(query.trim());
      setResults(data || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AiCard title="🔍 AI Journal Search" className="ai-search animate-in" as="div">
      <form onSubmit={handleSearch} className="ai-search-form">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "days I felt stressed because of work"'
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {results.length > 0 && (
        <div className="ai-search-results">
          {results.map((r) => (
            <div key={r._id} className="ai-search-result">
              <span>{r.emoji || r.mood?.emoji}</span>
              <div>
                <p>{r.text?.slice(0, 150)}{r.text?.length > 150 ? '...' : ''}</p>
                <small>{new Date(r.createdAt).toLocaleDateString()} · {r.relevance}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </AiCard>
  );
}
