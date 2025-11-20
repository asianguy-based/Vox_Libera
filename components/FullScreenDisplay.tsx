
import React, { useState, useEffect } from 'react';
import { CloseIcon, FlipIcon, SpeakIcon, PlayingIcon, LoadingIcon, LockIcon, UnlockIcon } from './icons';

interface FullScreenDisplayProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onSpeak: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  pinCode?: string;
}

const FullScreenDisplay = ({ text, isOpen, onClose, onSpeak, isPlaying, isLoading, pinCode }: FullScreenDisplayProps): React.ReactElement | null => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  useEffect(() => {
      if (isOpen) {
          setIsLocked(false);
          setShowPinPad(false);
          setEnteredPin('');
      }
  }, [isOpen]);

  const handleCloseAttempt = () => {
      if (isLocked && pinCode) {
          setShowPinPad(true);
      } else {
          onClose();
      }
  };

  const handlePinDigit = (digit: string) => {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      
      if (newPin.length === 4) {
          if (newPin === pinCode) {
              setIsLocked(false);
              setShowPinPad(false);
              onClose();
          } else {
              setEnteredPin('');
              alert("Incorrect PIN");
          }
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 sm:p-12">
      {/* Top Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
             <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="p-4 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Flip text"
                disabled={showPinPad}
            >
                <FlipIcon className="w-8 h-8" />
            </button>
            {pinCode && (
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={`p-4 rounded-full transition-colors ${isLocked ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}
                    aria-label={isLocked ? "Unlock screen" : "Lock screen"}
                    disabled={showPinPad}
                >
                    {isLocked ? <LockIcon className="w-8 h-8" /> : <UnlockIcon className="w-8 h-8" />}
                </button>
            )}
        </div>
       
        <button
            onClick={handleCloseAttempt}
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
          disabled={isPlaying || isLoading || showPinPad}
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

      {/* PIN Pad Overlay */}
      {showPinPad && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Enter PIN to Unlock</h3>
                  <div className="flex justify-center gap-2 mb-8">
                      {[0, 1, 2, 3].map(i => (
                          <div key={i} className={`w-4 h-4 rounded-full ${enteredPin.length > i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <button 
                            key={num} 
                            onClick={() => handlePinDigit(num.toString())}
                            className="h-16 text-2xl font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95"
                          >
                              {num}
                          </button>
                      ))}
                      <button 
                        onClick={() => setShowPinPad(false)} 
                        className="h-16 text-lg font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 active:scale-95"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={() => handlePinDigit('0')}
                        className="h-16 text-2xl font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95"
                      >
                          0
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FullScreenDisplay;
