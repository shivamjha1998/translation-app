import axios from 'axios';
import { ChatCompletionResponse } from './types';

const EXPO_PUBLIC_OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const translateText = async (
    text: string,
    targetLanguage: 'English' | 'Japanese'
): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OpenAI API key is missing');
    }

    const systemPrompt = `You are a professional translator. Translate the following text to ${targetLanguage}. Only provide the translation, no explanations.`;

    try {
        const response = await axios.post<ChatCompletionResponse>(
            EXPO_PUBLIC_OPENAI_API_URL,
            {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text },
                ],
                temperature: 0.3,
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
