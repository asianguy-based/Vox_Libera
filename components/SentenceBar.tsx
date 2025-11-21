
import React, { useRef } from 'react';
import { SpeakIcon, LoadingIcon, PlayingIcon, SettingsIcon, BellIcon, ExpandIcon, ContractIcon, KeyboardIcon } from './icons';

interface SentenceBarProps {
  sentence: string;
  onSentenceChange: (text: string) => void;
  onSpeak: () => void;
  onDeleteLast: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onSettingsClick: () => void;
  onToggleKiosk: () => void;
  isKioskMode: boolean;
  onAttentionClick: () => void;
  isLoading: boolean;
  isPlaying: boolean;
  darkMode: boolean;
  onToggleVirtualKeyboard: () => void;
  isVirtualKeyboardOpen: boolean;
  labels?: any;
  isInCategory: boolean;
  onGoBack: () => void;
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
  onToggleKiosk,
  isKioskMode,
  onAttentionClick,
  darkMode,
  onToggleVirtualKeyboard,
  isVirtualKeyboardOpen,
  labels,
  isInCategory,
  onGoBack
}: SentenceBarProps): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canPerformActions = sentence.length > 0;
  const speakButtonDisabled = !canPerformActions || isLoading || isPlaying;

  const getSpeakButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingIcon className="w-6 h-6 animate-spin" />
          <span className="font-semibold">{labels?.generating || "Generating..."}</span>
        </>
      );
    }
    if (isPlaying) {
      return (
        <>
          <PlayingIcon className="w-6 h-6" />
          <span className="font-semibold">{labels?.playing || "Playing..."}</span>
        </>
      );
    }
    return (
      <>
        <SpeakIcon className="w-6 h-6" />
        <span className="font-semibold">{labels?.speak || "Speak"}</span>
      </>
    );
  };
  
  const bgClass = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 border-slate-700'; // Dark header background as shown in image
  const inputBgClass = darkMode ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-slate-700/50 text-white placeholder-slate-400';
  
  // Button base styles
  const btnBase = "flex items-center justify-center rounded-lg shadow-sm transition-all active:scale-95 h-12";
  
  // Specific button styles to match image
  const backBtnClass = `${btnBase} bg-slate-500 text-white hover:bg-slate-600`;
  const undoBtnClass = `${btnBase} bg-[#C6B596] text-amber-900 hover:bg-[#B5A485] disabled:opacity-50 disabled:cursor-not-allowed`; // Beige/Khaki
  const deleteBtnClass = `${btnBase} bg-[#A57F86] text-red-50 hover:bg-[#946E75] disabled:opacity-50 disabled:cursor-not-allowed`; // Muted Red/Mauve
  const clearBtnClass = `${btnBase} bg-[#A57F86] text-red-50 hover:bg-[#946E75] disabled:opacity-50 disabled:cursor-not-allowed`; // Muted Red/Mauve
  
  const attentionBtnClass = `px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm bg-[#FDF6B2] text-yellow-800 hover:bg-[#FCE96A] h-12 whitespace-nowrap`;
  const fullScreenBtnClass = `px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm bg-[#E1EFFE] text-blue-800 hover:bg-[#C3DDFD] h-12 whitespace-nowrap`;
  const settingsBtnClass = `${btnBase} min-w-[3rem] bg-slate-700 text-slate-300 hover:bg-slate-600`;

  return (
    <div className={`fixed top-0 left-0 right-0 shadow-lg z-10 transition-colors duration-300 ${bgClass} p-2`}>
      <div className="flex flex-col gap-2 w-full max-w-full mx-auto">
        
        {/* Branding Row - Reduced height to fix layout */}
        <div className="flex items-center justify-center">
            <img 
                src="https://raw.githubusercontent.com/asianguy-based/Vox_Libera/2d9433bd851ae85957d8f96a0290ab638a379d82/logo.png" 
                alt="Vox Libera - Every Voice, Set Free!" 
                className="h-24 object-contain"
                width="500"
                height="300"
            />
        </div>

        {/* ROW 1: Input Field + Speak Button */}
        <div className="flex gap-2 items-stretch">
            <div className="relative flex-grow">
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="text"
                    value={sentence}
                    onChange={(e) => onSentenceChange(e.target.value)}
                    placeholder={labels?.tapToType || "Tap to type or select words..."}
                    className={`w-full rounded-lg h-14 sm:h-16 pl-4 pr-12 text-xl sm:text-2xl font-medium border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors ${inputBgClass}`}
                />
                 <button
                    onClick={onToggleVirtualKeyboard}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-slate-600 transition-colors ${isVirtualKeyboardOpen ? 'text-blue-400' : 'text-slate-400'}`}
                    aria-label={isVirtualKeyboardOpen ? (labels?.closeKeyboard || "Close Keyboard") : (labels?.openKeyboard || "Open Keyboard")}
                >
                    <KeyboardIcon className="w-6 h-6" />
                </button>
            </div>

             <button
                onClick={onSpeak}
                disabled={speakButtonDisabled}
                className={`flex items-center justify-center gap-2 px-6 rounded-lg font-bold text-white transition-all duration-200 shadow-sm min-w-[8rem] h-14 sm:h-16 ${
                speakButtonDisabled
                    ? 'bg-green-900/50 cursor-not-allowed text-slate-400'
                    : 'bg-[#1E5F44] hover:bg-[#174935] active:scale-95 border border-green-800' // Darker green like image
                }`}
            >
                {getSpeakButtonContent()}
            </button>
        </div>

        {/* ROW 2: Action Buttons */}
        <div className="flex justify-between items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            
            {/* Left Group: Navigation & Editing */}
            <div className="flex gap-2 shrink-0">
                {isInCategory && (
                    <button onClick={onGoBack} className={`${backBtnClass} px-3 w-auto`} title={labels?.back || "Back"}>
                        <span className="font-bold text-sm sm:text-base whitespace-nowrap">{labels?.back || "⭠ Previous Page"}</span>
                    </button>
                )}

                <button onClick={onUndo} disabled={!canUndo} className={`${undoBtnClass} px-3 w-auto`} title={labels?.undo || "Undo"}>
                    <span className="font-bold text-sm sm:text-base whitespace-nowrap">{labels?.undo || "⭯ Undo"}</span>
                </button>
                
                <button onClick={onDeleteLast} disabled={!canPerformActions} className={`${deleteBtnClass} px-3 w-auto`} title={labels?.delete || "Delete"}>
                    <span className="font-bold text-sm sm:text-base whitespace-nowrap">{labels?.delete || "⇤ Delete"}</span>
                </button>

                <button onClick={onClearAll} disabled={!canPerformActions} className={`${clearBtnClass} px-3 w-auto`} title={labels?.clearAll || "Clear All"}>
                    <span className="font-bold text-sm sm:text-base whitespace-nowrap">{labels?.clearAll || "⭙ Clear All"}</span>
                </button>
            </div>

            {/* Right Group: Utilities */}
            <div className="flex gap-2 items-center shrink-0">
                 <button onClick={onAttentionClick} className={attentionBtnClass}>
                    <BellIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">{labels?.attention || "Attention"}</span>
                </button>

                 <button onClick={onToggleKiosk} className={fullScreenBtnClass}>
                    {isKioskMode ? <ContractIcon className="w-5 h-5" /> : <ExpandIcon className="w-5 h-5" />}
                    <span className="hidden sm:inline">{isKioskMode ? (labels?.exit || "Exit") : (labels?.fullScreen || "Full Screen")}</span>
                </button>

                {!isKioskMode && (
                    <>
                        <div className="w-px h-8 bg-slate-600 mx-1"></div>
                        <button onClick={onSettingsClick} className={settingsBtnClass} title={labels?.settings || "Settings"}>
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

        </div>

      </div>
    </div>
  );
};

export default SentenceBar;
