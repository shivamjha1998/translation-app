import { useState } from 'react';
import { translateText } from '../services/openai/client';

export const useTranslation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const translate = async (text: string, targetLanguage: 'English' | 'Japanese') => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await translateText(text, targetLanguage);
            return result;
        } catch (err) {
            setError('Failed to translate text. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { translate, isLoading, error };
};
