
import React from 'react';

interface UpdateAvailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  newVersion: string;
  notes?: string;
}

// Tells the user a newer build is live on the server than the one they're
// currently running (their bundle was cached before this deploy, or their
// installed PWA hasn't re-fetched yet). "Update Now" just reloads the page -
// the SPA's normal network-first navigation fetch + service worker will
// pull down the new build automatically. This NEVER clears localStorage,
// so all personal info, custom categories, recordings, and settings are
// completely untouched by an update.
const UpdateAvailableModal = ({ isOpen, onClose, newVersion, notes }: UpdateAvailableModalProps): React.ReactElement | null => {
  if (!isOpen) return null;

  const handleUpdateNow = () => {
    // A normal reload is enough: the service worker's navigation handler is
    // network-first for index.html, so this always fetches the latest
    // build's HTML (which references the new hashed JS/CSS), and the SW's
    // install/activate steps take care of precaching + evicting old
    // caches. No user data is read, written, or cleared by this action.
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="text-5xl">✨</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Update Available
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A newer version of Vox Libera (<span className="font-semibold">v{newVersion}</span>) is available.
          </p>
          {notes && (
            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-left">
              {notes}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Your personal info, recordings, and custom categories are stored on this device and will never be changed or removed by an update.
          </p>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-colors"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleUpdateNow}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvailableModal;
