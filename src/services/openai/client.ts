import axios from 'axios';
import { ChatCompletionResponse } from './types';
import { AI_CONFIG } from '../../config/ai-config';

export const translateText = async (
    text: string,
    targetLanguage: 'English' | 'Japanese'
): Promise<string> => {
    const apiKey = AI_CONFIG.OPENAI.API_KEY;
    const apiUrl = AI_CONFIG.OPENAI.API_URL;
    if (!apiKey) {
        throw new Error('OpenAI API key is missing');
    }

    const systemPrompt = AI_CONFIG.OPENAI.SYSTEM_PROMPT(targetLanguage);

    try {
        const response = await axios.post<ChatCompletionResponse>(
            apiUrl,
            {
                model: AI_CONFIG.OPENAI.MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text },
                ],
                temperature: AI_CONFIG.OPENAI.TEMPERATURE,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Translation Error:', error);
        throw error;
    }
};
