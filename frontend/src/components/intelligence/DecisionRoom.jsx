import { useState } from 'react';
import { analyzeDecision } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function DecisionRoom() {
  const { addToast } = useToast();
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(await analyzeDecision({ optionA, optionB, context }));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intel-card decision-room">
      <h3>🎯 AI Decision Room</h3>
      <p className="intel-sub">Analyze choices using your values, goals, and personality</p>
      <form onSubmit={analyze} className="decision-form">
        <Input label="Option A" value={optionA} onChange={(e) => setOptionA(e.target.value)} required />
        <Input label="Option B" value={optionB} onChange={(e) => setOptionB(e.target.value)} required />
        <Input label="Context (optional)" value={context} onChange={(e) => setContext(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Decision'}</Button>
      </form>
      {result && (
        <div className="decision-results">
          {['optionA', 'optionB'].map((key) => {
            const opt = result[key];
            if (!opt) return null;
            return (
              <div key={key} className="decision-option">
                <h4>{opt.label}</h4>
                <div className="alignment">Alignment: {opt.alignmentScore}% · Risk: {opt.risk}</div>
                <div><strong>Pros:</strong><ul>{opt.pros?.map((p) => <li key={p}>{p}</li>)}</ul></div>
                <div><strong>Cons:</strong><ul>{opt.cons?.map((c) => <li key={c}>{c}</li>)}</ul></div>
              </div>
            );
          })}
          <p className="decision-rec"><strong>Recommendation:</strong> {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}
