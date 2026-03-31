import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [liveText, setLiveText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(24).fill(4));

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recognition = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const bars = 24;
    const step = Math.floor(data.length / bars);
    const levels = Array.from({ length: bars }, (_, i) => {
      const val = data[i * step] / 255;
      return Math.max(4, val * 32);
    });
    setWaveformData(levels);
    animFrameRef.current = requestAnimationFrame(updateWaveform);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio analyzer for waveform
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      recorder.start(250);
      mediaRecorder.current = recorder;

      // Web Speech API for live preview
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';
        recog.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setLiveText(transcript);
        };
        recog.onerror = () => {};
        recog.start();
        recognition.current = recog;
      }

      // Timer
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);

      // Waveform animation
      updateWaveform();

      setIsRecording(true);
      setLiveText('');
    } catch (err) {
      console.error('Mic access denied:', err);
      throw err;
    }
  }, [updateWaveform]);

  const stop = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.onstop = () => {
          let mimeType = mediaRecorder.current?.mimeType || 'audio/webm';
          if (mimeType.includes(';')) {
            mimeType = mimeType.split(';')[0];
          }
          const blob = new Blob(audioChunks.current, { type: mimeType });
          resolve(blob);
        };
        mediaRecorder.current.stop();
      }

      // Stop speech recognition
      if (recognition.current) {
        try { recognition.current.stop(); } catch {}
        recognition.current = null;
      }

      // Stop timer
      if (timerRef.current) clearInterval(timerRef.current);

      // Stop waveform
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setWaveformData(new Array(24).fill(4));

      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      setIsRecording(false);
    });
  }, []);

  const cancel = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (recognition.current) {
      try { recognition.current.stop(); } catch {}
      recognition.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    audioChunks.current = [];
    setIsRecording(false);
    setLiveText('');
    setElapsed(0);
    setWaveformData(new Array(24).fill(4));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return {
    isRecording,
    liveText,
    elapsed,
    formattedTime: formatTime(elapsed),
    waveformData,
    start,
    stop,
    cancel,
  };
}
