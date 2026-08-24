
import React, { useState } from 'react';

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  icon: string;
  title: string;
  description: string;
  tip?: string;
}

// A single source of truth for what the app can do, presented as a simple
// slide deck. Kept as plain data (rather than, say, images) so it's free to
// maintain, instant to load, fully offline, and effortless to keep in sync
// as features change - just edit this array.
const SLIDES: Slide[] = [
  {
    icon: '🗣️',
    title: 'Welcome to Vox Libera',
    description:
      "Vox Libera is a free, open-source AAC (Augmentative and Alternative Communication) app that gives a voice to anyone who has difficulty speaking. This quick guide walks through everything the app can do.",
    tip: 'You can reopen this guide any time from Settings → Help / Feature Guide.',
  },
  {
    icon: '🗂️',
    title: 'Categories & Word Cards',
    description:
      'The main screen shows categories (Food, Feelings, People, etc.). Tap a category to see its word cards, then tap any word or phrase to add it to your sentence at the top.',
    tip: 'Tap "➕ Add Category" or "➕ Add Phrase" to create your own custom cards with any emoji icon and color.',
  },
  {
    icon: '💬',
    title: 'Building & Speaking Sentences',
    description:
      'Words you tap are added to the Sentence Bar at the top. Use Undo to remove the last change, the trash icon to clear everything, or tap Speak to have the sentence read aloud.',
    tip: 'You can also type directly into the sentence bar, or use the on-screen Virtual Keyboard.',
  },
  {
    icon: '🔊',
    title: 'Text-to-Speech, Your Way',
    description:
      "Speech uses your device's own built-in voices - completely free, private, and works fully offline. Choose a voice, adjust pitch and speaking rate, and preview it with the Test button, all in Settings.",
    tip: 'Available voices depend on your browser/OS - Chrome, Safari, Android, and iOS each offer different voice options.',
  },
  {
    icon: '⌨️',
    title: 'Virtual Keyboard',
    description:
      "Need to say something that isn't on a card? Tap the keyboard icon in the header to type any custom message directly into the sentence bar.",
  },
  {
    icon: '🔎',
    title: 'Full Screen "Big Text" Mode',
    description:
      'Tap Full Screen to display your sentence in large, easy-to-read text - perfect for holding up so someone else can read it. Flip the text 180° to show it to a person sitting across from you.',
    tip: 'Set a PIN in Settings to lock Full Screen mode so it can\'t be closed accidentally.',
  },
  {
    icon: '📣',
    title: 'Attention Sound',
    description:
      'Tap the Attention button to play a distinct alert sound - a quick, simple way to get someone\'s attention before speaking.',
  },
  {
    icon: '📲',
    title: 'Kiosk (True Full Screen) Mode',
    description:
      'Toggle true browser full-screen mode to hide browser bars entirely - useful when the device is mounted or handed to someone else to use.',
  },
  {
    icon: '💾',
    title: 'Saved Spoken Recordings',
    description:
      "Record short personal audio messages in your own voice, or a loved one's voice, for instant playback. You start with 5 slots and can add unlimited more from the Saved Spoken Recordings category.",
  },
  {
    icon: '🎨',
    title: 'Dark Mode & Custom Colors',
    description:
      'Switch to Dark Mode for low-light comfort, and customize the colors of your category and word cards to fit your own style - all in Settings → Appearance.',
  },
  {
    icon: '🌐',
    title: 'Multiple Languages',
    description:
      'Vox Libera supports English, Spanish, German, French, Italian, Portuguese, and Tagalog. Change the app language any time in Settings.',
  },
  {
    icon: '🆔',
    title: 'Personal Info for Caregivers',
    description:
      'Store your name, address, allergies, disability info, and emergency contact in Settings so a caregiver or first responder can quickly find important information if needed.',
  },
  {
    icon: '🔒',
    title: 'PIN Lock',
    description:
      'Set a 4-digit PIN to require entry before opening Settings or closing a locked Full Screen display - helpful for preventing accidental changes.',
  },
  {
    icon: '📦',
    title: 'Backup, Export & Restore',
    description:
      'Your data lives only on this device. Download a backup file, save it to a cloud-synced folder, or share it directly - then restore it any time, on any device, from Settings → Data Management.',
  },
  {
    icon: '📥',
    title: 'Install as an App',
    description:
      "Install Vox Libera to your home screen so it opens like a regular app and works completely offline, with no app store fees ever. Look for \"Install App\" in the footer or your browser's menu.",
  },
  {
    icon: '🔄',
    title: 'Staying Up to Date',
    description:
      "The current version number is shown in the footer. When a newer version is available, you'll see an update popup - updating never touches your personal info, recordings, or custom categories.",
  },
  {
    icon: '💙',
    title: 'Free, Forever',
    description:
      'Vox Libera is free and open-source, with no accounts, no ads, and no API keys required. If it has helped you or someone you love, consider supporting future development on Ko-fi (see the About page).',
  },
];

const FeatureGuideModal = ({ isOpen, onClose }: FeatureGuideModalProps): React.ReactElement | null => {
  const [index, setIndex] = useState(0);

  if (!isOpen) return null;

  const slide = SLIDES[index];
  const isFirst = index === 0;
  const isLast = index === SLIDES.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleClose = () => {
    onClose();
    // Reset back to the first slide so the guide always restarts from the
    // beginning next time it's opened, rather than resuming mid-deck.
    setIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Feature Guide</h2>
          <button onClick={handleClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1" aria-label="Close">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        {/* Slide content */}
        <div className="overflow-y-auto p-8 flex-grow flex flex-col items-center text-center space-y-4 min-h-[320px] justify-center">
          <div className="text-6xl">{slide.icon}</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{slide.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
            {slide.description}
          </p>
          {slide.tip && (
            <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-3 max-w-md">
              💡 {slide.tip}
            </p>
          )}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 pb-3 px-4 flex-wrap">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-blue-600'
                  : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬅️ Back
          </button>

          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {index + 1} / {SLIDES.length}
          </span>

          {isLast ? (
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
            >
              Next ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureGuideModal;
