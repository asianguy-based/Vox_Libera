
import React, { useState, useRef } from 'react';
import { recorderUtils, blobToBase64 } from '../utils/audioUtils';

interface AudioRecorderControlProps {
  label: string;
  existingAudio?: string;
  onSaveAudio: (base64: string) => void;
  onDeleteAudio: () => void;
  compact?: boolean;
}

// Reusable record / play / delete control for a single audio slot.
// Used by both SettingsModal (legacy inline usage) and the new
// RecordingEditModal for the dynamic Recordings system.
const AudioRecorderControl = ({
  label,
  existingAudio,
  onSaveAudio,
  onDeleteAudio,
  compact,
}: AudioRecorderControlProps): React.ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartRecording = async () => {
    try {
      await recorderUtils.startRecording();
      setIsRecording(true);
      setError(null);
    } catch (e) {
      setError('Microphone access denied or not available.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const blob = await recorderUtils.stopRecording();
      const base64 = await blobToBase64(blob);
      onSaveAudio(base64);
      setIsRecording(false);
    } catch (e) {
      setError('Failed to save recording.');
      setIsRecording(false);
    }
  };

  const handlePlay = () => {
    if (!existingAudio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(existingAudio);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError('Could not play audio.');
      };
    } else {
      audioRef.current.src = existingAudio;
    }

    setIsPlaying(true);
    audioRef.current.play().catch((e) => {
      console.error('Playback error', e);
      setIsPlaying(false);
    });
  };

  return (
    <div className={compact ? '' : 'border p-4 rounded-lg bg-white shadow-sm'}>
      {!compact && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <div className="flex items-center gap-3 flex-wrap">
        {!isRecording && !existingAudio && (
          <button
            type="button"
            onClick={handleStartRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            Record
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={handleStopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors animate-pulse border border-slate-300"
          >
            <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
            Stop Recording
          </button>
        )}

        {existingAudio && !isRecording && (
          <>
            <button
              type="button"
              onClick={handlePlay}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              {isPlaying ? <span className="text-lg">▶️</span> : <span className="text-lg">🔊</span>}
              {isPlaying ? 'Playing...' : 'Play Recording'}
            </button>
            <button
              type="button"
              onClick={handleStartRecording}
              className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
              title="Re-record (replaces current audio)"
            >
              <span className="text-lg">🎙️</span>
              Re-record
            </button>
            <button
              type="button"
              onClick={onDeleteAudio}
              className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete Recording"
            >
              <span className="text-lg">🗑️</span>
            </button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default AudioRecorderControl;
