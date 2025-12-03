import axios from 'axios';
import { Buffer } from 'buffer';

const EXPO_PUBLIC_ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

export const transcribeAudio = async (uri: string): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
        throw new Error('ElevenLabs API key is missing');
    }

    const formData = new FormData();

    formData.append('file', {
        uri: uri,
        type: 'audio/m4a',
        name: 'audio.m4a',
    } as any);

    formData.append('model_id', 'scribe_v1');

    try {
        const response = await axios.post(
            EXPO_PUBLIC_ELEVENLABS_API_URL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'xi-api-key': apiKey,
                },
            }
        );

        return response.data.text;
    } catch (error) {
        console.error('ElevenLabs STT Error:', error);
        throw error;
    }
};
