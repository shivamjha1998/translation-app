import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Audio } from 'expo-av';
import { generateAudio } from '../services';

export const useTextToSpeech = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // Cleanup sound on unmount or new sound
    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [sound]);

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            const audioUri = await generateAudio(text);

            // Unload previous sound before playing new one
            if (sound) await sound.unloadAsync();

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );
            setSound(newSound);
            return audioUri;
        }
    });

    return {
        playAudio: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error?.message || null
    };
};