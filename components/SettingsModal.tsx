
import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, VOICE_OPTIONS, LANGUAGES, Language } from '../types';
import { CloseIcon, SpeakIcon, LoadingIcon, PlayingIcon, DeleteIcon, LockIcon } from './icons';
import { recorderUtils, blobToBase64 } from '../utils/audioUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

// Helper component for recording a single field
const AudioRecorderControl = ({ 
    label, 
    existingAudio, 
    onSaveAudio, 
    onDeleteAudio 
}: { 
    label: string, 
    existingAudio?: string, 
    onSaveAudio: (base64: string) => void, 
    onDeleteAudio: () => void 
}) => {
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
            setError("Microphone access denied or not available.");
        }
    };

    const handleStopRecording = async () => {
        try {
            const blob = await recorderUtils.stopRecording();
            const base64 = await blobToBase64(blob);
            onSaveAudio(base64);
            setIsRecording(false);
        } catch (e) {
            setError("Failed to save recording.");
            setIsRecording(false);
        }
    };

    const handlePlay = () => {
        if (!existingAudio) return;
        
        // Existing audio is likely a Data URL (data:audio/webm;base64,...)
        if (!audioRef.current) {
            audioRef.current = new Audio(existingAudio);
            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.onerror = () => {
                 setIsPlaying(false);
                 setError("Could not play audio.");
            };
        } else {
            audioRef.current.src = existingAudio;
        }
        
        setIsPlaying(true);
        audioRef.current.play().catch(e => {
            console.error("Playback error", e);
            setIsPlaying(false);
        });
    };

    return (
        <div className="border p-4 rounded-lg bg-white shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-3">
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

                {existingAudio && (
                    <>
                        <button
                            type="button"
                            onClick={handlePlay}
                            disabled={isPlaying}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                            {isPlaying ? <PlayingIcon className="w-5 h-5" /> : <SpeakIcon className="w-5 h-5" />}
                            {isPlaying ? 'Playing...' : 'Play Recording'}
                        </button>
                        <button
                            type="button"
                            onClick={onDeleteAudio}
                            className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete Recording"
                        >
                            <DeleteIcon className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>
    );
};

const SettingsModal = ({ isOpen, onClose, settings, onSave }: SettingsModalProps): React.ReactElement | null => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setLocalSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  const handleTestVoice = async () => {
      if (isPreviewLoading || isPreviewPlaying) return;
      
      setIsPreviewLoading(true);
      try {
        const { generateSpeech } = await import('../services/geminiService');
        const { playAudio } = await import('../utils/audioUtils');

        // Basic hello in different languages
        const greetings: Record<Language, string> = {
            'en': 'Hello, my name is',
            'es': 'Hola, mi nombre es',
            'de': 'Hallo, mein Name ist',
            'fr': 'Bonjour, je m\'appelle',
            'it': 'Ciao, mi chiamo',
            'pt': 'Olá, meu nome é',
            'tl': 'Kamusta, ang pangalan ko ay'
        };
        
        const prefix = greetings[localSettings.language] || greetings['en'];
        const testPhrase = `${prefix} ${localSettings.userName || 'Speech Assistant'}.`;
        
        // Get selected voice settings (apiName and Pitch)
        const selectedVoice = VOICE_OPTIONS.find(v => v.id === localSettings.voiceName) || VOICE_OPTIONS[0];

        // Pass the correct API Name and Language
        const audioData = await generateSpeech(testPhrase, selectedVoice.apiVoice, localSettings.language);

        if (audioData) {
            setIsPreviewPlaying(true);
            // Pass the specific pitch (e.g. 1.25 for kid voice)
            await playAudio(audioData, () => setIsPreviewPlaying(false), selectedVoice.pitch);
        }
      } catch (error) {
          console.error("Failed to test voice:", error);
          alert("Could not generate voice preview. Please try again.");
      } finally {
          setIsPreviewLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Settings & Customization</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Security Section */}
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 border-b border-red-200 pb-2 flex items-center gap-2">
                    <LockIcon className="w-5 h-5" />
                    Security & Locking
                </h3>
                
                <div>
                    <label htmlFor="pinCode" className="block text-sm font-medium text-red-800 mb-2">Set 4-Digit PIN Code</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        id="pinCode"
                        name="pinCode"
                        value={localSettings.pinCode}
                        onChange={handleChange}
                        placeholder="e.g. 1234"
                        className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-800 bg-white tracking-widest font-mono"
                    />
                    <p className="text-xs text-red-600 mt-1">Used to unlock Full Screen mode and Settings.</p>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="lockSettings" className="text-sm font-medium text-red-800">Require PIN to open Settings</label>
                  <input
                    type="checkbox"
                    id="lockSettings"
                    name="lockSettings"
                    checked={localSettings.lockSettings}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer"
                  />
                </div>
            </div>

            {/* Language & Voice */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Language & Speech</h3>
                
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
                    App Language
                    </label>
                    <select
                        id="language"
                        name="language"
                        value={localSettings.language}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                            {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="voiceName" className="block text-sm font-medium text-slate-700 mb-2">
                    Voice Selection
                    </label>
                    <div className="flex gap-2">
                        <select
                            id="voiceName"
                            name="voiceName"
                            value={localSettings.voiceName}
                            onChange={handleChange}
                            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800"
                        >
                            {VOICE_OPTIONS.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                {voice.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleTestVoice}
                            disabled={isPreviewLoading || isPreviewPlaying}
                            className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-300 transition-colors min-w-[5rem]"
                            title="Test Voice"
                        >
                            {isPreviewLoading ? (
                                <LoadingIcon className="w-5 h-5 animate-spin" />
                            ) : isPreviewPlaying ? (
                                <PlayingIcon className="w-5 h-5 text-green-600" />
                            ) : (
                                <div className="flex items-center gap-1">
                                    <SpeakIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">Test</span>
                                </div>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Choose a voice. Note: Some accents might sound best with specific voices.</p>
                </div>
            </div>

            {/* User Profile */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                        <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={localSettings.userName}
                        onChange={handleChange}
                        placeholder="Jamie"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                        />
                    </div>
                     <div>
                        <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                        <input
                        type="text"
                        id="age"
                        name="age"
                        value={localSettings.age}
                        onChange={handleChange}
                        placeholder="25"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                        />
                    </div>
                </div>
                
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">I live at</label>
                    <input
                    type="text"
                    id="address"
                    name="address"
                    value={localSettings.address}
                    onChange={handleChange}
                    placeholder="123 Main St..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                    />
                </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={localSettings.phone}
                        onChange={handleChange}
                        placeholder="555-0199"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthday" className="block text-sm font-medium text-slate-700 mb-2">Birthday</label>
                        <input
                        type="text"
                        id="birthday"
                        name="birthday"
                        value={localSettings.birthday}
                        onChange={handleChange}
                        placeholder="January 1st"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                        />
                    </div>
                 </div>

                <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-2">Allergies</label>
                    <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={localSettings.allergies}
                    onChange={handleChange}
                    placeholder="Peanuts, Dairy..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                    />
                </div>

                <div>
                    <label htmlFor="disabilityInfo" className="block text-sm font-medium text-slate-700 mb-2">Disability Description</label>
                    <input
                    type="text"
                    id="disabilityInfo"
                    name="disabilityInfo"
                    value={localSettings.disabilityInfo}
                    onChange={handleChange}
                    placeholder="My disability is called..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white"
                    />
                </div>

                 <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                    <textarea
                    id="emergencyContact"
                    name="emergencyContact"
                    rows={2}
                    value={localSettings.emergencyContact}
                    onChange={handleChange}
                    placeholder="Mom: 555-1234"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white resize-none"
                    />
                </div>
                
                 <div>
                    <label htmlFor="caregiver" className="block text-sm font-medium text-slate-700 mb-2">Caregiver Info</label>
                    <textarea
                    id="caregiver"
                    name="caregiver"
                    rows={2}
                    value={localSettings.caregiver}
                    onChange={handleChange}
                    placeholder="Name and Number"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white resize-none"
                    />
                </div>

                <div>
                    <label htmlFor="userInfo" className="block text-sm font-medium text-slate-700 mb-2">
                    Other Info / Bio
                    </label>
                    <textarea
                    id="userInfo"
                    name="userInfo"
                    rows={3}
                    value={localSettings.userInfo}
                    onChange={handleChange}
                    placeholder="Additional details..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 resize-none bg-white"
                    />
                </div>
            </div>
            
            {/* Saved Memos (Audio) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Saved Spoken Memos</h3>
                <p className="text-sm text-slate-500">Record audio messages for quick access.</p>
                
                <AudioRecorderControl
                    label="Memo 1"
                    existingAudio={localSettings.memo1Audio}
                    onSaveAudio={(base64) => setLocalSettings(prev => ({ ...prev, memo1Audio: base64 }))}
                    onDeleteAudio={() => setLocalSettings(prev => ({ ...prev, memo1Audio: undefined }))}
                />

                <AudioRecorderControl
                    label="Memo 2"
                    existingAudio={localSettings.memo2Audio}
                    onSaveAudio={(base64) => setLocalSettings(prev => ({ ...prev, memo2Audio: base64 }))}
                    onDeleteAudio={() => setLocalSettings(prev => ({ ...prev, memo2Audio: undefined }))}
                />

                <AudioRecorderControl
                    label="Important"
                    existingAudio={localSettings.importantMemoAudio}
                    onSaveAudio={(base64) => setLocalSettings(prev => ({ ...prev, importantMemoAudio: base64 }))}
                    onDeleteAudio={() => setLocalSettings(prev => ({ ...prev, importantMemoAudio: undefined }))}
                />
            </div>

            {/* Appearance Section */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Appearance</h3>
                
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <label htmlFor="darkMode" className="text-sm font-medium text-slate-700">Dark Mode</label>
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={localSettings.darkMode}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                </div>

                {/* Category Card Color */}
                 <div>
                    <label htmlFor="customCategoryColor" className="block text-sm font-medium text-slate-700 mb-2">
                        Category Card Color
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            id="customCategoryColor"
                            name="customCategoryColor"
                            value={localSettings.customCategoryColor || '#3b82f6'} // Default blue if empty
                            onChange={handleChange}
                            className="h-10 w-20 p-1 rounded border border-slate-300 cursor-pointer bg-white"
                        />
                        <button 
                            type="button" 
                            onClick={() => setLocalSettings(prev => ({ ...prev, customCategoryColor: '' }))}
                            className="text-sm text-slate-500 hover:text-red-500 underline"
                        >
                            Reset to Default
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Overrides the default colors for all category buttons.</p>
                </div>

                {/* Word Card Color */}
                 <div>
                    <label htmlFor="customWordColor" className="block text-sm font-medium text-slate-700 mb-2">
                        Word Card Color
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            id="customWordColor"
                            name="customWordColor"
                            value={localSettings.customWordColor || '#16a34a'} // Default green if empty
                            onChange={handleChange}
                            className="h-10 w-20 p-1 rounded border border-slate-300 cursor-pointer bg-white"
                        />
                         <button 
                            type="button" 
                            onClick={() => setLocalSettings(prev => ({ ...prev, customWordColor: '' }))}
                            className="text-sm text-slate-500 hover:text-red-500 underline"
                        >
                            Reset to Default
                        </button>
                    </div>
                     <p className="text-xs text-slate-500 mt-1">Overrides the default colors for all word buttons.</p>
                </div>
            </div>

            </form>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <a 
              href='https://ko-fi.com/D1D61NBN42' 
              target='_blank' 
              rel="noopener noreferrer" 
              className='flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-sm text-sm'
              style={{ backgroundColor: '#73a9f5' }}
            >
                <span role="img" aria-label="coffee" className="text-lg">☕</span>
                <span>Support me on Ko-fi</span>
            </a>

            <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="settings-form"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
                >
                  Save Settings
                </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SettingsModal;
