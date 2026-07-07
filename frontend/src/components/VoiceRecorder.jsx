import { useRef, useState } from 'react';
import { uploadFile } from '../api/coach';

export default function VoiceRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([blob], 'voice-note.webm', { type: 'audio/webm' });
      const result = await uploadFile(file);
      onRecorded(result.url);
      stream.getTracks().forEach((t) => t.stop());
    };
    mediaRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <button type="button" className={`btn btn-ghost btn-sm ${recording ? 'recording' : ''}`} onClick={recording ? stop : start}>
      {recording ? '⏹ Stop Recording' : '🎙️ Voice Note'}
    </button>
  );
}
