import { useMutation } from '@tanstack/react-query';
import { transcribeAudio } from '../services';

export const useTranscription = () => {
    return useMutation({
        mutationFn: (uri: string) => transcribeAudio(uri),
    });
};