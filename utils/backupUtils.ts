
import { Category, UserSettings, VoxLiberaBackup } from '../types';

const BACKUP_FILENAME_PREFIX = 'vox-libera-backup';

export const buildBackupPayload = (settings: UserSettings, categories: Category[]): VoxLiberaBackup => ({
  appName: 'Vox Libera',
  backupVersion: 1,
  exportedAt: new Date().toISOString(),
  settings,
  categories,
});

const buildFilename = (): string => {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `${BACKUP_FILENAME_PREFIX}-${stamp}.json`;
};

const buildBackupFile = (settings: UserSettings, categories: Category[]): { file: File; json: string; filename: string } => {
  const payload = buildBackupPayload(settings, categories);
  const json = JSON.stringify(payload, null, 2);
  const filename = buildFilename();
  const file = new File([json], filename, { type: 'application/json' });
  return { file, json, filename };
};

// --- Local file download (works everywhere, fully offline) ---
const downloadViaAnchor = (json: string, filename: string) => {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

// Export & Download: always available fallback, saves the backup JSON file
// wherever the browser's download folder is configured (the user can then
// move it into any cloud-synced folder - Google Drive, Dropbox, OneDrive,
// iCloud Drive - manually, or attach it to an email/etc.).
export const exportBackupToFile = (settings: UserSettings, categories: Category[]): string => {
  const { json, filename } = buildBackupFile(settings, categories);
  downloadViaAnchor(json, filename);
  return filename;
};

// Modern File System Access API - lets the user pick exactly where to save
// (including cloud-synced folders mounted as local directories, e.g. the
// Google Drive or OneDrive desktop app's folder). Falls back silently to the
// anchor-download method when unsupported (Firefox, older Safari, etc.) or
// when the user cancels the picker.
export const saveBackupWithPicker = async (settings: UserSettings, categories: Category[]): Promise<{ saved: boolean; filename: string }> => {
  const { json, filename } = buildBackupFile(settings, categories);
  const w = window as any;

  if (typeof w.showSaveFilePicker === 'function') {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'Vox Libera Backup', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return { saved: true, filename };
    } catch (err: any) {
      // AbortError = user cancelled the picker; don't fall back in that case.
      if (err?.name === 'AbortError') {
        return { saved: false, filename };
      }
      // Any other failure -> fall back to plain download below.
    }
  }

  downloadViaAnchor(json, filename);
  return { saved: true, filename };
};

// Web Share API (Level 2, with file support) - on mobile browsers (Android
// Chrome, iOS Safari) this opens the native share sheet, letting the user
// send the backup file directly to Google Drive, Dropbox, WhatsApp, Email,
// AirDrop, etc. This is how we support "backup to different cloud services"
// without needing any paid API keys or OAuth integrations.
export const canShareBackup = (): boolean => {
  const n = navigator as any;
  if (!n.share || !n.canShare) return false;
  try {
    // Some browsers require an actual File instance to evaluate canShare reliably.
    const probe = new File(['{}'], 'probe.json', { type: 'application/json' });
    return n.canShare({ files: [probe] });
  } catch {
    return false;
  }
};

export const shareBackup = async (settings: UserSettings, categories: Category[]): Promise<boolean> => {
  const { file } = buildBackupFile(settings, categories);
  const n = navigator as any;
  try {
    await n.share({
      files: [file],
      title: 'Vox Libera Backup',
      text: 'My Vox Libera AAC settings backup.',
    });
    return true;
  } catch (err: any) {
    if (err?.name === 'AbortError') return false; // user cancelled
    throw err;
  }
};

// --- Import ---

export class BackupValidationError extends Error {}

export const parseBackupFile = async (file: File): Promise<VoxLiberaBackup> => {
  const text = await file.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BackupValidationError('That file is not valid JSON. Please choose a Vox Libera backup file.');
  }

  if (!data || typeof data !== 'object') {
    throw new BackupValidationError('That file does not contain a valid backup.');
  }
  if (!data.settings || typeof data.settings !== 'object') {
    throw new BackupValidationError('That backup file is missing app settings and cannot be imported.');
  }
  if (!Array.isArray(data.categories)) {
    throw new BackupValidationError('That backup file is missing categories and cannot be imported.');
  }

  return data as VoxLiberaBackup;
};
