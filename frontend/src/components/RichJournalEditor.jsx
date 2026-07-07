export default function RichJournalEditor({ value, onChange, placeholder }) {
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    onChange(document.getElementById('rich-editor')?.innerHTML || '');
  };

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <button type="button" onClick={() => exec('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')} title="Heading">H</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="List">•</button>
        <button type="button" onClick={() => exec('formatBlock', 'blockquote')} title="Quote">❝</button>
      </div>
      <div
        id="rich-editor"
        className="rich-content journal-textarea"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
