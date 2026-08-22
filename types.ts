
import React from 'react';

export type Language = 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'tl';

export const LANGUAGES: { code: Language; label: string; voiceCode: string }[] = [
  { code: 'en', label: 'English', voiceCode: 'en-US' },
  { code: 'es', label: 'Español (Spanish)', voiceCode: 'es-ES' },
  { code: 'de', label: 'Deutsch (German)', voiceCode: 'de-DE' },
  { code: 'fr', label: 'Français (French)', voiceCode: 'fr-FR' },
  { code: 'it', label: 'Italiano (Italian)', voiceCode: 'it-IT' },
  { code: 'pt', label: 'Português (Portuguese)', voiceCode: 'pt-BR' },
  { code: 'tl', label: 'Tagalog (Filipino)', voiceCode: 'fil-PH' }, // Gemini often uses fil-PH for Tagalog
];

export interface Word {
  label: string;
  label_es?: string;
  label_de?: string;
  label_fr?: string;
  label_it?: string;
  label_pt?: string;
  label_tl?: string;
  
  spokenPhrase?: string; // The actual text to speak/add to sentence if different from label
  spokenPhrase_es?: string;
  spokenPhrase_de?: string;
  spokenPhrase_fr?: string;
  spokenPhrase_it?: string;
  spokenPhrase_pt?: string;
  spokenPhrase_tl?: string;

  icon: string; // Emoji character or text
  audioRecording?: string; // Base64 audio data
}

export interface Category {
  name: string;
  name_es?: string;
  name_de?: string;
  name_fr?: string;
  name_it?: string;
  name_pt?: string;
  name_tl?: string;
  phrase?: string; // Text to automatically add when category is selected
  icon: string; // Emoji character
  words: Word[];
  color: string;
}

// A single user-recorded voice clip. Replaces the old fixed
// memo1Audio/memo2Audio/importantMemoAudio fields with an open-ended list so
// users can record as many personal phrases (in their own voice, a loved
// one's voice, etc.) as they need.
export interface Recording {
  id: string; // stable unique id (crypto.randomUUID() or fallback)
  label: string; // e.g. "Memo 1", "Mom's Voice - I love you"
  icon: string; // emoji shown on the card, default '📝'
  audioData?: string; // Base64 data URL (data:audio/webm;base64,...)
  isDefault?: boolean; // true for the 5 built-in starter slots
  createdAt: number; // Date.now() timestamp, used for sort/export metadata
}

export interface UserSettings {
  language: Language;
  userName: string;
  userInfo: string; // General bio
  // Specific fields
  address: string;
  phone: string;
  age: string;
  birthday: string;
  allergies: string;
  emergencyContact: string;
  disabilityInfo: string;
  caregiver: string;

  // Dynamic Saved Spoken Recordings: 5 default slots are seeded on first run,
  // and the user can add unlimited additional recordings via the ➕ button
  // in the dedicated Recordings category page / Settings.
  recordings: Recording[];

  // Native browser Text-to-Speech settings (Web Speech API - free, no API key, uses OS voices)
  systemVoiceURI: string; // SpeechSynthesisVoice.voiceURI - '' means "use browser default for language"
  voicePitch: number; // 0.5 - 2.0, default 1.0
  voiceRate: number; // 0.5 - 2.0, default 1.0

  darkMode: boolean;
  customCategoryColor: string; // Hex code or empty string for default
  customWordColor: string; // Hex code or empty string for default

  // Security
  pinCode: string;
  lockSettings: boolean;
}

// Shape of the JSON file produced by Settings > Export Data, and consumed by
// Settings > Import Data. Versioned so future migrations can detect the
// format of an older backup file.
export interface VoxLiberaBackup {
  appName: 'Vox Libera';
  backupVersion: 1;
  exportedAt: string; // ISO date string
  settings: UserSettings;
  categories: Category[];
}
