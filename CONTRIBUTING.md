# Contributing to Vox Libera

First off, thank you for considering contributing to Vox Libera! 🎉

Vox Libera is a **free, source-available AAC (Augmentative and Alternative
Communication) app** built so that anyone with a communication disability
can have a voice — without app store fees, subscriptions, accounts, or
paid API keys. Every contribution, whether it's a bug fix, a new phrase
category, a translation, or a documentation improvement, helps someone
communicate more easily.

Vox Libera is licensed under the [Vox Libera Community License](./LICENSE)
(non-commercial, attribution required) rather than a standard OSI
open-source license — by contributing, you agree that your contribution
will be distributed under those same terms.

This document is a **starting template** — feel free to open a PR editing
it further as the project and community grow.

## Code of Conduct

Be kind, patient, and respectful. This project exists to help a vulnerable
user population (people with speech and communication disabilities, and
their caregivers). Contributions and discussions should always keep their
needs and dignity front and center.

## Ways to Contribute

- 🐛 **Report bugs** — Open an issue with steps to reproduce, your browser/OS,
  and (if relevant) a screenshot.
- ✨ **Suggest features** — Open an issue describing the use case, especially
  from the perspective of an AAC user or caregiver.
- 🌍 **Add or improve translations** — See "Adding a Language" below.
- 🗂️ **Add phrase categories/words** — See "Adding Categories & Words" below.
- 🧹 **Fix bugs / improve code** — Pick an open issue, or improve something
  you noticed while using the app.
- 📖 **Improve documentation** — README, this file, code comments.

## Project Philosophy (please read before contributing code)

1. **Stay free and non-commercial.** No paid APIs, no required accounts, no
   telemetry/tracking, no ads. All core features must work with $0 cost to
   both the maintainer and the end user, and the app must never be sold or
   monetized.
2. **Stay a web app.** Vox Libera intentionally stays out of app stores to
   avoid developer fees and review gatekeeping — it's installed as a PWA
   instead. Please don't propose wrapping it in a native shell (Capacitor,
   Cordova, etc.) as the primary distribution method.
3. **Work offline.** AAC users may not have reliable internet access when
   they need to communicate most. New features should degrade gracefully
   (or work fully) without a network connection.
4. **Privacy first.** All personal data (name, recordings, custom phrases)
   stays on the user's device (`localStorage`) unless the user explicitly
   exports/shares it themselves. Don't introduce any feature that silently
   sends personal data to a server.
5. **Accessibility & simplicity.** Every UI addition should be usable by
   someone with limited fine-motor control, using a switch/eye-tracker, or
   with cognitive disabilities. Favor large touch targets, high contrast,
   and simple flows over "clever" UI.

## Development Setup

```bash
git clone https://github.com/asianguy-based/Vox_Libera.git
cd Vox_Libera
npm install
npm run dev
```

The app runs at `http://localhost:3000`. It's a plain **React 18 + Vite +
TypeScript** SPA — no backend, no build secrets, no API keys required.

Useful scripts:

```bash
npm run dev       # Start local dev server with hot reload
npm run build     # Production build to dist/
npm run preview   # Preview the production build locally
```

Before opening a PR, please run:

```bash
npx tsc --noEmit   # Type-check
npm run build      # Ensure it builds cleanly
```

## Project Structure (high level)

```
App.tsx                     Main app component & state orchestration
types.ts                    Shared TypeScript types (Word, Category, UserSettings...)
components/                 UI components (SettingsModal, CategoryGrid, WordGrid, ...)
data/words.ts               Default categories & words (all languages)
data/translations.ts        UI label translations + category name translations
utils/speechUtils.ts         Web Speech API (TTS) wrapper - no API key needed
utils/audioUtils.ts          Recording (MediaRecorder) + playback helpers
utils/recordingsUtils.ts     Dynamic "Saved Spoken Recordings" data model
utils/backupUtils.ts         Export / Import / Backup (JSON) logic
public/service-worker.js     Offline caching (PWA)
public/manifest.json         PWA manifest
```

## Adding a Language

1. Add the language code to the `Language` type and `LANGUAGES` array in
   `types.ts` (include the matching `voiceCode`, e.g. `'ja-JP'` — this maps
   to the Web Speech API voice list on the user's device).
2. Add a full translation object to `UI_LABELS` in `data/translations.ts`.
3. Add translations for each default category name to `CATEGORY_TRANSLATIONS`
   in the same file.
4. Add `label_<code>` / `spokenPhrase_<code>` / `name_<code>` fields to the
   relevant entries in `data/words.ts` (only where a translation differs
   from the English default — the app falls back to English/labels
   automatically).

## Adding Categories & Words

Default categories/words live in `data/words.ts`. Each `Category` needs:
`name`, `icon` (an emoji, used to keep the category recognizable across
languages), `color` (hex), and a `words` array of `{ label, icon, spokenPhrase? }`.

Please keep new default content:
- Broadly useful (not overly specific to one person's situation — that's
  what the Settings > Personal Information and custom categories are for).
- Free of copyrighted images/audio — emoji only for default content.
- Sensitive to the AAC audience (clear, respectful phrasing).

## Pull Request Process

1. Fork the repo and create a branch: `git checkout -b feature/my-feature`.
2. Make your changes, following the philosophy above.
3. Test manually in the browser (and ideally on a mobile device/emulator).
4. Run `npx tsc --noEmit` and `npm run build` — both must pass.
5. Write a clear PR description: what changed, why, and how you tested it.
6. Be responsive to review feedback — this is a volunteer-maintained
   project, so please be patient, and equally, thank you for your patience
   with the maintainer!

## Questions?

Open a GitHub issue, or reach out via the contact info in the README.
Thank you for helping make communication more accessible for everyone. ❤️
