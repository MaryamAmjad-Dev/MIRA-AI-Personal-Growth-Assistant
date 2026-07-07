import { useState } from 'react';
import { writingAssist } from '../../api/ai';
import { useToast } from '../../context/ToastContext';

const TOOLS = [
  { action: 'continue', label: 'Continue my thoughts', icon: '✍️' },
  { action: 'improve', label: 'Improve reflection', icon: '✨' },
  { action: 'prompts', label: 'Generate prompts', icon: '💡' },
  { action: 'questions', label: 'Ask me questions', icon: '❓' },
  { action: 'summarize', label: 'Summarize', icon: '📝' },
];

export default function AIWritingTools({ text, mood, intensity, onResult }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState('');

  const handleTool = async (action) => {
    if (!text?.trim()) {
      addToast('Write something first', 'error');
      return;
    }
    try {
      setLoading(action);
      const res = await writingAssist(action, { text, mood, intensity });
      const result = res.result;
      if (Array.isArray(result)) {
        onResult?.(result.join('\n\n'));
      } else {
        onResult?.(result);
      }
      addToast('AI suggestion ready!');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="ai-writing-tools">
      <p className="ai-tools-label">AI Writing Assistant</p>
      <div className="ai-tools-grid">
        {TOOLS.map((t) => (
          <button
            key={t.action}
            type="button"
            className="ai-tool-btn"
            onClick={() => handleTool(t.action)}
            disabled={!!loading}
          >
            <span>{t.icon}</span>
            {loading === t.action ? 'Thinking...' : t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
