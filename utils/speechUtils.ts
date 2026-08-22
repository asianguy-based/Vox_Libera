
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

/**
 * Loads the list of available system voices. Some browsers (notably Chrome)
 * populate voices asynchronously, so this waits for the 'voiceschanged'
 * event if the list isn't ready yet, with a safety timeout fallback.
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
    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (resolved) return;
      resolved = true;
      cachedVoices = voices;
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(voices);
    };

    const handleVoicesChanged = () => {
      finish(synth.getVoices());
    };

    synth.addEventListener('voiceschanged', handleVoicesChanged);

    // Safety fallback in case 'voiceschanged' never fires on this browser.
    setTimeout(() => {
      finish(synth.getVoices());
    }, 1000);
  });
};

export const getCachedVoices = (): SpeechSynthesisVoice[] => cachedVoices;

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
