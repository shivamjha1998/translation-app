import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { translateText } from '../services';

export interface TranslationParams {
    text: string;
    targetLang: 'English' | 'Japanese';
}

export const useTranslation = (): UseMutationResult<string, Error, TranslationParams, unknown> => {
    return useMutation<string, Error, TranslationParams, unknown>({
        mutationFn: ({ text, targetLang }: TranslationParams) =>
            translateText(text, targetLang),
    });
};