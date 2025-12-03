import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';

export const useVoiceRecording = () => {
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const startRecording = useCallback(async () => {
        try {
            if (permissionResponse?.status !== 'granted') {
                const permission = await requestPermission();
                if (permission.status !== 'granted') return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, [permissionResponse, requestPermission]);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        setIsRecording(false);
        setRecording(undefined);

        if (!recording) return null;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Reset mode for playback
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });

            return uri;
        } catch (err) {
            console.error('Failed to stop recording', err);
            return null;
        }
    }, [recording]);

    return {
        startRecording,
        stopRecording,
        isRecording,
    };
};