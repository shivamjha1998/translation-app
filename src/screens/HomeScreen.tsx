import React, { useState, useCallback, useEffect } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Text, ActivityIndicator,
    Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Mic } from 'lucide-react-native';

import { LanguageToggle } from '../components/LanguageToggle';
import { TranslationInput } from '../components/TranslationInput';
import { TranslationOutput } from '../components/TranslationOutput';

import { useTranslation } from '../hooks/useTranslation';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { useTranscription } from '../hooks/useTranscription';
import { theme } from '../utils/theme';

export const HomeScreen = () => {
    const [sourceLanguage, setSourceLanguage] = useState<'English' | 'Japanese'>('English');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    // Hooks
    const { mutateAsync: translate, isPending: isTranslating, error: translationError } = useTranslation();
    const { playAudio, isLoading: isAudioLoading, error: audioError } = useTextToSpeech();
    const { startRecording, stopRecording, isRecording } = useVoiceRecording();
    const { mutate: transcribe, isPending: isTranscribing, error: recordingError, data: transcription } = useTranscription();

    // Effect: Update input when transcription finishes
    useEffect(() => {
        if (transcription) {
            setInputText(transcription);
        }
    }, [transcription]);

    // Handlers
    const handleToggleLanguage = useCallback(() => {
        setSourceLanguage(prev => prev === 'English' ? 'Japanese' : 'English');
        setInputText('');
        setTranslatedText('');
    }, []);

    const handleTranslate = useCallback(async () => {
        if (!inputText.trim()) return;
        Keyboard.dismiss();

        try {
            const targetLang = sourceLanguage === 'English' ? 'Japanese' : 'English';
            const result = await translate({ text: inputText, targetLang });
            setTranslatedText(result);
        } catch (error) {
            // Error is handled by the hook state
        }
    }, [inputText, sourceLanguage, translate]);

    const handleMicPress = useCallback(async () => {
        if (isRecording) {
            const uri = await stopRecording();
            if (uri) {
                transcribe(uri);
            }
        } else {
            await startRecording();
        }
    }, [isRecording, startRecording, stopRecording, transcribe]);

    const combinedError = translationError?.message || audioError || recordingError?.message;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={[theme.colors.background, '#1e1b4b']}
                    style={styles.background}
                />

                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={styles.content}>
                            <Text style={styles.title}>Translator</Text>

                            <LanguageToggle
                                sourceLanguage={sourceLanguage}
                                onToggle={handleToggleLanguage}
                            />

                            <TranslationInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder={sourceLanguage === 'English' ? 'Enter text...' : 'テキストを入力...'}
                            />

                            <View style={styles.controlsContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.micButton,
                                        isRecording && styles.micButtonRecording,
                                        isTranscribing && styles.micButtonTranscribing
                                    ]}
                                    onPress={handleMicPress}
                                    disabled={isTranscribing}
                                    accessibilityLabel="Voice input button"
                                    accessibilityState={{ busy: isTranscribing || isRecording }}
                                >
                                    {isTranscribing ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Mic color="#fff" size={24} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.translateButton}
                                onPress={handleTranslate}
                                disabled={isTranslating || !inputText.trim()}
                                accessibilityLabel="Translate text"
                            >
                                {isTranslating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.translateButtonText}>Translate</Text>
                                )}
                            </TouchableOpacity>

                            {combinedError && (
                                <Text style={styles.errorText}>{combinedError}</Text>
                            )}

                            <TranslationOutput
                                text={translatedText}
                                onPlayAudio={() => playAudio(translatedText)}
                                isAudioLoading={isAudioLoading}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.l,
    },
    title: {
        ...theme.typography.header,
        textAlign: 'center',
        marginBottom: theme.spacing.l,
        marginTop: theme.spacing.s,
    },
    translateButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        marginVertical: theme.spacing.m,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    translateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        padding: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 8
    },
    controlsContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    micButton: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    micButtonRecording: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
    },
    micButtonTranscribing: {
        backgroundColor: theme.colors.surface,
        opacity: 0.7,
    },
});