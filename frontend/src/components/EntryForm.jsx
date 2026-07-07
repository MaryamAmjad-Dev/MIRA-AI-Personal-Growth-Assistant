import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmojiPicker from './EmojiPicker';
import TagInput from './TagInput';
import IntensitySlider from './IntensitySlider';
import RichJournalEditor from './RichJournalEditor';
import AttachmentUploader from './AttachmentUploader';
import VoiceRecorder from './VoiceRecorder';
import SmartEditor from './ai/SmartEditor';
import VoiceJournal from './ai/VoiceJournal';
import AIAssistant from './AIAssistant';

export default function EntryForm({ onSave, saving }) {
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState(null);
  const [text, setText] = useState('');
  const [richContent, setRichContent] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [voiceNote, setVoiceNote] = useState('');
  const [weather, setWeather] = useState(null);

  const detectWeather = () => {
    setWeather({ condition: 'Clear', temp: 22 });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedMood || !text.trim()) return;

    await onSave({
      mood: selectedMood,
      text: text.trim(),
      richContent,
      intensity,
      tags,
      attachments,
      voiceNote,
      weather,
    });

    setSelectedMood(null);
    setText('');
    setRichContent('');
    setIntensity(5);
    setTags([]);
    setAttachments([]);
    setVoiceNote('');
    setWeather(null);
  };

  const canSubmit = selectedMood && text.trim() && !saving;

  return (
    <div className="entry-form-section">
      <form className="entry-form glass-card animate-in" onSubmit={handleSubmit}>
        <h2>{t('entryForm.newEntry')}</h2>
        <EmojiPicker selectedMood={selectedMood} onSelect={setSelectedMood} />
        <IntensitySlider value={intensity} onChange={setIntensity} />
        <TagInput selectedTags={tags} onChange={setTags} />

        <label className="field-label">{t('entryForm.richJournal')}</label>
        <RichJournalEditor value={richContent} onChange={setRichContent} placeholder={t('entryForm.richPlaceholder')} />

        <label className="field-label" htmlFor="journal-text">{t('entryForm.journalEntry')}</label>
        <SmartEditor
          text={text}
          onChange={setText}
          mood={selectedMood}
          intensity={intensity}
          placeholder={t('entryForm.writePlaceholder')}
        />

        <div className="journal-extras">
          <AttachmentUploader attachments={attachments} onChange={setAttachments} />
          <VoiceRecorder onRecorded={setVoiceNote} />
          <VoiceJournal onTranscript={setText} />          <button type="button" className="btn btn-ghost btn-sm" onClick={detectWeather}>🌤️ {t('entryForm.addWeather')}</button>
          {weather && <span className="weather-chip">{weather.condition} {weather.temp}°C</span>}
          {voiceNote && <span className="weather-chip">🎙️ {t('entryForm.voiceAttached')}</span>}
        </div>

        <div className="form-footer">
          <span className={`char-count ${text.length >= 4500 ? 'char-count-warn' : ''}`}>{text.length}/5000</span>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            {saving ? t('entryForm.saving') : t('entryForm.saveEntry')}
          </button>
        </div>
      </form>

      <AIAssistant text={text} mood={selectedMood} emoji={selectedMood?.emoji} intensity={intensity} />
    </div>
  );
}
