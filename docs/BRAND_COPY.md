# Vox Libera — Brand Copy Reference

Single source of truth for all outward-facing copy: social bios, directory
listings, emails, the flyer, and the in-app Press Kit. Pulling from one file
keeps the message consistent everywhere it appears. Update this file first,
then propagate changes to the places listed under "Used in" below.

---

## Elevator Pitch

**Short (1 sentence, for character-limited bios like X/Twitter/Instagram):**

> Vox Libera is a free, open-source AAC app that gives anyone who has
> difficulty speaking a voice — no cost, no accounts, no ads, ever.

**Standard (2 sentences, for LinkedIn/Facebook bios, email signatures, intros):**

> Vox Libera is a free, open-source AAC (Augmentative and Alternative
> Communication) app that gives a voice to anyone who has difficulty
> speaking — whether from aphasia, autism, stroke, or another condition.
> It's 100% free forever, works offline, and requires no account, no ads,
> and no API keys.

*Used in: social bios, README, flyer headline, press kit, launch posts.*

---

## About Blurb (paragraph, 3–5 sentences)

> Vox Libera is a free, open-source AAC (Augmentative and Alternative
> Communication) web app built for anyone who has difficulty speaking —
> due to aphasia, autism, cerebral palsy, ALS, stroke, or any other
> condition. Users build sentences from customizable word and picture cards
> and have them spoken aloud instantly, using their device's own built-in
> text-to-speech voices — completely free, private, and fully functional
> offline. There's no cost, no account sign-up, no ads, and no API keys
> required; it installs like a normal app on phones, tablets, and computers
> with zero app-store fees. Vox Libera was created after watching how
> expensive and fragmented commercial AAC tools can be — the goal is one
> free, capable app that works for everyone.

*Used in: About page, press kit, directory/nonprofit submission forms,
outreach emails, one-page flyer body copy.*

---

## Boilerplate ("About Vox Libera" — for press mentions / third-party writeups)

> Vox Libera is a free and open-source Augmentative and Alternative
> Communication (AAC) application designed to help individuals with speech
> disabilities communicate. Available as a web app at voxlibera.app, it
> requires no account, no subscription, and no special hardware — it runs
> in any modern browser and can be installed like a native app on phones,
> tablets, or computers. The project is fully open-source under the MIT
> License and is maintained independently, with development guided
> directly by feedback from AAC users, caregivers, and speech-language
> professionals.

*Used in: press page, nonprofit/directory "about the tool" fields, guest
posts, podcast/interview intro blurbs.*

---

## Social Bios (character-limit-aware, ready to paste)

| Platform | Bio |
|---|---|
| X / Twitter (160) | Free, open-source AAC app that gives anyone who struggles to speak a voice. No cost, no accounts, no ads — ever. 🗣️💙 voxlibera.app |
| Instagram (150) | Free & open-source AAC app 🗣️ Giving a voice to anyone who has difficulty speaking. No cost. No ads. Ever. 👇 |
| Facebook Page (short description) | Vox Libera is a free, open-source AAC app that helps people with speech disabilities communicate — no cost, no accounts, no ads, ever. |
| TikTok | Free AAC app that gives a voice to anyone who struggles to speak 🗣️💙 No cost, ever. |
| LinkedIn Page (tagline) | Free, open-source AAC (Augmentative and Alternative Communication) software — giving everyone the ability to speak. |
| YouTube channel description | Vox Libera is a free, open-source AAC app for anyone who has difficulty speaking. This channel shares demos, feature walkthroughs, and updates. Try it free at voxlibera.app. |

**Link in every bio:** `https://voxlibera.app`
**Suggested handle (use consistently across platforms):** `@voxlibera` (fallback: `@voxliberaapp` if taken)

---

## Contact Email

**Decision:** Use a single, consistent public-facing contact address
everywhere (socials, flyer, press kit, directory listings, outreach
emails) rather than mixing a personal address in some places and the
in-app feedback form in others. This also keeps the "which address is
correct?" question from ever coming up for anyone vetting the project.

- **Public contact email (use everywhere):** `jeffrey.i.mcconnell@gmail.com`
  (same address already configured as `FEEDBACK_FALLBACK_EMAIL` in
  `utils/feedbackConfig.ts` and as the Web3Forms delivery target, so all
  feedback paths — in-app form, mailto fallback, and outreach replies —
  land in one inbox).
- **Optional zero-cost upgrade (not required to launch):** Since
  `voxlibera.app` is already on Cloudflare, Cloudflare Email Routing (free)
  can forward a branded address like `hello@voxlibera.app` to the Gmail
  address above with no mailbox to pay for. This is a nice-to-have polish
  item for later — the plain Gmail address is perfectly fine to launch
  with and is what's used across every asset built so far (flyer, press
  kit, social bio template).

*Used in: flyer, press kit, social bios ("DM or email ___"), outreach
email sign-offs, directory submission forms.*

---

## Flyer / One-Pager Copy

**Headline:** Vox Libera — Free Speech, For Everyone

**Sub-headline:** A free, open-source AAC app that gives anyone who has
difficulty speaking a voice.

**Body:** (Standard elevator pitch, above)

**Feature bullets (flyer-length, 6 max):**
- 🗂️ Tap-to-speak word & picture cards, fully customizable
- 🔊 Natural text-to-speech using your device's own voices — works offline
- 🔎 Full-screen "big text" mode for showing sentences to others
- 💾 Personal voice recordings for instant playback
- 🆔 Emergency/caregiver info stored right in the app
- 📥 Installs like a real app — no app-store fees, ever

**Call to action:** Try it free today at **voxlibera.app**
*(QR code linking to https://voxlibera.app)*

**Footer line:** Free & open-source (MIT License) · No accounts · No ads ·
No API keys · github.com/asianguy-based/Vox_Libera

*Used in: `public/press/vox-libera-flyer.pdf` (generated from
`docs/press-kit/flyer.html`).*

---

## Press / Media Page Copy

**Section heading:** Press & Media Kit

**Intro line:** Everything you need to write about, review, or share Vox
Libera — logo files, boilerplate copy, and a one-page overview PDF.

**Included:**
- Elevator pitch + About blurb (this file / in-app Press Kit)
- Logo & icon files (`public/assets/logo.png`,
  `public/assets/icons/android-chrome-512x512.png`)
- One-page flyer PDF (`/press/vox-libera-flyer.pdf`)
- Screenshots & demo video — *coming soon, see OUTREACH_CHECKLIST.md*
- Contact: jeffrey.i.mcconnell@gmail.com

*Used in: in-app Press Kit section (About page), linked from
OUTREACH_CHECKLIST.md and outreach emails.*
