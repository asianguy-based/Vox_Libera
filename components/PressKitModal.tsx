
import React, { useState } from 'react';

interface PressKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// A self-contained "Press & Media Kit" that journalists, bloggers, nonprofit
// resource-page maintainers, or anyone else vetting the app can use without
// having to ask for anything. Everything here is static copy/asset links -
// zero backend, zero cost, matching the rest of the app's philosophy.
//
// Copy is kept in sync with docs/BRAND_COPY.md (the single source of truth
// used for social bios, the flyer, and outreach emails) - if you update the
// wording there, mirror the change here too.
const CONTACT_EMAIL = 'jeffrey.i.mcconnell@gmail.com';

const ELEVATOR_PITCH =
  "Vox Libera is a free, open-source AAC (Augmentative and Alternative Communication) app that gives a voice to anyone who has difficulty speaking — whether from aphasia, autism, stroke, or another condition. It's 100% free forever, works offline, and requires no account, no ads, and no API keys.";

const ABOUT_BLURB =
  "Vox Libera is a free, open-source AAC (Augmentative and Alternative Communication) web app built for anyone who has difficulty speaking — due to aphasia, autism, cerebral palsy, ALS, stroke, or any other condition. Users build sentences from customizable word and picture cards and have them spoken aloud instantly, using their device's own built-in text-to-speech voices — completely free, private, and fully functional offline. There's no cost, no account sign-up, no ads, and no API keys required; it installs like a normal app on phones, tablets, and computers with zero app-store fees.";

const CopyableBlock = ({
  label,
  text,
}: {
  label: string;
  text: string;
}): React.ReactElement => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail on non-secure contexts / older browsers -
      // fail silently rather than throwing; the text is still selectable.
    }
  };

  return (
    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 text-[11px] font-semibold transition-colors"
        >
          {copied ? '✅ Copied' : '📋 Copy'}
        </button>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
};

const PressKitModal = ({ isOpen, onClose }: PressKitModalProps): React.ReactElement | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] dark:bg-slate-800">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">📰 Press &amp; Media Kit</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1 dark:text-slate-400 dark:hover:text-slate-200" aria-label="Close">
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5 text-slate-700 dark:text-slate-300">
          <p className="text-sm leading-relaxed">
            Everything you need to write about, review, or share Vox Libera &mdash;
            ready to copy/paste, no permission needed. Vox Libera is free and
            open-source (MIT License), so feel free to reuse any of this.
          </p>

          <CopyableBlock label="Elevator Pitch" text={ELEVATOR_PITCH} />
          <CopyableBlock label="About Blurb" text={ABOUT_BLURB} />

          {/* Downloads */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2 dark:text-slate-100">📥 Downloads</h3>
            <div className="space-y-2">
              <a
                href="/press/vox-libera-flyer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">One-Page Flyer (PDF)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Print-friendly overview with a QR code to voxlibera.app
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">Download ⬇️</span>
              </a>

              <a
                href="/assets/icons/android-chrome-512x512.png"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">App Icon (PNG, 512×512)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    "VL" speech-bubble monogram
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">Download ⬇️</span>
              </a>

              <a
                href="/assets/logo.png"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Full Logo / Wordmark (PNG)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    "VOX LIBERA — Every Voice, Set Free" banner logo
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">Download ⬇️</span>
              </a>
            </div>
          </section>

          {/* Facts */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2 dark:text-slate-100">📋 Quick Facts</h3>
            <ul className="text-sm space-y-1 ml-1">
              <li><span className="font-medium">Website:</span> voxlibera.app</li>
              <li><span className="font-medium">Category:</span> AAC (Augmentative and Alternative Communication)</li>
              <li><span className="font-medium">Price:</span> Free, forever &mdash; no accounts, no ads, no API keys</li>
              <li><span className="font-medium">Platform:</span> Web app (installable, works offline, no app-store fees)</li>
              <li><span className="font-medium">License:</span> Open-source, MIT License</li>
              <li>
                <span className="font-medium">Source code:</span>{' '}
                <a
                  href="https://github.com/asianguy-based/Vox_Libera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  github.com/asianguy-based/Vox_Libera
                </a>
              </li>
              <li>
                <span className="font-medium">Contact:</span>{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </section>

          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            Screenshots and a demo video will be added here soon &mdash; check back,
            or ask via the contact email above.
          </p>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end items-center dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PressKitModal;
