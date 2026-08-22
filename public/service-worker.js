// Vox Libera Service Worker
// Goal: TRUE offline access. Once a user has loaded the app once, it should
// keep working with no network connection at all - including the app shell,
// the compiled JS/CSS bundle, the manifest, and all icon/logo images.
//
// Strategy:
//  - App shell + hashed build assets (JS/CSS/images under /assets/):
//    cache-first, since Vite fingerprints these filenames on every build,
//    so a cached copy is always safe to reuse and a new deploy naturally
//    gets new filenames (cache-busting is automatic).
//  - Navigation requests (the SPA's index.html): network-first with a
//    cache fallback, so users get the latest shell when online but the app
//    still boots normally when fully offline.
//  - Everything else: try the network, fall back to cache if present.
//
// Bump CACHE_VERSION whenever you want to force old caches to be cleared on
// next activate (e.g. after significant asset changes).
const CACHE_VERSION = 'v4';
const CACHE_NAME = `vox-libera-cache-${CACHE_VERSION}`;

// Core app-shell files that must always be available offline, even before
// the browser has a chance to discover the hashed build assets by request.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './assets/logo.png',
  './assets/icons/favicon-16x16.png',
  './assets/icons/favicon-32x32.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/android-chrome-192x192.png',
  './assets/icons/android-chrome-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use individual add() calls with catch so a single missing file
      // (e.g. during local dev) doesn't fail the entire install step.
      return Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Failed to precache', url, err))
        )
      );
    })
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
