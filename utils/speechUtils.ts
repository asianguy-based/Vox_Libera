
// Native browser Text-to-Speech utilities using the Web Speech API.
// This replaces the previous Gemini-API-based speech generation, removing
// the need for an API key and any per-use cost. Voices come directly from
// the user's own device/OS (e.g. Chrome, Safari, Edge, Android, iOS voices).

export interface SpeakOptions {
  voiceURI?: string; // SpeechSynthesisVoice.voiceURI of the preferred voice
  lang?: string;      // BCP-47 language code, e.g. 'en-US'
  pitch?: number;     // 0 to 2, default 1
  rate?: number;      // 0.1 to 10, default 1
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Warm up the engine as soon as this module loads. On Chrome/Chromium,
// calling getVoices() once early "primes" the async voice list population;
// without an early call some browsers never populate voices until something
// touches the API. This runs once per page load, well before any modal opens.
if (isSpeechSynthesisSupported()) {
  const initial = window.speechSynthesis.getVoices();
  if (initial.length > 0) {
    cachedVoices = initial;
  }
}

/**
 * Loads the list of available system voices. Some browsers (notably Chrome)
 * populate voices asynchronously and can take longer than a single event
 * cycle, so this polls getVoices() repeatedly for a few seconds in addition
 * to listening for the 'voiceschanged' event, instead of giving up after one
 * short timeout. This fixes cases where voices show up ~1-3s after the page
 * loads (common on Android/embedded WebViews) and previously left the voice
 * dropdown permanently empty for that session.
 */
export const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }

    let resolved = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let giveUpTimer: ReturnType<typeof setTimeout> | null = null;

    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (resolved) return;
      resolved = true;
      if (voices.length > 0) {
        cachedVoices = voices;
      }
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
      if (pollTimer) clearInterval(pollTimer);
      if (giveUpTimer) clearTimeout(giveUpTimer);
      resolve(voices);
    };

    const handleVoicesChanged = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        finish(voices);
      }
    };

    synth.addEventListener('voiceschanged', handleVoicesChanged);

    // Poll every 300ms in case 'voiceschanged' never fires but the browser
    // eventually populates the list anyway (happens on some browsers/WebViews).
    pollTimer = setInterval(() => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        finish(voices);
      }
    }, 300);

    // Give up after 4s total and resolve with whatever we have (possibly
    // empty) so the UI doesn't hang forever - "Device Default" still works.
    giveUpTimer = setTimeout(() => {
      finish(synth.getVoices());
    }, 4000);
  });
};

export const getCachedVoices = (): SpeechSynthesisVoice[] => cachedVoices;

/**
 * Subscribes to voice list updates: immediately invokes `callback` with
 * whatever voices are currently available, then keeps calling it again
 * whenever the list changes (via 'voiceschanged') or as new voices are
 * discovered via polling - unlike loadVoices(), this does NOT stop after
 * one resolution, so a UI (like the Settings voice dropdown) that stays
 * open while voices are still loading will update reactively instead of
 * staying stuck with an empty list. Returns an unsubscribe function.
 */
export const subscribeToVoices = (
  callback: (voices: SpeechSynthesisVoice[]) => void
): (() => void) => {
  if (!isSpeechSynthesisSupported()) {
    callback([]);
    return () => {};
  }

  const synth = window.speechSynthesis;
  let lastCount = 0;

  const emitIfChanged = (voices: SpeechSynthesisVoice[]) => {
    if (voices.length > 0 && voices.length !== lastCount) {
      lastCount = voices.length;
      cachedVoices = voices;
      callback(voices);
    }
  };

  // Emit immediately with whatever is available right now (may be empty).
  const initial = synth.getVoices();
  if (initial.length > 0) {
    lastCount = initial.length;
    cachedVoices = initial;
  }
  callback(initial);

  const handleVoicesChanged = () => emitIfChanged(synth.getVoices());
  synth.addEventListener('voiceschanged', handleVoicesChanged);

  // Also poll for up to ~5s in case 'voiceschanged' never fires on this
  // browser/device but the list still populates asynchronously.
  let ticks = 0;
  const pollTimer = setInterval(() => {
    ticks += 1;
    emitIfChanged(synth.getVoices());
    if (ticks >= 16) clearInterval(pollTimer); // ~16 * 300ms = ~4.8s
  }, 300);

  return () => {
    synth.removeEventListener('voiceschanged', handleVoicesChanged);
    clearInterval(pollTimer);
  };
};

/**
 * Picks the best matching voice for a given language + preferred voiceURI.
 * Falls back gracefully: exact voiceURI match -> exact lang match ->
 * lang-prefix match -> undefined (browser default voice).
 */
export const findBestVoice = (
  voices: SpeechSynthesisVoice[],
  voiceURI?: string,
  lang?: string
): SpeechSynthesisVoice | undefined => {
  if (voiceURI) {
    const exact = voices.find((v) => v.voiceURI === voiceURI);
    if (exact) return exact;
  }
  if (lang) {
    const exactLang = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exactLang) return exactLang;

    const prefix = lang.split('-')[0].toLowerCase();
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;
  }
  return undefined;
};

/**
 * Speaks the given text using the browser's built-in speech synthesis.
 * Cancels any speech currently in progress before starting.
 */
export const speakText = (
  text: string,
  options: SpeakOptions,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (message: string) => void
): void => {
  if (!isSpeechSynthesisSupported()) {
    onError?.('Text-to-speech is not supported on this device/browser.');
    return;
  }

  const synth = window.speechSynthesis;
  // Cancel anything currently speaking/queued so buttons feel responsive.
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const voice = findBestVoice(cachedVoices, options.voiceURI, options.lang);
  if (voice) {
    utterance.voice = voice;
  }
  if (options.lang) {
    utterance.lang = options.lang;
  }
  utterance.pitch = options.pitch ?? 1;
  utterance.rate = options.rate ?? 1;
  utterance.volume = 1;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (event) => {
    // "interrupted" / "canceled" happen normally when we call synth.cancel()
    // to stop overlapping speech - don't treat those as user-facing errors.
    const errorType = (event as SpeechSynthesisErrorEvent).error;
    if (errorType !== 'interrupted' && errorType !== 'canceled') {
      onError?.('Could not play speech. Please try again.');
    }
    onEnd?.();
  };

  synth.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
