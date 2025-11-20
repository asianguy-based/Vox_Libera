
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
  
  // Saved Memos (Text)
  memo1: string;
  memo2: string;
  importantMemo: string;

  // Saved Memos (Audio)
  memo1Audio?: string;
  memo2Audio?: string;
  importantMemoAudio?: string;
  
  voiceName: string; // 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'
  darkMode: boolean;
  customCategoryColor: string; // Hex code or empty string for default
  customWordColor: string; // Hex code or empty string for default

  // Security
  pinCode: string;
  lockSettings: boolean;
}

export interface VoiceOption {
  id: string;
  label: string;
  gender: string;
  apiVoice: string;
  pitch: number;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Kore', label: 'Sarah (US Female, Calm)', gender: 'Female', apiVoice: 'Kore', pitch: 1.0 },
  { id: 'Puck', label: 'Michael (US Male, Energetic)', gender: 'Male', apiVoice: 'Puck', pitch: 1.0 },
  { id: 'Charon', label: 'David (US Male, Deep)', gender: 'Male', apiVoice: 'Charon', pitch: 1.0 },
  { id: 'Fenrir', label: 'Robert (US Male, Strong)', gender: 'Male', apiVoice: 'Fenrir', pitch: 1.0 },
  { id: 'Zephyr', label: 'Emily (US Female, Soft)', gender: 'Female', apiVoice: 'Zephyr', pitch: 1.0 },
  // Kid Voices (Simulated via pitch shift)
  { id: 'Boy', label: 'Boy (Simulated)', gender: 'Male', apiVoice: 'Puck', pitch: 1.15 },
  { id: 'Girl', label: 'Girl (Simulated)', gender: 'Female', apiVoice: 'Kore', pitch: 1.15 },
];
