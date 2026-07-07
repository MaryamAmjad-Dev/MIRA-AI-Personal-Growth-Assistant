import { useEffect, useRef, useState, useMemo } from 'react';
import { chatWithCoach, fetchChatHistory, clearChatHistory } from '../../api/ai';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { AI_NAME, BRAND_SIGNATURE } from '../../constants/branding';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import AIOrb from './AIOrb';

export default function AIChat() {
  const { t } = useTranslation();
  const SUGGESTIONS = useMemo(() => [
    t('ai.suggestions.mood'),
    t('ai.suggestions.patterns'),
    t('ai.suggestions.habits'),
    t('ai.suggestions.stress'),
  ], [t]);
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchChatHistory()
      .then((history) => setMessages(history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text?.trim();
    if (!msg || typing) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg, timestamp: new Date() }]);
    setTyping(true);
    try {
      const res = await chatWithCoach(msg);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply, timestamp: new Date() }]);
      const history = await fetchChatHistory().catch(() => null);
      if (history?.length) setMessages(history);
    } catch (err) {
      addToast(err.message, 'error');
      setMessages((m) => [...m, {
        role: 'assistant',
        content: t('ai.fallback'),
        timestamp: new Date(),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearChatHistory();
      setMessages([]);
      addToast(t('ai.chatCleared'));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <div className="ai-chat-loading"><AIOrb size="lg" /> {t('ai.loadingChat')}</div>;

  return (
    <div className="ai-chat ai-chat-premium">
      <div className="ai-chat-header">
        <div className="mira-ai-header">
          <AIOrb size="md" />
          <div className="mira-ai-title">
            <h3>{t('ai.coachTitle')}</h3>
            <p className="mira-ai-powered">{t('brand.poweredBy')}</p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleClear}>{t('ai.clearChat')}</button>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && (
          <div className="ai-chat-empty">
            <AIOrb size="lg" />
            <p>{t('ai.askAnything')}</p>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="ai-suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} timestamp={m.timestamp} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="ai-chat-input">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ai.messagePlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
        />
        <button type="button" className="btn btn-primary" onClick={() => sendMessage(input)} disabled={typing}>
          {t('ai.send')}
        </button>
      </div>
    </div>
  );
}
