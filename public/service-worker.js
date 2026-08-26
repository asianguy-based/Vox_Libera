// Vox Libera Service Worker
// Goal: TRUE offline access - including on a user's very FIRST visit. Once
// the app has loaded once, it must keep working with no network connection
// at all: the app shell, the compiled JS/CSS bundle, the manifest, and all
// icon/logo images.
//
// IMPORTANT LESSON LEARNED (bug fixed in v5): a service worker never
// controls the network requests made by the page load that registers it -
// only requests from the *next* navigation onward are intercepted (this is
// part of the Service Worker spec, not a bug in our fetch handler). Because
// Vite content-hashes the built JS/CSS filenames on every build
// (e.g. index-Cjnxpcwy.js), those filenames are NOT known ahead of time and
// could not previously be listed in CORE_ASSETS - so on a brand-new
// install, the hashed bundle was only ever cached reactively by the fetch
// handler, which never got a chance to run for that very first load. Result:
// installing the app and then immediately going offline (before a second
// page view) produced a blank white screen.
//
// FIX: the install handler now fetches index.html itself, parses out the
// actual hashed <script>/<link rel="stylesheet"> asset URLs it references,
// and precaches those explicitly alongside the static core assets - all
// within the install step, before the service worker ever activates. This
// guarantees the full app shell (including the current build's JS/CSS) is
// cached before the very first offline scenario can occur.
//
// Strategy:
//  - App shell + hashed build assets (JS/CSS/images under /assets/):
//    cache-first, since a cached copy is always safe to reuse and a new
//    deploy naturally gets new filenames (cache-busting is automatic).
//  - Navigation requests (the SPA's index.html): network-first with a
//    cache fallback, so users get the latest shell when online but the app
//    still boots normally when fully offline.
//  - Everything else: try the network, fall back to cache if present.
//
// Bump CACHE_VERSION whenever you want to force old caches to be cleared on
// next activate (e.g. after significant asset changes).
//
// IMPORTANT LESSON LEARNED (bug fixed in v6): the v1.2.0 brand-kit overhaul
// replaced public/assets/logo.png and the favicon/icon files in place
// (same filenames, new pixel content) but did NOT bump CACHE_VERSION. Since
// those files are served cache-first (see isBuildAsset/CORE_ASSETS below),
// every browser that had already installed/visited the app before that
// release kept serving its old cached copy of the logo/icons indefinitely -
// the new files on the server were never fetched because a cache hit always
// wins. Filename-stable static assets (unlike the content-hashed JS/CSS
// bundle) MUST be accompanied by a CACHE_VERSION bump whenever their
// contents change, or returning users will never see the update.
const CACHE_VERSION = 'v6';
const CACHE_NAME = `vox-libera-cache-${CACHE_VERSION}`;

// Core app-shell files that must always be available offline. Hashed build
// assets (JS/CSS) are discovered dynamically at install time (see below)
// since their filenames change on every build.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './robots.txt',
  './assets/logo.png',
  './assets/icons/favicon-16x16.png',
  './assets/icons/favicon-32x32.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/android-chrome-192x192.png',
  './assets/icons/android-chrome-512x512.png',
];

// Fetches index.html and extracts the hashed build asset URLs it
// references (script src + stylesheet href), so we can precache the exact
// JS/CSS bundle this build produced - without hardcoding filenames that
// change on every build.
async function discoverBuildAssetUrls() {
  try {
    const response = await fetch('./index.html', { cache: 'no-store' });
    const html = await response.text();
    const urls = new Set();
    // <script ... src="/assets/index-XXXX.js" ...>
    const scriptRe = /<script[^>]+src=["']([^"']+)["']/g;
    // <link ... rel="stylesheet" ... href="/assets/index-XXXX.css" ...>
    const linkRe = /<link[^>]+href=["']([^"']+)["'][^>]*>/g;
    let match;
    while ((match = scriptRe.exec(html))) urls.add(match[1]);
    while ((match = linkRe.exec(html))) {
      // Only cache stylesheet/module-preload links, not e.g. the manifest
      // (which is already in CORE_ASSETS) or external icon links.
      const tag = html.slice(Math.max(0, match.index - 20), match.index + match[0].length);
      if (/rel=["'](stylesheet|modulepreload)["']/.test(tag)) urls.add(match[1]);
    }
    return Array.from(urls);
  } catch (err) {
    console.warn('[SW] Failed to discover build assets from index.html', err);
    return [];
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const buildAssetUrls = await discoverBuildAssetUrls();
      const allAssets = [...CORE_ASSETS, ...buildAssetUrls];
      // Use individual add() calls with catch so a single missing file
      // (e.g. during local dev) doesn't fail the entire install step.
      await Promise.all(
        allAssets.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Failed to precache', url, err))
        )
      );
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

const isBuildAsset = (url) => url.pathname.startsWith('/assets/');
const isNavigationRequest = (request) =>
  request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests; let everything else (POST, etc.) pass through.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore cross-origin requests entirely (e.g. any third-party calls) so
  // this service worker never accidentally caches or blocks external APIs.
  if (url.origin !== self.location.origin) return;

  // version.json is the update-check probe (see utils/updateCheck.ts) - it
  // must always hit the network directly, never the cache, or a stale
  // cached copy could permanently hide real updates (or the reverse: show a
  // phantom update for a version the user already has). Let the browser
  // handle it untouched.
  if (url.pathname.endsWith('/version.json')) return;

  if (isNavigationRequest(request)) {
    // Network-first for the SPA shell so users get updates when online,
    // but always fall back to the cached shell when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
          return response;
        })
        .catch(() => caches.match('./index.html').then((res) => res || caches.match('./')))
    );
    return;
  }

  if (isBuildAsset(url) || CORE_ASSETS.some((asset) => url.pathname.endsWith(asset.replace('./', '/')))) {
    // Cache-first for fingerprinted build output and known static assets.
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Default: network-first, falling back to cache when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
