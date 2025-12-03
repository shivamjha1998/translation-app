import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { File } from 'expo-file-system';
import { transcribeAudio } from '../services/elevenlabs/stt';

export const useVoiceRecording = () => {
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const lastUriRef = useRef<string | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    // Cleanup function
    const cleanupLastRecording = useCallback(async () => {
        if (lastUriRef.current) {
            try {
                const file = new File(lastUriRef.current);

                if (file.exists) {
                    await file.delete();
                }
            } catch (error) {
                console.warn('Failed to delete audio file', error);
            }
            lastUriRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanupLastRecording();
        };
    }, [cleanupLastRecording]);

    const startRecording = async () => {
        try {
            await cleanupLastRecording();
            setError(null);
            setTranscription(null);

            if (permissionResponse?.status !== 'granted') {
                const permission = await requestPermission();
                if (permission.status !== 'granted') {
                    setError('Permission to access microphone was denied');
                    return;
                }
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
            setError('Failed to start recording');
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setRecording(undefined);

        if (!recording) return null; // Ensure return type consistency

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            if (uri) {
                lastUriRef.current = uri;
                setIsTranscribing(true);
                const text = await transcribeAudio(uri);
                setTranscription(text);
                return uri;
            }
            return null;
        } catch (err) {
            console.error('Failed to stop recording or transcribe', err);
            setError('Failed to process audio');
            return null;
        } finally {
            setIsTranscribing(false);
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });
        }
    };

    return {
        startRecording,
        stopRecording,
        isRecording,
        isTranscribing,
        transcription,
        error,
    };
};