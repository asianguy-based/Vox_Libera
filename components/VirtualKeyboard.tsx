
import React, { useState } from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  darkMode: boolean;
}

const VirtualKeyboard = ({ onKeyPress, darkMode }: VirtualKeyboardProps): React.ReactElement => {
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [mode, setMode] = useState<'ALPHA' | 'NUM' | 'SYM'>('ALPHA');

  const bgClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200';
  
  const keyBaseClass = 'h-10 sm:h-12 rounded-lg font-bold text-lg sm:text-xl transition-transform active:scale-95 flex items-center justify-center shadow-sm border select-none';
  
  const standardKeyClass = darkMode 
    ? `${keyBaseClass} bg-slate-700 text-white active:bg-slate-600 hover:bg-slate-600 border-slate-600` 
    : `${keyBaseClass} bg-white text-slate-900 active:bg-slate-100 hover:bg-slate-50 border-slate-200`;
  
  const actionKeyClass = darkMode
    ? `${keyBaseClass} bg-slate-600 text-slate-200 border-slate-500 active:bg-slate-500`
    : `${keyBaseClass} bg-slate-300 text-slate-700 border-slate-300 active:bg-slate-400`;

  const handleInternalKeyPress = (key: string) => {
    if (key === 'SHIFT') {
      setIsUpperCase(!isUpperCase);
    } else if (key === '?123') {
      setMode('NUM');
    } else if (key === 'ABC') {
      setMode('ALPHA');
    } else if (key === '#+=') {
      setMode('SYM');
    } else if (key === '123') {
      setMode('NUM');
    } else {
      onKeyPress(key);
    }
  };

  const alphaLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'],
    ['?123', 'SPACE', '.']
  ];

  const numLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['#+=', '.', ',', '?', '!', "'", 'BACKSPACE'],
    ['ABC', 'SPACE']
  ];

  const symLayout = [
    ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
    ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
    ['123', '.', ',', '?', '!', "'", 'BACKSPACE'],
    ['ABC', 'SPACE']
  ];

  const getLayout = () => {
    if (mode === 'NUM') return numLayout;
    if (mode === 'SYM') return symLayout;
    
    // Alpha mode: transform case
    return alphaLayout.map(row => row.map(key => {
      if (key.length === 1 && /[a-z]/.test(key)) {
        return isUpperCase ? key.toUpperCase() : key;
      }
      return key;
    }));
  };

  const layout = getLayout();

  return (
    <div className="p-2 sm:p-4 w-full max-w-5xl mx-auto select-none">
      <div className="flex flex-col gap-2">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              let widthClass = 'w-8 sm:w-10 md:w-12 flex-1'; // Standard width
              let displayKey = key;
              let keyStyle = standardKeyClass;
              
              // Adjust width and style for special keys
              if (key === 'SPACE') {
                widthClass = 'flex-[4] max-w-md';
                displayKey = ''; // Spacebar usually empty or "space"
              } else if (key === 'BACKSPACE') {
                widthClass = 'flex-[1.5]';
                displayKey = '⌫';
                keyStyle = actionKeyClass; // Red tint in dark mode? Or just action style
                if (!darkMode) keyStyle += ' bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
              } else if (['SHIFT', '?123', 'ABC', '#+=', '123'].includes(key)) {
                widthClass = 'flex-[1.5]';
                keyStyle = actionKeyClass;
                if (key === 'SHIFT') displayKey = isUpperCase ? '⬆' : '⇧';
              }

              return (
                <button
                  key={key}
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss from input
                  onClick={() => handleInternalKeyPress(key)}
                  className={`${keyStyle} ${widthClass}`}
                >
                  {displayKey}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
