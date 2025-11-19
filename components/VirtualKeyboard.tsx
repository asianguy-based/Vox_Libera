
import React from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  darkMode: boolean;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const VirtualKeyboard = ({ onKeyPress, darkMode }: VirtualKeyboardProps): React.ReactElement => {
  const bgClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200';
  const keyClass = darkMode 
    ? 'bg-slate-700 text-white active:bg-slate-600 shadow-sm hover:bg-slate-600 border border-slate-600' 
    : 'bg-white text-slate-900 active:bg-slate-100 shadow-sm hover:bg-slate-50 border border-slate-200';

  return (
    <div className="p-2 sm:p-4 w-full max-w-5xl mx-auto select-none">
      <div className="flex flex-col gap-2">
        {KEYS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
            {row.map((key) => (
              <button
                key={key}
                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss from input
                onClick={() => onKeyPress(key)}
                className={`h-12 w-8 sm:w-12 md:w-14 rounded-lg font-bold text-lg sm:text-xl transition-transform active:scale-95 flex items-center justify-center ${keyClass}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 sm:gap-2 mt-1">
           <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onKeyPress('SPACE')}
                className={`h-12 px-12 rounded-lg font-bold text-sm sm:text-base transition-transform active:scale-95 flex-grow max-w-md flex items-center justify-center ${keyClass}`}
            >
                SPACE
            </button>
             <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onKeyPress('BACKSPACE')}
                className="h-12 px-4 sm:px-6 rounded-lg font-bold text-sm sm:text-base transition-transform active:scale-95 bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center border border-red-200"
            >
                ⌫
            </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
