// Configuration for the in-app "Questions/Comments/Feedback" form (footer).
//
// Feedback is delivered using Web3Forms - a free, backend-less form-to-email
// service. Submissions go STRAIGHT to your inbox; nothing is stored in this
// app, no database, no accounts, no server costs. This keeps the "free app
// for the masses" philosophy intact even for the feedback mechanism itself.
//
// ---------------------------------------------------------------------------
// HOW TO GET YOUR OWN ACCESS KEY (one-time setup, ~60 seconds, completely
// free, no account/password required):
//
//   1. Go to https://web3forms.com
//   2. Enter the email address where you want feedback delivered
//      (e.g. jeffrey.i.mcconnell@gmail.com) and click "Create Access Key"
//   3. Web3Forms emails you a key instantly (just a random ID string -
//      it is NOT a secret password, it's safe to have in client-side code)
//   4. Paste that key below, replacing the empty string
//   5. Rebuild/redeploy the app
//
// Free plan limits: 250 submissions/month, 30-day submission history on
// their end (way more than enough for app feedback). No card required.
// ---------------------------------------------------------------------------
//
// Until WEB3FORMS_ACCESS_KEY is set, the Feedback form automatically falls
// back to opening a pre-filled "mailto:" link instead, so the feature never
// silently fails - it just won't be as slick as a proper inbox delivery
// until the key above is configured.

export const WEB3FORMS_ACCESS_KEY = '3838cc09-95ce-43a7-b4fc-66050fa4d9b3';

// Fallback destination email used by the "mailto:" backup path (and shown
// in the UI as a manual alternative if the online submission ever fails).
export const FEEDBACK_FALLBACK_EMAIL = 'jeffrey.i.mcconnell@gmail.com';
