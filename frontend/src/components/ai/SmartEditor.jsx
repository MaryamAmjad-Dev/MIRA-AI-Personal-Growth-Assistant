import AIWritingTools from './AIWritingTools';

export default function SmartEditor({ text, onChange, mood, intensity, placeholder }) {
  return (
    <div className="smart-editor">
      <textarea
        className="journal-textarea smart-editor-area"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write about your day...'}
        rows={5}
        maxLength={5000}
      />
      <AIWritingTools
        text={text}
        mood={mood}
        intensity={intensity}
        onResult={(result) => onChange(typeof result === 'string' ? result : text)}
      />
    </div>
  );
}
