import { useEffect, useState } from 'react';
import { createDream, fetchDreams, fetchDreamPatterns } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

export default function DreamJournal() {
  const { addToast } = useToast();
  const [dreams, setDreams] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [dream, setDream] = useState('');
  const [emotions, setEmotions] = useState('');
  const [symbols, setSymbols] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetchDreams().then(setDreams).catch(() => {});
    fetchDreamPatterns().then(setPatterns).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createDream({
        dream,
        emotions: emotions.split(',').map((s) => s.trim()).filter(Boolean),
        symbols: symbols.split(',').map((s) => s.trim()).filter(Boolean),
      });
      addToast('Dream logged and analyzed');
      setDream('');
      setEmotions('');
      setSymbols('');
      load();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dream-journal">
      <div className="intel-card">
        <h3>🌙 Dream Journal</h3>
        <form onSubmit={submit} className="dream-form">
          <textarea className="journal-textarea" placeholder="Describe your dream..." value={dream} onChange={(e) => setDream(e.target.value)} required rows={5} />
          <input className="input" placeholder="Emotions (comma separated)" value={emotions} onChange={(e) => setEmotions(e.target.value)} />
          <input className="input" placeholder="Symbols (comma separated)" value={symbols} onChange={(e) => setSymbols(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Log Dream'}</Button>
        </form>
      </div>
      {patterns?.recurring?.length > 0 && (
        <div className="intel-card">
          <h4>Recurring Symbols</h4>
          <div className="dream-symbols">
            {patterns.recurring.map((s) => (
              <span key={s.symbol} className="intel-chip">{s.symbol} ({s.count})</span>
            ))}
          </div>
        </div>
      )}
      <div className="dream-list">
        {dreams.map((d) => (
          <div key={d._id} className="intel-card dream-entry">
            <time>{new Date(d.createdAt).toLocaleDateString()}</time>
            <p>{d.dream}</p>
            {d.aiAnalysis?.interpretation && (
              <p className="dream-analysis">🔮 {d.aiAnalysis.interpretation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
