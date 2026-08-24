
import React, { useState } from 'react';
import FeatureGuideModal from './FeatureGuideModal';
import FeedbackModal from './FeedbackModal';
import PressKitModal from './PressKitModal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps): React.ReactElement | null => {
  const [isFeatureGuideOpen, setIsFeatureGuideOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPressKitOpen, setIsPressKitOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] dark:bg-slate-800">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">About Vox Libera</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1 dark:text-slate-400 dark:hover:text-slate-200" aria-label="Close">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 text-slate-700 dark:text-slate-300">
          {/* Purpose */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-slate-100">🎯 Purpose</h3>
            <p className="text-sm leading-relaxed">
              Vox Libera is a free Augmentative and Alternative Communication (AAC) app designed to give a voice to individuals who have difficulty speaking &mdash; whether due to aphasia, autism, stroke, vocal cord damage, or other conditions.
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-slate-100">✨ Key Features</h3>
            <ul className="list-disc list-inside space-y-1 ml-1 text-sm">
              <li><span className="font-medium">Visual Communication:</span> Intuitive icons and categories to build sentences quickly without typing.</li>
              <li><span className="font-medium">Text-to-Speech:</span> Converts words or typed text into speech using your device's built-in voices &mdash; free, private, and works offline.</li>
              <li><span className="font-medium">Customization:</span> Personalized voice, profile, and appearance settings.</li>
              <li><span className="font-medium">Accessibility Tools:</span> Full Screen mode for visual clarity and an Attention sound to alert others.</li>
            </ul>
          </section>

          {/* Help & Feedback */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 dark:text-slate-100">🙋 Help &amp; Feedback</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">📖 Feature Guide</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    A quick slide-by-slide walkthrough of everything Vox Libera can do.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatureGuideOpen(true)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 text-xs font-semibold transition-colors"
                >
                  View Guide
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">💬 Questions, Comments &amp; Feedback</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Found a bug, have a suggestion, or just want to say hi? We'd love to hear from you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 text-xs font-semibold transition-colors"
                >
                  Send Feedback
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">📰 Press &amp; Media Kit</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Writing about Vox Libera? Grab the logo, blurb, and a printable flyer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPressKitOpen(true)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 text-xs font-semibold transition-colors"
                >
                  Open Kit
                </button>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-slate-100">🔗 Resources</h3>
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Useful links for AAC support and information:</p>
            <ul className="list-none space-y-1.5 text-sm">
              <li>
                <a href="https://www.asha.org/public/speech/disorders/aac/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                  <span>•</span> ASHA &mdash; AAC Information
                </a>
              </li>
              <li>
                 <a href="https://isaac-online.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                  <span>•</span> ISAAC (International Society for AAC)
                </a>
              </li>
              <li>
                 <a href="https://www.autismspeaks.org/technology-and-autism" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                  <span>•</span> Autism Speaks &mdash; Technology
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center dark:border-slate-700 dark:bg-slate-900">
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

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
            >
              Close
            </button>
        </div>
      </div>

      <FeatureGuideModal
        isOpen={isFeatureGuideOpen}
        onClose={() => setIsFeatureGuideOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <PressKitModal
        isOpen={isPressKitOpen}
        onClose={() => setIsPressKitOpen(false)}
      />
    </div>
  );
};

export default AboutModal;
