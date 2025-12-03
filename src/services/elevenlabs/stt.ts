import axios from 'axios';
import { AI_CONFIG } from '../../config/ai-config';

interface RNFile {
    uri: string;
    type: string;
    name: string;
}

export const transcribeAudio = async (uri: string): Promise<string> => {
    const apiKey = AI_CONFIG.ELEVENLABS.API_KEY;
    if (!apiKey) throw new Error('ElevenLabs API key is missing');

    const formData = new FormData();

    const file: RNFile = {
        uri: uri,
        type: 'audio/m4a',
        name: 'audio.m4a',
    };

    formData.append('file', file as unknown as Blob);
    formData.append('model_id', AI_CONFIG.ELEVENLABS.STT_MODEL_ID);

    const response = await axios.post(
        AI_CONFIG.ELEVENLABS.STT_URL,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'xi-api-key': apiKey,
            },
        }
    );

    return response.data.text;
};