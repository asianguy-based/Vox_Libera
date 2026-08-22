
import { Recording, UserSettings } from '../types';

// Generates a reasonably unique id without requiring the crypto.randomUUID
// API (which is unavailable in some older WebViews / non-secure contexts).
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

// The 5 default recording slots every user starts out with. These are just
// empty placeholders (no audioData) until the user records something - they
// exist so the Recordings page always shows a friendly, guided starting
// point instead of an empty list.
export const createDefaultRecordings = (): Recording[] => ([
  { id: generateId(), label: 'Memo 1', icon: '📝', isDefault: true, createdAt: Date.now() },
  { id: generateId(), label: 'Memo 2', icon: '📝', isDefault: true, createdAt: Date.now() },
  { id: generateId(), label: 'Memo 3', icon: '📝', isDefault: true, createdAt: Date.now() },
  { id: generateId(), label: 'Memo 4', icon: '📝', isDefault: true, createdAt: Date.now() },
  { id: generateId(), label: 'Important', icon: '⭐', isDefault: true, createdAt: Date.now() },
]);

// Migrates settings saved by older versions of the app (which used the fixed
// memo1Audio / memo2Audio / importantMemoAudio fields) into the new dynamic
// `recordings` array. Safe to call on already-migrated settings (no-op).
export const migrateLegacyRecordings = (raw: any): Recording[] => {
  if (Array.isArray(raw?.recordings) && raw.recordings.length > 0) {
    return raw.recordings;
  }

  const legacyHasAudio = raw?.memo1Audio || raw?.memo2Audio || raw?.importantMemoAudio;
  const recordings = createDefaultRecordings();

  if (legacyHasAudio) {
    if (raw.memo1Audio) recordings[0] = { ...recordings[0], audioData: raw.memo1Audio };
    if (raw.memo2Audio) recordings[1] = { ...recordings[1], audioData: raw.memo2Audio };
    if (raw.importantMemoAudio) recordings[4] = { ...recordings[4], audioData: raw.importantMemoAudio };
  }

  return recordings;
};
