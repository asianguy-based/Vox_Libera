// Single source of truth for the app's current version. This value is
// baked into the JS bundle at build time, so a browser running an OLDER
// cached bundle will always have an OLDER APP_VERSION in memory than
// whatever is currently deployed.
//
// IMPORTANT: bump this string on every release that you want users with an
// already-installed/cached copy to be notified about, and ALWAYS bump
// public/version.json to the exact same value in the same commit - that
// file is fetched fresh (no-store) at runtime and is what lets a running
// (possibly stale) copy of the app detect that a newer version exists on
// the server. If the two ever get out of sync, the update-available popup
// will misbehave (either never firing, or firing on every load).
//
// Use plain semantic-ish versioning: MAJOR.MINOR.PATCH (e.g. "1.2.0").
export const APP_VERSION = '1.1.0';
