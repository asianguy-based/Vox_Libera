
import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 sm:p-12">
      {/* Top Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
             <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                aria-label="Flip text"
                disabled={showPinPad}
            >
                <span className="text-2xl">🔄</span>
            </button>
            {pinCode && (
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={`p-4 rounded-full transition-colors ${isLocked ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}
                    aria-label={isLocked ? "Unlock screen" : "Lock screen"}
                    disabled={showPinPad}
                >
                    <span className="text-2xl">{isLocked ? "🔒" : "🔓"}</span>
                </button>
            )}
        </div>
       
        <button
            onClick={handleCloseAttempt}
            className="p-4 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            aria-label="Close full screen"
        >
            <span className="text-2xl">❌</span>
        </button>
      </div>

      {/* Content */}
      <div className={`flex-grow flex items-center justify-center transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`}>
        <p className="text-6xl sm:text-8xl font-bold text-slate-900 dark:text-slate-100 text-center break-words leading-tight">
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
                <span className="text-4xl animate-spin">⏳</span>
            ) : isPlaying ? (
                <span className="text-4xl">▶️</span>
            ) : (
                <span className="text-4xl">🔊</span>
            )}
            <span className="text-xl font-semibold">Speak</span>
        </button>
      </div>

      {/* PIN Pad Overlay */}
      {showPinPad && (
          <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full text-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Enter PIN to Unlock</h3>
                  <div className="flex justify-center gap-2 mb-8">
                      {[0, 1, 2, 3].map(i => (
                          <div key={i} className={`w-4 h-4 rounded-full ${enteredPin.length > i ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                      ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <button 
                            key={num} 
                            onClick={() => handlePinDigit(num.toString())}
                            className="h-16 text-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95"
                          >
                              {num}
                          </button>
                      ))}
                      <button 
                        onClick={() => setShowPinPad(false)} 
                        className="h-16 text-lg font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 active:scale-95"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={() => handlePinDigit('0')}
                        className="h-16 text-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95"
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
