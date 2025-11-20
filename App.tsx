
import React, { useState, useCallback, useEffect } from 'react';
import { Category, Word, UserSettings, Language, VOICE_OPTIONS } from './types';
import { CATEGORIES as DEFAULT_CATEGORIES } from './data/words';
import { UI_LABELS, CATEGORY_TRANSLATIONS } from './data/translations';
import SentenceBar from './components/SentenceBar';
import CategoryGrid from './components/CategoryGrid';
import WordGrid from './components/WordGrid';
import SettingsModal from './components/SettingsModal';
import FullScreenDisplay from './components/FullScreenDisplay';
import AboutModal from './components/AboutModal';
import VirtualKeyboard from './components/VirtualKeyboard';
import AddItemModal from './components/AddItemModal';

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  userName: '',
  userInfo: '',
  address: '',
  phone: '',
  age: '',
  birthday: '',
  allergies: '',
  emergencyContact: '',
  disabilityInfo: '',
  caregiver: '',
  memo1: '',
  memo2: '',
  importantMemo: '',
  voiceName: 'Kore',
  darkMode: false,
  customCategoryColor: '',
  customWordColor: '',
  pinCode: '',
  lockSettings: false,
};

const App = (): React.ReactElement => {
  const [sentence, setSentence] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  
  // UI State
  const [currentCategoryName, setCurrentCategoryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false); // Legacy "Big Text" modal
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false); // True browser fullscreen
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  
  // Initialize keyboard based on screen size (hide on mobile by default)
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
          return true; 
      }
      return true;
  });
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Add Item Modal State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
  const [addItemType, setAddItemType] = useState<'category' | 'word'>('category');

  // Load settings and custom categories from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aac_app_settings');
    if (savedSettings) {
      try {
        setUserSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }

    const savedCategories = localStorage.getItem('aac_user_categories');
    if (savedCategories) {
        try {
            setCategories(JSON.parse(savedCategories));
        } catch (e) {
            console.error('Failed to parse saved categories', e);
        }
    }
  }, []);

  // Listen for fullscreen changes to update state
  useEffect(() => {
      const handleFullscreenChange = () => {
          setIsKioskMode(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update "My Information", "Saved Spoken Memos" and apply Translations when settings change
  useEffect(() => {
    setCategories(prevCats => {
      // Find the clean template from DEFAULT_CATEGORIES to prevent double-appending
      const defaultCatsMap = new Map(DEFAULT_CATEGORIES.map(c => [c.name, c]));

      return prevCats.map(cat => {
        // Use template category if available to reset words, otherwise use current
        const templateCat = defaultCatsMap.get(cat.name) || cat;
        let wordsToProcess = [...templateCat.words];
        
        // Apply Translations to Category Name if available
        let displayCatName = cat.name;
        const lang = userSettings.language;
        
        if (lang !== 'en' && CATEGORY_TRANSLATIONS[cat.name]) {
            const translatedName = (CATEGORY_TRANSLATIONS[cat.name] as any)[lang];
            if (translatedName) displayCatName = translatedName;
        } else if (lang !== 'en') {
            const translatedName = (cat as any)[`name_${lang}`];
            if (translatedName) displayCatName = translatedName;
        }

        let updatedWords = wordsToProcess.map(word => {
             // Apply Translations to Word Label and Spoken Phrase
             let displayLabel = word.label;
             let displaySpokenPhrase = word.spokenPhrase;

             if (lang !== 'en') {
                 const translatedLabel = (word as any)[`label_${lang}`];
                 if (translatedLabel) displayLabel = translatedLabel;

                 const translatedSpoken = (word as any)[`spokenPhrase_${lang}`];
                 if (translatedSpoken) displaySpokenPhrase = translatedSpoken;
             }
             
             const updatedWord = { ...word, label: displayLabel, spokenPhrase: displaySpokenPhrase };

             // Use Icons to identify fields to be language-agnostic
             if (word.icon === '📛' && userSettings.userName) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || updatedWord.label} ${userSettings.userName}` };
             }
             if (word.icon === '🏠' && userSettings.address) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || updatedWord.label} ${userSettings.address}` };
             }
             if (word.icon === '📱' && userSettings.phone) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || updatedWord.label} ${userSettings.phone}` };
             }
             if (word.icon === '🎂' && userSettings.age) { // Age
                  const base = updatedWord.spokenPhrase || updatedWord.label;
                  const final = base.replace('...', userSettings.age);
                 return { ...updatedWord, label: final, spokenPhrase: final };
             }
             if (word.icon === '🥳' && userSettings.birthday) { // Birthday
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || updatedWord.label} ${userSettings.birthday}` };
             }
             if (word.icon === '🥜' && userSettings.allergies) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || 'I am allergic to '} ${userSettings.allergies}` };
             }
             if (word.icon === '♿' && userSettings.disabilityInfo) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || 'My disability is '} ${userSettings.disabilityInfo}` };
             }
             if (word.icon === '🚨' && userSettings.emergencyContact) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || 'My emergency contact is '} ${userSettings.emergencyContact}` };
             }
             if (word.icon === '🧑‍⚕️' && userSettings.caregiver) {
                 return { ...updatedWord, spokenPhrase: `${updatedWord.spokenPhrase || 'My caregiver is '} ${userSettings.caregiver}` };
             }
             return updatedWord;
        });

        // Handle Saved Spoken Memos (Audio)
        if (cat.name === 'Saved Spoken Memos') {
             updatedWords = updatedWords.map(word => {
                if (word.label.startsWith('Memo 1') || word.label === 'Memo 1') return { ...word, audioRecording: userSettings.memo1Audio };
                if (word.label.startsWith('Memo 2') || word.label === 'Memo 2') return { ...word, audioRecording: userSettings.memo2Audio };
                if (word.label === 'Important') return { ...word, audioRecording: userSettings.importantMemoAudio };
                return word;
            });
        }

        return { ...cat, name: displayCatName, words: updatedWords };
      });
    });
  }, [userSettings]);

  const handleSaveSettings = useCallback((newSettings: UserSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('aac_app_settings', JSON.stringify(newSettings));
  }, []);

  // History Management
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setSentence(previous);
  }, [history]);

  const handleWordClick = useCallback((word: Word) => {
    // Direct Audio Playback (e.g. Memos)
    if (word.audioRecording) {
        const audio = new Audio(word.audioRecording);
        setIsPlaying(true);
        audio.play()
            .then(() => {
                audio.onended = () => setIsPlaying(false);
            })
            .catch(e => {
                console.error("Failed to play recording", e);
                setIsPlaying(false);
            });
        return;
    }

    setHistory(prev => [...prev, sentence]);
    // Use spokenPhrase if available (which includes translations), otherwise label
    const textToAdd = word.spokenPhrase || word.label;
    
    setSentence(prev => {
      const cleanSentence = prev.filter(s => s.trim() !== '');
      // Avoid double spaces
      return [...cleanSentence, textToAdd];
    });
  }, [sentence]);

  const handleCategoryClick = useCallback((category: Category) => {
    setCurrentCategoryName(category.name);
    if (category.phrase) {
        setHistory(prev => [...prev, sentence]);
        setSentence(prev => {
          const cleanSentence = prev.filter(s => s.trim() !== '');
          return [...cleanSentence, category.phrase!];
        });
    }
  }, [sentence]);

  const handleGoBack = useCallback(() => {
    setCurrentCategoryName(null);
  }, []);

  const handleDeleteLast = useCallback(() => {
    setHistory(prev => [...prev, sentence]);
    setSentence(prev => prev.slice(0, -1));
  }, [sentence]);

  const handleClearAll = useCallback(() => {
    setHistory(prev => [...prev, sentence]);
    setSentence([]);
  }, [sentence]);

  const handleSentenceChange = useCallback((text: string) => {
      if (text === '') {
          setSentence([]);
      } else {
          setSentence(text.split(' '));
      }
  }, []);

  const handleVirtualKeyPress = useCallback((key: string) => {
      setSentence(prev => {
          const currentText = prev.join(' ');
          let newText = currentText;

          if (key === 'BACKSPACE') {
              newText = currentText.slice(0, -1);
          } else if (key === 'SPACE') {
              newText = currentText + ' ';
          } else {
              newText = currentText + key;
          }
          
          return newText === '' ? [] : newText.split(' ');
      });
  }, []);

  const handleMoveCategory = useCallback((fromIndex: number, toIndex: number) => {
    setCategories((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      localStorage.setItem('aac_user_categories', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // --- Kiosk Mode Logic ---
  const handleToggleKiosk = useCallback(() => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(e => {
              console.error("Fullscreen request failed", e);
          });
      } else {
          if (userSettings.pinCode) {
              const input = prompt("Enter PIN to exit Full Screen:");
              if (input === userSettings.pinCode) {
                  document.exitFullscreen().catch(e => console.error("Exit fullscreen failed", e));
              } else {
                  alert("Incorrect PIN");
              }
          } else {
              document.exitFullscreen().catch(e => console.error("Exit fullscreen failed", e));
          }
      }
  }, [userSettings.pinCode]);

  // --- Custom Item Logic ---

  const openAddCategoryModal = () => {
    setAddItemType('category');
    setIsAddItemModalOpen(true);
  };

  const openAddWordModal = () => {
    setAddItemType('word');
    setIsAddItemModalOpen(true);
  };

  const handleSaveNewItem = (label: string, icon: string, color?: string) => {
    if (addItemType === 'category') {
        const newCategory: Category = {
            name: label,
            icon: icon,
            color: color || '#6366f1',
            words: []
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        localStorage.setItem('aac_user_categories', JSON.stringify(updatedCategories));
    } else {
        if (!currentCategoryName) return;
        
        const updatedCategories = categories.map(cat => {
            if (cat.name === currentCategoryName) {
                return {
                    ...cat,
                    words: [...cat.words, { label, icon }]
                };
            }
            return cat;
        });
        setCategories(updatedCategories);
        localStorage.setItem('aac_user_categories', JSON.stringify(updatedCategories));
    }
  };

  const handleSpeak = useCallback(async () => {
    if (sentence.length === 0 || isLoading || isPlaying) return;

    setIsLoading(true);
    setError(null);
    const textToSpeak = sentence.join(' ');
    
    try {
      const { generateSpeech } = await import('./services/geminiService');
      const { playAudio } = await import('./utils/audioUtils');
      
      const selectedVoice = VOICE_OPTIONS.find(v => v.id === userSettings.voiceName) || VOICE_OPTIONS[0];

      const audioData = await generateSpeech(textToSpeak, selectedVoice.apiVoice, userSettings.language);
      
      if (audioData) {
        setIsPlaying(true);
        await playAudio(audioData, () => setIsPlaying(false), selectedVoice.pitch);
      } else {
         setError('Could not generate speech. The API returned no audio data.');
      }
    } catch (err) {
      console.error('Error generating or playing speech:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while generating speech.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sentence, isLoading, isPlaying, userSettings.voiceName, userSettings.language]);

  const handleAttentionClick = useCallback(async () => {
      try {
          const { playAttentionSound } = await import('./utils/audioUtils');
          await playAttentionSound();
      } catch (e) {
          console.error("Could not play attention sound", e);
      }
  }, []);

  const handleSettingsClick = useCallback(() => {
      if (userSettings.lockSettings && userSettings.pinCode) {
          const input = prompt("Please enter PIN to access Settings:", "");
          if (input === userSettings.pinCode) {
              setIsSettingsOpen(true);
          } else {
              alert("Incorrect PIN");
          }
      } else {
          setIsSettingsOpen(true);
      }
  }, [userSettings.lockSettings, userSettings.pinCode]);

  const activeCategory = categories.find(c => c.name === currentCategoryName);
  // Padding adjusted for new two-row header
  const mainPaddingClass = "pt-32 sm:pt-36 pb-2 sm:pb-4"; 

  const currentUILabels = UI_LABELS[userSettings.language] || UI_LABELS['en'];

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 overflow-hidden ${userSettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <header>
        <SentenceBar
          sentence={sentence.join(' ')}
          onSentenceChange={handleSentenceChange}
          onSpeak={handleSpeak}
          onDeleteLast={handleDeleteLast}
          onClearAll={handleClearAll}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          isLoading={isLoading}
          isPlaying={isPlaying}
          onSettingsClick={handleSettingsClick}
          onToggleKiosk={handleToggleKiosk}
          isKioskMode={isKioskMode}
          onAttentionClick={handleAttentionClick}
          darkMode={userSettings.darkMode}
          onToggleVirtualKeyboard={() => setIsVirtualKeyboardOpen(!isVirtualKeyboardOpen)}
          isVirtualKeyboardOpen={isVirtualKeyboardOpen}
          labels={currentUILabels}
          isInCategory={!!activeCategory}
          onGoBack={handleGoBack}
        />
      </header>

      <main className={`flex-grow w-full overflow-y-auto p-1 ${mainPaddingClass}`}>
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
        {activeCategory ? (
          <WordGrid
            category={activeCategory}
            onWordClick={handleWordClick}
            onGoBack={handleGoBack}
            customColor={userSettings.customWordColor}
            onAddWord={openAddWordModal}
            labels={currentUILabels}
          />
        ) : (
          <CategoryGrid 
            categories={categories} 
            onCategoryClick={handleCategoryClick}
            customColor={userSettings.customCategoryColor} 
            onAddCategory={openAddCategoryModal}
            onMoveCategory={handleMoveCategory}
            labels={currentUILabels}
          />
        )}
      </main>

      {isVirtualKeyboardOpen && (
         <div className={`fixed bottom-0 left-0 right-0 z-20 border-t shadow-lg ${userSettings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
             <VirtualKeyboard 
                onKeyPress={handleVirtualKeyPress} 
                darkMode={userSettings.darkMode}
             />
         </div>
      )}

      <footer className={`text-center p-1 text-xs transition-colors duration-300 ${userSettings.darkMode ? 'text-slate-600' : 'text-slate-400'} ${isVirtualKeyboardOpen ? 'mb-64' : ''}`}>
        <button 
            onClick={() => setIsAboutOpen(true)} 
            className="hover:underline focus:outline-none"
        >
            About
        </button>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onSave={handleSaveSettings}
      />

      <FullScreenDisplay 
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        text={sentence.join(' ')}
        onSpeak={handleSpeak}
        isPlaying={isPlaying}
        isLoading={isLoading}
        pinCode={userSettings.pinCode}
      />

      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSave={handleSaveNewItem}
        type={addItemType}
      />
    </div>
  );
};

export default App;
