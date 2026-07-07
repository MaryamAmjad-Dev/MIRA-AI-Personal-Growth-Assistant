import { useEffect, useState } from 'react';
import { getMoodFromEntry } from '../constants/moods';
import EmojiPicker from './EmojiPicker';
import TagInput from './TagInput';
import IntensitySlider from './IntensitySlider';

export default function EditEntryModal({ entry, onSave, onClose, saving }) {
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (entry) {
      setMood(getMoodFromEntry(entry));
      setText(entry.text);
      setIntensity(entry.intensity ?? 5);
      setTags(entry.tags || []);
    }
  }, [entry]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!entry) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood || !text.trim()) return;
    await onSave(entry._id, { mood, text: text.trim(), intensity, tags });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass-card animate-scale-in modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Entry</h2>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <EmojiPicker selectedMood={mood} onSelect={setMood} />
          <IntensitySlider value={intensity} onChange={setIntensity} />
          <TagInput selectedTags={tags} onChange={setTags} />
          <textarea className="journal-textarea" value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={5000} />
          <div className="form-footer">
            <span className="char-count">{text.length}/5000</span>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!mood || !text.trim() || saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
