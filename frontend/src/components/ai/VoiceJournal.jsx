import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function VoiceJournal({ onTranscript, onAnalyze }) {
  const { addToast } = useToast();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
      onTranscript?.(text);
    };

    recognition.onerror = () => {
      setListening(false);
      addToast('Voice recognition error', 'error');
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [addToast, onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      addToast('Speech recognition not supported in this browser', 'error');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="voice-journal">
      <button
        type="button"
        className={`btn ${listening ? 'btn-danger' : 'btn-ghost'} btn-sm voice-journal-btn`}
        onClick={toggleListening}
      >
        {listening ? '🛑 Stop' : '🎙️ Speak journal'}
      </button>
      {transcript && (
        <div className="voice-transcript">
          <p>{transcript}</p>
          {onAnalyze && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAnalyze(transcript)}>
              Analyze voice journal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
