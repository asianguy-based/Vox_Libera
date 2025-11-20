
import React, { useRef } from 'react';
import { SpeakIcon, DeleteIcon, ClearIcon, LoadingIcon, PlayingIcon, SettingsIcon, BellIcon, ExpandIcon, KeyboardIcon, UndoIcon } from './icons';

interface SentenceBarProps {
  sentence: string;
  onSentenceChange: (text: string) => void;
  onSpeak: () => void;
  onDeleteLast: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onSettingsClick: () => void;
  onFullScreenClick: () => void;
  onAttentionClick: () => void;
  isLoading: boolean;
  isPlaying: boolean;
  darkMode: boolean;
  onToggleVirtualKeyboard: () => void;
  isVirtualKeyboardOpen: boolean;
  labels?: any;
}

const SentenceBar = ({
  sentence,
  onSentenceChange,
  onSpeak,
  onDeleteLast,
  onClearAll,
  onUndo,
  canUndo,
  isLoading,
  isPlaying,
  onSettingsClick,
  onFullScreenClick,
  onAttentionClick,
  darkMode,
  onToggleVirtualKeyboard,
  isVirtualKeyboardOpen,
  labels
}: SentenceBarProps): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canPerformActions = sentence.length > 0;
  const speakButtonDisabled = !canPerformActions || isLoading || isPlaying;

  const getSpeakButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingIcon className="w-6 h-6 animate-spin" />
          <span>{labels?.generating || "Generating..."}</span>
        </>
      );
    }
    if (isPlaying) {
      return (
        <>
          <PlayingIcon className="w-6 h-6" />
          <span>{labels?.playing || "Playing..."}</span>
        </>
      );
    }
    return (
      <>
        <SpeakIcon className="w-6 h-6" />
        <span>{labels?.speak || "Speak"}</span>
      </>
    );
  };
  
  const bgClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const inputBgClass = darkMode ? 'bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-slate-100 text-slate-800 placeholder-slate-400 focus:border-blue-400';
  const iconColorClass = darkMode ? 'text-slate-300' : 'text-slate-400';
  const secondaryBtnClass = darkMode 
    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white' 
    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900';

  return (
    <div className={`fixed top-0 left-0 right-0 shadow-md z-10 p-2 sm:p-3 border-b transition-colors duration-300 ${bgClass}`}>
      <div className="flex flex-col gap-3 max-w-7xl mx-auto">
        {/* Top Row: Textbox and Main Actions */}
        <div className="flex items-center gap-2">
            <div className="flex-grow relative">
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="text"
                    value={sentence}
                    onChange={(e) => onSentenceChange(e.target.value)}
                    placeholder={labels?.tapToType || "Tap to type or select words..."}
                    className={`w-full rounded-lg min-h-[3.5rem] p-3 pr-12 text-xl sm:text-2xl border-2 border-transparent focus:outline-none transition-colors italic ${inputBgClass}`}
                />
                 <button
                    onClick={onToggleVirtualKeyboard}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-blue-500 transition-colors ${isVirtualKeyboardOpen ? 'text-blue-500' : iconColorClass}`}
                    aria-label={isVirtualKeyboardOpen ? (labels?.closeKeyboard || "Close Keyboard") : (labels?.openKeyboard || "Open Keyboard")}
                >
                    <KeyboardIcon className="w-6 h-6" />
                </button>
            </div>

             <button
                onClick={onSpeak}
                disabled={speakButtonDisabled}
                className={`flex items-center justify-center gap-2 px-4 h-14 rounded-lg font-semibold text-white transition-all duration-200 shadow-sm min-w-[7rem] ${
                speakButtonDisabled
                    ? 'bg-green-800/50 cursor-not-allowed text-slate-300'
                    : 'bg-green-600 hover:bg-green-700 active:scale-95'
                }`}
            >
                {getSpeakButtonContent()}
            </button>
        </div>

        {/* Bottom Row: Secondary Actions */}
        <div className="flex items-center justify-between overflow-x-auto pb-1 sm:pb-0 no-scrollbar gap-2">
            <div className="flex gap-2">
                 <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    aria-label={labels?.undo || "Undo last action"}
                    className="p-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={labels?.undo || "Undo"}
                >
                    <UndoIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onDeleteLast}
                    disabled={!canPerformActions}
                    aria-label={labels?.delete || "Delete last word"}
                    className="p-3 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={labels?.delete || "Delete last word"}
                >
                    <DeleteIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onClearAll}
                    disabled={!canPerformActions}
                    aria-label={labels?.clearAll || "Clear all"}
                    className="p-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={labels?.clearAll || "Clear all"}
                >
                    <ClearIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex gap-2">
                 <button
                    onClick={onAttentionClick}
                    aria-label={labels?.attention || "Attention Sound"}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors font-medium"
                >
                    <BellIcon className="w-6 h-6" />
                    <span className="hidden sm:inline">{labels?.attention || "Attention"}</span>
                </button>
                
                <button
                    onClick={onFullScreenClick}
                    // Removed disabled check so it opens even if empty
                    aria-label={labels?.fullScreen || "Full Screen"}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors font-medium"
                >
                    <ExpandIcon className="w-6 h-6" />
                    <span className="hidden sm:inline">{labels?.fullScreen || "Full Screen"}</span>
                </button>
                
                 <div className={`w-px h-8 mx-1 self-center ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>

                <button
                    onClick={onSettingsClick}
                    aria-label={labels?.settings || "Settings"}
                    className={`p-3 rounded-lg transition-colors ${secondaryBtnClass}`}
                    title={labels?.settings || "Settings"}
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SentenceBar;
