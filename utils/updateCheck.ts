// Lightweight "is a newer version deployed?" check for a PWA that has no
// app store / auto-update mechanism of its own. The running page's JS
// bundle already has APP_VERSION baked in at build time (see version.ts).
// On launch, we fetch public/version.json fresh from the server (never the
// service worker cache - see the no-cache header + explicit SW bypass) and
// compare it to APP_VERSION. If the server's version is newer, the running
// (possibly cached/offline-installed) copy is out of date.
//
// This NEVER touches localStorage settings/categories/recordings - it is
// purely a read-only version comparison used to show a "there's an update,
// want to refresh?" popup. Refreshing just re-runs the SPA's normal
// network-first navigation fetch + service worker precache of the new
// build; it does not clear or migrate any user data.

export interface VersionInfo {
  version: string;
  notes?: string;
}

/**
 * Compares two "MAJOR.MINOR.PATCH"-style version strings.
 * Returns true if `remote` is strictly newer than `local`.
 * Falls back to a simple string inequality check if either string doesn't
 * parse cleanly as dot-separated numbers, so a malformed version.json can
 * never crash the check - worst case it just won't detect an update.
 */
export const isNewerVersion = (local: string, remote: string): boolean => {
  const parse = (v: string) => v.trim().split('.').map((n) => parseInt(n, 10));
  const a = parse(local);
  const b = parse(remote);

  if (a.some(Number.isNaN) || b.some(Number.isNaN)) {
    return remote.trim() !== local.trim() && remote.trim().length > 0;
  }

  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (bv > av) return true;
    if (bv < av) return false;
  }
  return false;
};

/**
 * Fetches public/version.json (cache-busted + no-store) and reports whether
 * it's newer than the currently running app's version. Fails silently
 * (resolves to null) on any network error, offline state, or malformed
 * response - an update check must never surface an error to the user or
 * block anything else in the app from working.
 */
export const checkForUpdate = async (currentVersion: string): Promise<VersionInfo | null> => {
  try {
    const response = await fetch(`./version.json?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const data = (await response.json()) as Partial<VersionInfo>;
    if (!data || typeof data.version !== 'string') return null;

    if (isNewerVersion(currentVersion, data.version)) {
      return { version: data.version, notes: data.notes };
    }
    return null;
  } catch {
    // Offline, network hiccup, bad JSON, etc. - just skip silently. This is
    // a "nice to have" background check, never something that should
    // interrupt or error out the app.
    return null;
  }
};
