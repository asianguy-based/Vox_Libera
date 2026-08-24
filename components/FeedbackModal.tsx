
import React, { useState } from 'react';
import { WEB3FORMS_ACCESS_KEY, FEEDBACK_FALLBACK_EMAIL } from '../utils/feedbackConfig';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

// A lightweight "Questions / Comments / Feedback" form. Delivers straight to
// the app owner's inbox via Web3Forms (free, backend-less, no accounts) -
// see utils/feedbackConfig.ts for setup. If no access key has been
// configured yet, falls back to opening the user's own email client with a
// pre-filled mailto: link so the feature always works one way or another.
//
// Name and email are both OPTIONAL. Only the message is required. This is
// explained explicitly in the UI copy below.
const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps): React.ReactElement | null => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName('');
    setEmail('');
    setMessage('');
    setState('idle');
    setErrorText('');
    onClose();
  };

  const buildMailtoFallback = () => {
    const subject = encodeURIComponent('Vox Libera - Feedback');
    const bodyLines = [
      name ? `Name: ${name}` : 'Name: (not provided)',
      email ? `Email: ${email}` : 'Email: (not provided)',
      '',
      message,
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:${FEEDBACK_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // No access key configured yet - use the guaranteed-to-work mailto
    // fallback instead of silently failing or pretending to succeed.
    if (!WEB3FORMS_ACCESS_KEY) {
      window.location.href = buildMailtoFallback();
      resetAndClose();
      return;
    }

    setState('sending');
    setErrorText('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'Vox Libera - New Feedback Submission',
          from_name: 'Vox Libera Feedback Form',
          name: name || '(not provided)',
          email: email || '(not provided - no response requested)',
          message,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setState('success');
      } else {
        throw new Error(result?.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Feedback submission failed', err);
      setErrorText('Could not send online. You can email it directly instead.');
      setState('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Questions / Comments / Feedback
          </h2>
          <button
            onClick={resetAndClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
            aria-label="Close"
          >
            <span className="text-2xl">❌</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {state === 'success' ? (
            <div className="text-center space-y-3 py-6">
              <div className="text-5xl">✅</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Thank you!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Your message has been sent. If you provided an email, you'll hear back if a response is needed.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Have a question, found a bug, or have an idea to make Vox Libera better? Let us know below.
                Name and email are both <strong>optional</strong> - only provide an email if you'd like a
                response; otherwise, feel free to leave it blank.
              </p>

              <div>
                <label htmlFor="feedback-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jamie"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email <span className="text-slate-400">(optional - only needed if you want a reply)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jamie@example.com"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Question / Comment / Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              {state === 'error' && (
                <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg p-3 space-y-2">
                  <p>{errorText}</p>
                  <a
                    href={buildMailtoFallback()}
                    className="inline-block underline font-semibold hover:text-red-800 dark:hover:text-red-200"
                  >
                    📧 Open in email app instead
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={state === 'sending' || !message.trim()}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state === 'sending' ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
