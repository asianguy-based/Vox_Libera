# Vox Libera

> Free, source-available AAC (Augmentative and Alternative Communication) web app — non-commercial, attribution required. React 18 + Vite + TypeScript SPA, deployed via Cloudflare Pages to **voxlibera.app**. Zero backend cost philosophy — no server, no accounts, no ads, no API keys.

**Status:** 🟢 Active — pre-launch / building social presence
**Target:** Everything (socials + supporting assets) live/public by **01 SEP 2026**
**Repo:** [github.com/asianguy-based/Vox_Libera](https://github.com/asianguy-based/Vox_Libera)
**Live site:** [voxlibera.app](https://voxlibera.app)
**Current version:** 1.1.6
**License:** Vox Libera Community License (free, source-available, non-commercial, attribution required)

---

## 🔑 Quick Links

| Resource | Link / Location |
|---|---|
| Live app | https://voxlibera.app |
| GitHub repo | https://github.com/asianguy-based/Vox_Libera |
| Brand copy (source of truth) | `docs/BRAND_COPY.md` in repo |
| Outreach checklist (full detail) | `docs/OUTREACH_CHECKLIST.md` in repo |
| Press/Media Kit (in-app) | About → Press & Media Kit |
| Flyer PDF (live) | https://voxlibera.app/press/vox-libera-flyer.pdf |
| Contact email | jeffrey.i.mcconnell@gmail.com |
| Support | https://ko-fi.com/D1D61NBN42 |
| **Comments, Concerns & Feedback log** | *(separate Notion page — see sibling page)* |

---

## 📝 Elevator Pitch

> Vox Libera is a free AAC (Augmentative and Alternative Communication) app that gives a voice to anyone who has difficulty speaking — whether from aphasia, autism, stroke, or another condition. It's 100% free forever, works offline, and requires no account, no ads, and no API keys.

## 📄 About Blurb

> Vox Libera is a free AAC (Augmentative and Alternative Communication) web app built for anyone who has difficulty speaking — due to aphasia, autism, cerebral palsy, ALS, stroke, or any other condition. Users build sentences from customizable word and picture cards and have them spoken aloud instantly, using their device's own built-in text-to-speech voices — completely free, private, and fully functional offline. There's no cost, no account sign-up, no ads, and no API keys required; it installs like a normal app on phones, tablets, and computers with zero app-store fees.

*(Full brand copy — social bios per platform, boilerplate, flyer copy — lives in `docs/BRAND_COPY.md` in the repo; copy the table below in if you want it duplicated here in Notion.)*

---

## 🎨 Assets & Deliverables

### Brand Assets
- [x] App icon & favicon — black speech-bubble "VL" monogram (`public/assets/icons/`)
- [x] Header banner / logo — "VOX LIBERA — Every Voice, Set Free" wordmark (`public/assets/logo.png`), kept as original, unchanged
- [x] Square social media profile picture — VL/wordmark, circle-crop safe (generated, not yet used — no social accounts exist yet)
- [x] Social cover/header image (FB/X/YouTube banner) — `public/assets/social-cover.png` (1920×560, wide bubble-badge banner), also wired as the Open Graph/Twitter card image in `index.html`
- [x] Simplified speech-bubble watermark mark (no text) — `public/assets/watermark.png` (1024×1024, black & white)

### Written Copy
- [x] Elevator pitch (short + standard versions)
- [x] About blurb (paragraph, 3–5 sentences)
- [x] Press boilerplate ("About Vox Libera" for third-party writeups)
- [x] Per-platform social bios (X, Instagram, Facebook, TikTok, LinkedIn, YouTube)
- [x] Flyer copy (headline, sub-headline, feature bullets, CTA, footer line)
- [x] Contact email decided: `jeffrey.i.mcconnell@gmail.com` (same as in-app feedback fallback)

### Documents & Files
- [x] One-page flyer PDF — letter-size, print-friendly, QR code to voxlibera.app → live at `/press/vox-libera-flyer.pdf`
- [x] In-app Press & Media Kit — copy-to-clipboard pitch/blurb + downloads (flyer, icon, logo) + quick facts, linked from About page
- [ ] 5–8 clean app screenshots (light + dark mode, main grid, sentence bar, full-screen "big text" mode, settings) — **needs user**
- [ ] 60–90 sec demo video/GIF (pick category → build sentence → speak it → full-screen mode) — **needs user**

### In-App Features Shipped (supporting credibility/UX, not outreach-specific)
- [x] Dark Mode (applies everywhere: Settings, About, Add Item, Full Screen)
- [x] Voice Selection dropdown reliability fix
- [x] Cloudflare Access / www ↔ apex domain fixes
- [x] In-app Feature Guide — 17-slide walkthrough of every feature
- [x] Version-check / update-notification system (`version.ts` + `public/version.json`)
- [x] "Questions/Comments/Feedback" popup (replaced footer mailto link) — Web3Forms, delivers straight to `jeffrey.i.mcconnell@gmail.com`; mailto fallback kept as a safety net if the API ever fails
  - ✅ `WEB3FORMS_ACCESS_KEY` configured and live-tested (v1.1.5) — spam protection set to honeypot only (hCaptcha was tried first but rejected all submissions, so it was turned off in the Web3Forms dashboard).
- [x] About page reorganized: Purpose / Features / Help & Feedback / Resources sections

---

## ✅ Phased Go-to-Market Checklist

*(Mirrors `docs/OUTREACH_CHECKLIST.md` in the repo — that file is the detailed/canonical version; this is the tracking summary. Order is deliberate: Social Presence (Phase 1) comes before any outreach (Phase 2/3), so outreach messages can point to a live, credible presence instead of "coming soon.")*

### Phase 0 — Foundation & Credibility Assets
- [x] App icon & favicon
- [x] Header banner (kept original)
- [x] In-app feedback mechanism
- [x] Feature Guide slide deck
- [x] About page cleanup with links
- [x] Social media profile picture generated
- [x] Elevator pitch written
- [x] About blurb written
- [ ] 5–8 app screenshots — **needs user**
- [ ] 60–90 sec demo video — **needs user**
- [x] One-page flyer/PDF
- [x] Press/media page section (in-app Press Kit)
- [x] Contact email decided

### Phase 1 — Social Presence & Brand Setup *(do before any outreach)*
- [ ] Create accounts: Facebook Page, Instagram, X/Twitter, TikTok, YouTube, LinkedIn Page
- [ ] Upload profile picture (already generated) on every platform
- [ ] Upload cover/header image to each platform (asset ready: `public/assets/social-cover.png`)
- [ ] Consistent bio/description + link to voxlibera.app on every platform
- [ ] Same handle/username across platforms (`@voxlibera`, fallback `@voxliberaapp`)
- [ ] Pin intro post/video on each platform
- [ ] Queue launch announcement + first 3–5 feature-spotlight posts
- [ ] Upload demo video to YouTube, cross-link elsewhere
- [ ] Add social icons/links to the web app footer/About page

### Phase 2 — Grassroots & Community Outreach
- [ ] Reddit: r/AAC, r/SLP, r/Aphasia, r/autism, r/CerebralPalsy, r/ALS, r/disability, r/opensource, r/SideProject
- [ ] Facebook groups (AAC support, caregiver groups)
- [ ] Discord/Slack AAC & SLP communities
- [ ] Forums: AssistiveWare, Apraxia-Kids, National Aphasia Association
- [ ] Hacker News "Show HN", Product Hunt, r/webdev, GitHub polish (topics/tags)
- [ ] Directories: AlternativeTo, PWA directories, awesome-accessibility lists

### Phase 3 — Organizations, Associations & Professionals
- [ ] ASHA, ISAAC, state SLP associations
- [ ] Nonprofits: Autism Speaks, National Aphasia Association, ALS Association, Apraxia Kids, UCP, Easterseals, The Arc
- [ ] School districts + Assistive Technology (AT) coordinators
- [ ] Colleges/universities (SLP programs, speech clinics)
- [ ] Hospitals, rehab centers, private-practice SLPs
- [ ] State Assistive Technology Act Programs, Centers for Independent Living

### Phase 4 — Sustain & Iterate
- [ ] Monitor in-app Feedback inbox regularly
- [ ] Keep posting to socials (content calendar, feature-spotlight posts)
- [ ] Track referral sources informally
- [ ] Keep Feature Guide/About page updated as features ship
- [ ] Re-post/refresh social content periodically
- [ ] Reach out to accessibility podcasts/YouTube once there's traction

---

## 🚧 Blocked / Waiting On

| Item | Blocked on | Notes |
|---|---|---|
| App screenshots (5–8) | User action | Needs a person to capture from a real device/browser |
| Demo video (60–90 sec) | User action | Can be recorded in parallel with other Phase 0 work |

---

## 🕒 Release / Version Log

*Versioning policy: PATCH digit (rightmost) bumps for normal incremental changes; MINOR for a larger bundled feature set; MAJOR for a full overhaul.*

| Version | What shipped |
|---|---|
| 1.1.6 | Added social cover/header image (`public/assets/social-cover.png`, 1920×560) and speech-bubble watermark (`public/assets/watermark.png`, 1024×1024); wired cover image into Open Graph/Twitter card meta tags in `index.html`; added both as Press Kit downloads |
| 1.1.5 | Wired up a live Web3Forms access key for the in-app Feedback form — submissions now deliver straight to `jeffrey.i.mcconnell@gmail.com` instead of falling back to mailto; disabled hCaptcha on the Web3Forms form (was blocking all submissions) |
| 1.1.4 | Switched license from MIT to the custom Vox Libera Community License (non-commercial, attribution required, no malicious use); updated all copy/docs referencing "MIT"/"open-source" accordingly |
| 1.1.3 | Updated README with the current live URL, feature list, and project info |
| 1.1.2 | Fixed press-kit flyer PDF spilling onto a stray second page — now single page, footer line at the bottom |
| 1.1.1 | Added in-app Press & Media Kit (About page), downloadable one-page flyer PDF, brand copy doc |
| 1.1.0 | Dark Mode everywhere, Voice Selection reliability fix, Feature Guide, automatic update checking |

---

## 📌 Notes / Decisions Log

- **Ordering decision:** Social Presence (Phase 1) was deliberately moved before Grassroots/Institutional Outreach (Phase 2/3) — anyone contacted via outreach will likely check for a live, credible online presence first.
- **Contact email decision:** Reusing `jeffrey.i.mcconnell@gmail.com` everywhere (flyer, press kit, social bios, outreach) rather than mixing addresses — it's already the Web3Forms/mailto fallback target, so all feedback paths land in one inbox. Optional future upgrade: free Cloudflare Email Routing to forward a branded `hello@voxlibera.app` alias.
- **Original header banner** (`public/assets/logo.png`) — kept as-is by request, no redesign.
- **Social cover banner design decision:** Built by compositing the existing logo's lettering onto a newly-generated wide (1920×560) background+mascot scene with its own blank speech-bubble badge — rather than pasting the full logo (which has its own bubble/outline) onto the new banner's bubble, which produced a confusing "three bubbles" nested look. Fix: extracted *only* the letter glyphs from the logo via connected-component analysis (discarding the logo's own bubble/outline shape), then pasted just the lettering onto the banner's single badge. Also required generous horizontal/vertical padding so the lettering clears the badge's own rounded-corner outline curve (a tight-padding first attempt made a letter look like it was "popping out" through the corner).
- **Deploy timing observed:** Cloudflare Pages typically takes **~1.25–2.5 minutes** from `git push` to live on voxlibera.app (measured three times: ~1m37s, ~2m17s, ~1m16s).
- **License decision:** Switched from MIT to a custom "Vox Libera Community License" — still free to use/modify/share, but now requires (1) attribution to the original creator, (2) strictly non-commercial use (never sold/monetized), and (3) no malicious use. This is technically "source-available," not OSI open-source, since it restricts commercial use. All copy referring to "open-source"/"MIT" was updated across README, in-app modals, brand copy, flyer, and outreach checklist to say "free"/"source-available" instead.
