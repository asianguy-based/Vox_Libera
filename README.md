<div align="center">
<img width="1200" height="475" alt="Logo" src="https://github.com/asianguy-based/Vox_Libera/blob/2d9433bd851ae85957d8f96a0290ab638a379d82/logo.png" />
</div>

# Vox Libera — a free AAC app for everyone

**Vox Libera** ("free voice") is a free Augmentative and Alternative Communication (AAC) app for anyone who has difficulty speaking. It's a full-featured, installable web app — no accounts, no ads, no API keys, and no cost, ever.

👉 **Use it now: [https://voxlibera.app](https://voxlibera.app)**

For those of us who can speak, that ability is easy to take for granted. AAC software often forces a trade-off — one app has the feature you need, another has it but costs a lot of money. Vox Libera exists so that no one has to choose or pay a price just to be able to speak.

## Why I built this

I'm one person building what I can, on my own time. My daughter has Cerebral Palsy, and I've seen firsthand how fragmented and expensive AAC tools can be. Why not build something useful for **everyone**, and give it away for free?

If you run into an issue, have feedback, or want to request a feature, use the **Feedback** option in the app's Settings/About page — I read every submission.

## Features

- 🗂️ **Categories & word cards** with custom categories, phrases, emoji icons, and colors
- 💬 **Sentence building** with undo, clear, and a virtual on-screen keyboard
- 🔊 **Text-to-speech** using your device's own built-in voices — private, free, and works fully offline
- 🔎 **Full Screen "Big Text" mode**, including a 180° flip to show text to someone facing you
- 📣 **Attention sound** to get someone's attention before speaking
- 📲 **Kiosk mode** (true browser full-screen) for mounted or shared devices
- 💾 **Personal voice recordings** — save short audio clips for instant playback
- 🎨 **Dark mode** and customizable card colors
- 🌐 **Multiple languages**: English, Spanish, German, French, Italian, Portuguese, and Tagalog
- 🆔 **Caregiver info** (name, allergies, emergency contact, etc.) stored on-device for quick access
- 🔒 **PIN lock** to protect Settings and locked Full Screen mode
- 📦 **Backup, export & restore** — your data lives only on your device, and you're always in control of it
- 📥 **Installable PWA** — add it to your home screen and use it completely offline, with no app-store fees
- 🔄 **Built-in update notifications** so you always know when a new version is available
- 📰 **In-app Press Kit** — elevator pitch, About blurb, logo, and flyer, ready to share or download

For a full walkthrough, open the in-app **Feature Guide** from Settings → Help.

## Privacy & cost

Everything runs client-side in your browser. Speech synthesis uses your device's built-in voices (no API keys, no per-use costs, works offline), and your data — categories, recordings, personal info — stays on your device unless you explicitly export/back it up. There are no accounts, no ads, and no tracking required to use the app.

## License

Vox Libera is free, source-available software under the [Vox Libera Community License](./LICENSE) — a custom, non-commercial license. You're welcome to use, modify, and redistribute this app (including forking it for a specific individual or community), subject to three conditions:

1. **Attribution** — credit Jeffrey McConnell as the original creator, visibly to end users (not just in source comments)
2. **Non-commercial, always free** — you may never sell it, paywall it, or otherwise monetize it; it must stay free for end users
3. **No malicious use** — never use it to cause harm, deceive, or misuse people's personal or medical information

See the [LICENSE](./LICENSE) file for the full terms. Because text-to-speech runs entirely on-device, anyone can self-host or run this app at zero ongoing cost.

### Running it yourself
```bash
npm install
npm run dev      # local development server
npm run build    # production build (outputs to dist/)
```

The app is built with React, TypeScript, and Vite, and is deployed as a static site — no backend or database required.

## Support this project

If you can, please show your support and check out another project of mine:

<a href="http://www.bulletpointlegal.info"><img width="1216" height="231" alt="Bullet Point Legal Logo" src="https://github.com/user-attachments/assets/11adf159-f12a-4401-96a3-7aec71d1cd2e"/> </a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D61NBN42)
