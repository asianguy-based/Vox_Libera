
import React from 'react';

interface InstallInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'ios' | 'other';
}

const InstallInstructionsModal = ({ isOpen, onClose, platform }: InstallInstructionsModalProps): React.ReactElement | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add to Home Screen</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1" aria-label="Close">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 text-slate-700">
          {platform === 'ios' ? (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Install Vox Libera on your iPhone or iPad so it opens like a regular app, works offline, and stays free forever.
              </p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">1</span>
                  <span>Tap the <strong>Share</strong> button <span className="inline-block px-1">⬆️</span> in the Safari toolbar (bottom or top of the screen).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">2</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">3</span>
                  <span>Tap <strong>"Add"</strong> in the top-right corner.</span>
                </li>
              </ol>
              <p className="text-xs text-slate-500 mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
                ⚠️ This only works in <strong>Safari</strong>. If you're using Chrome or another browser on iOS, open this page in Safari first.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Install Vox Libera as an app on your device so it opens like a regular app, works offline, and stays free forever.
              </p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">1</span>
                  <span>Open the browser menu (usually three dots <strong>⋮</strong> in the top-right corner).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">2</span>
                  <span>Look for <strong>"Install App"</strong>, <strong>"Add to Home screen"</strong>, or <strong>"Apps → Install this site as an app"</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">3</span>
                  <span>Confirm by tapping <strong>"Install"</strong> or <strong>"Add"</strong>.</span>
                </li>
              </ol>
              <p className="text-xs text-slate-500 mt-4">
                This works in Chrome, Edge, and most Android browsers. If you don't see this option, your browser may not support installing apps.
              </p>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallInstructionsModal;
