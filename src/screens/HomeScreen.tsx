import React, { useState, useCallback, useEffect } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Text, ActivityIndicator,
    Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Mic, Trash2 } from 'lucide-react-native';

import { LanguageToggle } from '../components/LanguageToggle';
import { TranslationInput } from '../components/TranslationInput';
import { TranslationOutput } from '../components/TranslationOutput';

import { useTranslation } from '../hooks/useTranslation';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { useTranscription } from '../hooks/useTranscription';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../utils/theme';

export const HomeScreen = () => {
    const [sourceLanguage, setSourceLanguage] = useState<'English' | 'Japanese'>('English');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    useAppState(() => {
        setInputText('');
        setTranslatedText('');
    });

    const { mutateAsync: translateFunc, isPending: isTranslating, error: translationError } = useTranslation();

    const { playAudio, isLoading: isAudioLoading, error: audioError } = useTextToSpeech();

    const {
        startRecording,
        stopRecording,
        isRecording,
        transcription: localTranscription,
        error: recordingError
    } = useVoiceRecording();

    const { mutate: transcribe, isPending: isTranscribing, error: transcriptionError, data: transcriptionData } = useTranscription();

    useEffect(() => {
        if (transcriptionData) {
            setInputText(transcriptionData);
        }
    }, [transcriptionData]);

    const handleToggleLanguage = useCallback(() => {
        setSourceLanguage(prev => prev === 'English' ? 'Japanese' : 'English');
        setInputText('');
        setTranslatedText('');
    }, []);

    const handleClear = () => {
        setInputText('');
        setTranslatedText('');
        Keyboard.dismiss();
    };

    const handleTranslate = useCallback(async () => {
        if (!inputText.trim()) return;
        Keyboard.dismiss();

        try {
            const targetLang = sourceLanguage === 'English' ? 'Japanese' : 'English';
            const result = await translateFunc({ text: inputText, targetLang });
            setTranslatedText(result);
        } catch (error) {
            console.error(error);
        }
    }, [inputText, sourceLanguage, translateFunc]);

    const handleMicPress = useCallback(async () => {
        if (isRecording) {
            const uri = await stopRecording();
            if (uri !== null && uri !== undefined && typeof uri === 'string') {
                transcribe(uri);
            }
        } else {
            await startRecording();
        }
    }, [isRecording, startRecording, stopRecording, transcribe]);

    const combinedError =
        (translationError as Error)?.message ||
        (audioError as string) ||
        (recordingError as string) ||
        (transcriptionError as Error)?.message;

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
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>Translator</Text>
                                {(inputText !== '' || translatedText !== '') && (
                                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                                        <Trash2 color={theme.colors.textSecondary} size={20} />
                                    </TouchableOpacity>
                                )}
                            </View>

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

                            {/* Fix 2 usage: Render the string, not the object */}
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.l,
        marginTop: theme.spacing.s,
        position: 'relative',
    },
    title: {
        ...theme.typography.header,
        textAlign: 'center',
    },
    clearButton: {
        position: 'absolute',
        right: 0,
        padding: 8,
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