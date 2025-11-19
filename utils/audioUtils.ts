
let audioContextInstance: AudioContext | null = null;

// Use a singleton pattern for the AudioContext to prevent issues.
const getAudioContext = (): AudioContext => {
    if (!audioContextInstance) {
        // FIX: Cast window to `any` to access vendor-prefixed `webkitAudioContext` for older browser compatibility.
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
            throw new Error("Your browser does not support the Web Audio API.");
        }
        audioContextInstance = new AudioContext({ sampleRate: 24000 });
    }
    return audioContextInstance;
};


function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playAudio = async (base64Audio: string, onEnded: () => void, playbackRate: number = 1.0): Promise<void> => {
    try {
        const OutputAudioContext = getAudioContext();
        if (OutputAudioContext.state === 'suspended') {
            await OutputAudioContext.resume();
        }

        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, OutputAudioContext, 24000, 1);
        
        const source = OutputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        // Set playback rate to shift pitch (1.0 is normal, >1.0 is higher/faster, <1.0 is lower/slower)
        source.playbackRate.value = playbackRate;
        
        source.connect(OutputAudioContext.destination);
        source.start();

        source.onended = () => {
            onEnded();
        };

    } catch (error) {
        console.error("Failed to play audio:", error);
        onEnded(); // Ensure state is reset even on error
    }
};

export const playAttentionSound = async (): Promise<void> => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        
        // Ding-Dong effect
        // First tone (higher)
        oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        
        // Second tone (lower)
        oscillator.frequency.setValueAtTime(550, ctx.currentTime + 0.3); // C#5
        gainNode.gain.setTargetAtTime(0, ctx.currentTime + 0.3, 0.5); // Fade out

        oscillator.start();
        oscillator.stop(ctx.currentTime + 1.5);

    } catch (error) {
        console.error("Failed to play attention sound:", error);
    }
};

// --- Recording Utilities ---

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const recorderUtils = {
    startRecording: async (): Promise<void> => {
        audioChunks = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.start();
        } catch (err) {
            console.error("Error starting recording:", err);
            throw err;
        }
    },

    stopRecording: (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            if (!mediaRecorder) {
                reject("No recording in progress");
                return;
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Or audio/mp4 depending on browser support
                // Stop all tracks to release microphone
                mediaRecorder?.stream.getTracks().forEach(track => track.stop());
                mediaRecorder = null;
                resolve(audioBlob);
            };

            mediaRecorder.stop();
        });
    }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
