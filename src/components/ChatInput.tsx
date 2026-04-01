import { useState, useRef, useEffect } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import VoiceRecorder from './VoiceRecorder';
import { useApp } from '../context/AppContext';

interface Props {
  onSendText: (text: string) => void;
  onSendVoice: (blob: Blob, previewText: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendText, onSendVoice, disabled }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const voice = useVoiceRecorder();
  const { addToast, theme } = useApp();

  useEffect(() => {
    if (!voice.isRecording) inputRef.current?.focus();
  }, [voice.isRecording]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendText(trimmed);
    setText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = async () => {
    if (voice.isRecording) return;
    try {
      await voice.start();
    } catch {
      addToast('Microphone access denied. Please allow mic access in your browser.', 'error');
    }
  };

  const handleVoiceStop = async () => {
    const blob = await voice.stop();
    onSendVoice(blob, voice.liveText);
  };

  const isLight = theme === 'light';

  return (
    <div className={`px-4 pt-3 pb-3 sm:pb-4 relative transition-colors duration-300 border-t
      ${isLight ? 'border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)]' : 'border-dark-500 bg-dark-900'}`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Voice recorder overlay */}
      {voice.isRecording && (
        <VoiceRecorder
          liveText={voice.liveText}
          formattedTime={voice.formattedTime}
          waveformData={voice.waveformData}
          onStop={handleVoiceStop}
          onCancel={voice.cancel}
        />
      )}

      <div className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 border transition-all duration-300
        focus-within:ring-4 focus-within:ring-accent-purple/10
        ${isLight
          ? 'bg-slate-50 border-slate-200 focus-within:border-accent-purple/40 focus-within:bg-white shadow-inner'
          : 'bg-dark-800 border-dark-500 focus-within:border-accent-purple/30'
        }`}>
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled || voice.isRecording}
          placeholder="Type your health question..."
          className={`flex-1 bg-transparent outline-none text-sm font-body disabled:opacity-50
            ${isLight ? 'text-slate-800 placeholder-slate-400' : 'text-slate-200 placeholder-slate-500'}`}
        />

        {/* Mic button */}
        <button
          onClick={handleMicClick}
          disabled={disabled || voice.isRecording}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
            ${voice.isRecording
              ? 'bg-health-danger text-white'
              : 'bg-gradient-to-br from-accent-violet to-accent-purple text-white hover:scale-110'
            } disabled:opacity-40`}
          title="Voice input"
        >
          🎤
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center
            text-white text-base hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
