import { useMutation } from '@tanstack/react-query';
import { translateText } from '../services';

interface TranslationParams {
    text: string;
    targetLang: 'English' | 'Japanese';
}

export const useTranslation = () => {
    return useMutation({
        mutationFn: ({ text, targetLang }: TranslationParams) =>
            translateText(text, targetLang),
    });
};