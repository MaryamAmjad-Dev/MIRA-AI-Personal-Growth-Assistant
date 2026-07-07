import { useRef } from 'react';
import { uploadFile } from '../api/coach';

export default function AttachmentUploader({ attachments, onChange }) {
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadFile(file);
    onChange([...attachments, { type: result.type, url: result.url, name: result.name }]);
    e.target.value = '';
  };

  return (
    <div className="attachment-uploader">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>
        📎 Add Image/File
      </button>
      <input ref={inputRef} type="file" accept="image/*,.pdf" hidden onChange={handleUpload} />
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((a, i) => (
            <span key={i} className="attachment-chip">
              {a.type === 'image' ? '🖼️' : '📄'} {a.name || 'file'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
