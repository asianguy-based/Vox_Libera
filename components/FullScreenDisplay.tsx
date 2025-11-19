
import React, { useState } from 'react';
import { CloseIcon, FlipIcon, SpeakIcon, PlayingIcon, LoadingIcon } from './icons';

interface FullScreenDisplayProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onSpeak: () => void;
  isPlaying: boolean;
  isLoading: boolean;
}

const FullScreenDisplay = ({ text, isOpen, onClose, onSpeak, isPlaying, isLoading }: FullScreenDisplayProps): React.ReactElement | null => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 sm:p-12">
      {/* Top Actions */}
      <div className="flex justify-between items-start mb-4">
        <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-4 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Flip text"
        >
            <FlipIcon className="w-8 h-8" />
        </button>
        <button
            onClick={onClose}
            className="p-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            aria-label="Close full screen"
        >
            <CloseIcon className="w-8 h-8" />
        </button>
      </div>

      {/* Content */}
      <div className={`flex-grow flex items-center justify-center transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`}>
        <p className="text-6xl sm:text-8xl font-bold text-slate-900 text-center break-words leading-tight">
          {text}
        </p>
      </div>

      {/* Bottom Actions (Speak) */}
      <div className={`flex justify-center mt-8 transition-opacity duration-300 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={onSpeak}
          disabled={isPlaying || isLoading}
          className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed shadow-lg transition-transform active:scale-95"
        >
            {isLoading ? (
                <LoadingIcon className="w-12 h-12 animate-spin" />
            ) : isPlaying ? (
                <PlayingIcon className="w-12 h-12" />
            ) : (
                <SpeakIcon className="w-12 h-12" />
            )}
            <span className="text-xl font-semibold">Speak</span>
        </button>
      </div>
    </div>
  );
};

export default FullScreenDisplay;
