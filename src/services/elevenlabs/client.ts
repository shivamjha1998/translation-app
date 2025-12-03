import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { AI_CONFIG } from '../../config/ai-config';

export const generateAudio = async (
    text: string,
    voiceId: string = AI_CONFIG.ELEVENLABS.VOICE_ID
): Promise<string> => {
    const apiKey = AI_CONFIG.ELEVENLABS.API_KEY;
    const apiUrl = AI_CONFIG.ELEVENLABS.TTS_URL;
    if (!apiKey) {
        throw new Error('ElevenLabs API key is missing');
    }

    try {
        const response = await axios.post(
            `${apiUrl}/${voiceId}`,
            {
                text,
                model_id: AI_CONFIG.ELEVENLABS.MODEL_ID,
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
