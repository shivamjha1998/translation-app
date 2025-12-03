import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { generateAudio } from '../services/elevenlabs/client';

export const useTextToSpeech = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playAudio = async (text: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const audioUri = await generateAudio(text);

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );

            setSound(newSound);
        } catch (err) {
            setError('Failed to generate or play audio.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { playAudio, isLoading, error };
};
