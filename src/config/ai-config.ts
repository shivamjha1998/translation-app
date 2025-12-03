export const AI_CONFIG = {
    OPENAI: {
        API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        API_URL: 'https://api.openai.com/v1/chat/completions',
        MODEL: 'gpt-4o-mini',
        TEMPERATURE: 0.3,
        SYSTEM_PROMPT: (targetLang: string) =>
            `You are a professional translator. Translate the following text to ${targetLang}. Only provide the translation, no explanations.`,
    },
    ELEVENLABS: {
        API_KEY: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
        // Rachel (American, calm)
        VOICE_ID: '21m00Tcm4TlvDq8ikWAM',
        MODEL_ID: 'eleven_multilingual_v2',
        STT_MODEL_ID: 'scribe_v1',
        STT_URL: 'https://api.elevenlabs.io/v1/speech-to-text',
        TTS_URL: 'https://api.elevenlabs.io/v1/text-to-speech',
    }
};