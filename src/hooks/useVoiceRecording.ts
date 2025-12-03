import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { transcribeAudio } from '../services/elevenlabs/stt';

export const useVoiceRecording = () => {
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const startRecording = async () => {
        try {
            setError(null);
            setTranscription(null);

            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
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

            console.log('Starting recording..');
            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync({
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                    audioQuality: Audio.IOSAudioQuality.MAX,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 128000,
                },
            });
            setRecording(recording);
            setIsRecording(true);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            setError('Failed to start recording');
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording..');
        setRecording(undefined);
        setIsRecording(false);

        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);

            if (uri) {
                setIsTranscribing(true);
                const text = await transcribeAudio(uri);
                setTranscription(text);
            }
        } catch (err) {
            console.error('Failed to stop recording or transcribe', err);
            setError('Failed to process audio');
        } finally {
            setIsTranscribing(false);
            // Reset audio mode for playback
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
