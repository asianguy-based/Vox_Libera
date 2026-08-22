
import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, LANGUAGES, Language, Category } from '../types';
import { loadVoices, speakText, isSpeechSynthesisSupported } from '../utils/speechUtils';
import {
  exportBackupToFile,
  saveBackupWithPicker,
  canShareBackup,
  shareBackup,
  parseBackupFile,
  BackupValidationError,
} from '../utils/backupUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  categories: Category[];
  onSave: (newSettings: UserSettings) => void;
  onImportBackup: (settings: UserSettings, categories: Category[]) => void;
}

const SettingsModal = ({ isOpen, onClose, settings, categories, onSave, onImportBackup }: SettingsModalProps): React.ReactElement | null => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [dataMessage, setDataMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  // Load the device's installed system voices when the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setTtsSupported(isSpeechSynthesisSupported());
    loadVoices().then(setAvailableVoices);
  }, [isOpen]);

  if (!isOpen) return null;

  // Only show voices relevant to the selected app language, falling back to
  // showing all voices if none match (better than an empty dropdown).
  const langInfo = LANGUAGES.find(l => l.code === localSettings.language);
  const langPrefix = (langInfo?.voiceCode || 'en').split('-')[0].toLowerCase();
  const filteredVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  const voicesToShow = filteredVoices.length > 0 ? filteredVoices : availableVoices;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let parsedValue: string | number | boolean = value;
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (type === 'range' || type === 'number') {
      parsedValue = parseFloat(value);
    }

    setLocalSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  const handleTestVoice = async () => {
      if (isPreviewLoading || isPreviewPlaying) return;

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
      const langCode = LANGUAGES.find(l => l.code === localSettings.language)?.voiceCode || 'en-US';

      speakText(
        testPhrase,
        {
          voiceURI: localSettings.systemVoiceURI,
          lang: langCode,
          pitch: localSettings.voicePitch ?? 1.0,
          rate: localSettings.voiceRate ?? 1.0,
        },
        () => setIsPreviewPlaying(true),
        () => setIsPreviewPlaying(false),
        (message) => alert(message)
      );
  };

  // --- Export / Import / Backup handlers ---
  // NOTE: these always operate on the currently SAVED settings/categories
  // (props), not the in-progress `localSettings` edits, so a backup taken
  // mid-edit doesn't accidentally include unsaved/discarded changes.

  const showDataMessage = (type: 'success' | 'error', text: string) => {
    setDataMessage({ type, text });
    window.setTimeout(() => setDataMessage(null), 5000);
  };

  const handleExportDownload = () => {
    try {
      const filename = exportBackupToFile(settings, categories);
      showDataMessage('success', `Backup downloaded as "${filename}". Move it into any cloud-synced folder (Google Drive, Dropbox, iCloud) to back it up online.`);
    } catch (e) {
      showDataMessage('error', 'Could not export backup. Please try again.');
    }
  };

  const handleBackupChooseLocation = async () => {
    try {
      const result = await saveBackupWithPicker(settings, categories);
      if (result.saved) {
        showDataMessage('success', `Backup saved as "${result.filename}".`);
      }
    } catch (e) {
      showDataMessage('error', 'Could not save backup to the chosen location.');
    }
  };

  const handleBackupShare = async () => {
    try {
      const shared = await shareBackup(settings, categories);
      if (shared) {
        showDataMessage('success', 'Backup shared successfully.');
      }
    } catch (e) {
      showDataMessage('error', 'Sharing failed. Try "Download Backup File" instead.');
    }
  };

  const handleImportClick = () => {
    importFileInputRef.current?.click();
  };

  const handleImportFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    try {
      const backup = await parseBackupFile(file);
      const confirmed = confirm(
        'Importing this backup will REPLACE your current settings, personal info, recordings, and categories on this device. This cannot be undone. Continue?'
      );
      if (!confirmed) return;

      onImportBackup(backup.settings, backup.categories);
      setLocalSettings(backup.settings);
      showDataMessage('success', 'Backup imported successfully! Your data has been restored.');
    } catch (err) {
      if (err instanceof BackupValidationError) {
        showDataMessage('error', err.message);
      } else {
        console.error('Import failed', err);
        showDataMessage('error', 'Failed to import backup file. Please make sure it is a valid Vox Libera backup.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Settings & Customization</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Security Section */}
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 border-b border-red-200 pb-2 flex items-center gap-2">
                    <span className="text-xl">🔒</span>
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
                    <label htmlFor="systemVoiceURI" className="block text-sm font-medium text-slate-700 mb-2">
                    Voice Selection
                    </label>
                    {!ttsSupported ? (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                            Text-to-speech isn't supported on this browser. Try Chrome, Safari, or Edge.
                        </p>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <select
                                    id="systemVoiceURI"
                                    name="systemVoiceURI"
                                    value={localSettings.systemVoiceURI}
                                    onChange={handleChange}
                                    className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800"
                                >
                                    <option value="">Device Default</option>
                                    {voicesToShow.map((voice) => (
                                        <option key={voice.voiceURI} value={voice.voiceURI}>
                                        {voice.name} ({voice.lang})
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
                                    {isPreviewPlaying ? (
                                        <span className="text-green-600">▶️</span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span>🔊</span>
                                            <span className="text-sm font-medium">Test</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Uses your device's built-in voices (free, works offline). Voices shown depend on your browser and OS (Chrome, Safari, Android, iOS all provide different voices).
                            </p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="voicePitch" className="block text-sm font-medium text-slate-700 mb-2">
                            Pitch ({(localSettings.voicePitch ?? 1.0).toFixed(2)})
                        </label>
                        <input
                            type="range"
                            id="voicePitch"
                            name="voicePitch"
                            min="0.5"
                            max="2"
                            step="0.05"
                            value={localSettings.voicePitch ?? 1.0}
                            onChange={handleChange}
                            className="w-full accent-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="voiceRate" className="block text-sm font-medium text-slate-700 mb-2">
                            Speed ({(localSettings.voiceRate ?? 1.0).toFixed(2)})
                        </label>
                        <input
                            type="range"
                            id="voiceRate"
                            name="voiceRate"
                            min="0.5"
                            max="2"
                            step="0.05"
                            value={localSettings.voiceRate ?? 1.0}
                            onChange={handleChange}
                            className="w-full accent-blue-600"
                        />
                    </div>
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
            
            {/* Saved Spoken Recordings (summary + link to dedicated page) */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Saved Spoken Recordings</h3>
                <p className="text-sm text-slate-500">
                    Record personal audio messages (your own voice, or a loved one's) for quick playback.
                    You get 5 starter slots and can add unlimited more.
                </p>
                <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-lg p-4">
                    <div>
                        <p className="font-semibold text-violet-900">
                            {(localSettings.recordings || []).filter(r => r.audioData).length} of {(localSettings.recordings || []).length} recorded
                        </p>
                        <p className="text-xs text-violet-700 mt-0.5">Manage recordings from their own category page for easy access.</p>
                    </div>
                    <span className="text-3xl">💾</span>
                </div>
                <p className="text-xs text-slate-500">
                    💡 Tap the <strong>Saved Spoken Recordings</strong> category on the main screen to record, play, rename, or add new voice clips.
                </p>
            </div>

            {/* Data Management: Export / Import / Backup */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Data Management</h3>
                <p className="text-sm text-slate-500">
                    Your personal info, recordings, and custom categories are stored only on this device.
                    Export a backup to move to a new device, or back it up somewhere safe.
                </p>

                {dataMessage && (
                    <div className={`text-sm rounded-lg p-3 border ${dataMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {dataMessage.text}
                    </div>
                )}

                {/* Export */}
                <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">📤 Export Data</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleExportDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
                        >
                            ⬇️ Download Backup File
                        </button>
                        <button
                            type="button"
                            onClick={handleBackupChooseLocation}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold"
                            title="Choose exactly where to save (works with cloud-synced folders like Google Drive/OneDrive on desktop browsers)"
                        >
                            📁 Save to Folder / Cloud Drive
                        </button>
                        {canShareBackup() && (
                            <button
                                type="button"
                                onClick={handleBackupShare}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-semibold"
                                title="Share directly to Google Drive, Dropbox, Email, etc."
                            >
                                📲 Share / Send to Cloud App
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500">
                        "Save to Folder / Cloud Drive" lets you pick a folder synced by Google Drive, OneDrive, iCloud Drive, or Dropbox's desktop app (where supported by your browser).
                        "Share" opens your device's native share sheet on mobile.
                    </p>
                </div>

                {/* Import */}
                <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">📥 Import Data</p>
                    <input
                        ref={importFileInputRef}
                        type="file"
                        accept="application/json,.json"
                        onChange={handleImportFileSelected}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleImportClick}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm font-semibold"
                    >
                        📂 Choose Backup File to Restore
                    </button>
                    <p className="text-xs text-red-600">
                        ⚠️ Importing will overwrite all current settings, personal info, recordings, and categories on this device.
                    </p>
                </div>
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
