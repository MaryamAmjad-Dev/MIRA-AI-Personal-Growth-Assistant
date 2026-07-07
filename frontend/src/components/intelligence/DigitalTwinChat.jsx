import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { askDigitalTwin } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';

const PRESETS = [
  'What would I normally do?',
  'Why do I keep repeating this pattern?',
  'What changed about me this month?',
  'Compare current me vs past me',
];

export default function DigitalTwinChat({ twin }) {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (twin) {
      setMessages([{
        role: 'twin',
        text: `I'm your Digital Twin — a ${twin.personalityType} mirror of you. Ask me anything about your patterns, decisions, or growth.`,
      }]);
    }
  }, [twin]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ask = async (q) => {
    const question = q?.trim();
    if (!question || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const res = await askDigitalTwin(question);
      setMessages((m) => [...m, { role: 'twin', text: res.reply }]);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="ai-card intel-card twin-chat">
      <div className="intel-card-header">
        <span className="intel-icon">🧬</span>
        <div>
          <h3 className="ai-card-title">My AI Twin</h3>
          <p className="ai-card-content intel-sub">{twin?.personalityType} · {twin?.communicationStyle}</p>
        </div>
      </div>
      <div className="twin-presets">
        {PRESETS.map((p) => (
          <button key={p} type="button" className="intel-chip" onClick={() => ask(p)} disabled={loading}>{p}</button>
        ))}
      </div>
      <div className="twin-messages">
        {messages.map((m, i) => (
          <motion.div key={i} className={`twin-msg ai-text ${m.role}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {m.text}
          </motion.div>
        ))}
        {loading && <div className="twin-msg twin typing">Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="twin-input-row">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your twin..." onKeyDown={(e) => e.key === 'Enter' && ask(input)} />
        <button type="button" className="btn btn-primary" onClick={() => ask(input)} disabled={loading}>Ask</button>
      </div>
    </article>
  );
}
