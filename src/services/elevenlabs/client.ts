import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

const EXPO_PUBLIC_ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Default voices (you might want to make this configurable)
// Rachel (American, calm): 21m00Tcm4TlvDq8ikWAM
// A Japanese voice ID would be ideal if available, otherwise use a generic one or let user pick.
// For now, we'll use a default one.
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export const generateAudio = async (
    text: string,
    voiceId: string = DEFAULT_VOICE_ID
): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
        throw new Error('ElevenLabs API key is missing');
    }

    try {
        const response = await axios.post(
            `${EXPO_PUBLIC_ELEVENLABS_API_URL}/${voiceId}`,
            {
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                responseType: 'arraybuffer', // Important for audio data
            }
        );

        // Convert to base64
        const base64Audio = Buffer.from(response.data, 'binary').toString('base64');
        const audioUri = `data:audio/mpeg;base64,${base64Audio}`;

        // Alternatively, save to file system if file is large, but for short translations data uri is fine.
        return audioUri;
    } catch (error) {
        console.error('ElevenLabs TTS Error:', error);
        throw error;
    }
};
