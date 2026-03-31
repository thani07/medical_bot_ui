interface Props {
  liveText: string;
  formattedTime: string;
  waveformData: number[];
  onStop: () => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ liveText, formattedTime, waveformData, onStop, onCancel }: Props) {
  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 animate-slide-up">
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 mx-2 shadow-xl">
        {/* Waveform */}
        <div className="flex items-end justify-center h-10 gap-[2px] mb-3">
          {waveformData.map((h, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Live transcription */}
        {liveText && (
          <div className="bg-dark-800 rounded-lg px-3 py-2 mb-3 max-h-16 overflow-y-auto">
            <p className="text-xs text-slate-300 italic">{liveText}</p>
          </div>
        )}
        {!liveText && (
          <div className="bg-dark-800 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-slate-500 italic">Listening... speak now</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-health-danger transition-colors px-3 py-1.5 rounded-lg hover:bg-red-900/20"
          >
            ✕ Cancel
          </button>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <span className="text-xs font-mono text-accent-purple">{formattedTime}</span>

            {/* Recording indicator */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-health-danger/30 animate-pulse-ring" />
              <div className="w-3 h-3 rounded-full bg-health-danger" />
            </div>
          </div>

          <button
            onClick={onStop}
            className="bg-accent-purple hover:bg-accent-violet text-white text-xs px-4 py-1.5 rounded-lg
              transition-all hover:scale-105 font-medium"
          >
            Stop & Send
          </button>
        </div>
      </div>
    </div>
  );
}
