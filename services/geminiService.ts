
import { LANGUAGES, Language } from '../types';

export const generateSpeech = async (text: string, voiceName: string = 'Kore', languageCode: Language = 'en'): Promise<string | null> => {
  try {
    const { GoogleGenAI, Modality } = await import("@google/genai");

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable is not set");
      throw new Error("API key is missing. Please configure it to use the speech service.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // Map language code to voice locale (e.g., 'es' -> 'es-ES') if needed by backend, 
    // but for now 'text' is main driver. Some TTS engines infer lang from text or voiceName.
    // We can try to instruct the model via the text prompt or config if supported, 
    // but Gemini TTS model inference is usually robust. 
    // However, using specific prompts helps.
    
    // NOTE: Gemini 2.5 Flash TTS Preview currently works best by just sending text.
    // Advanced language forcing isn't strictly documented yet outside of VoiceConfig.
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error generating speech with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating speech.");
  }
};
