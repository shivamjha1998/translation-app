import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Volume2, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../utils/theme';

interface TranslationOutputProps {
    text: string;
    onPlayAudio: () => void;
    isAudioLoading: boolean;
}

export const TranslationOutput: React.FC<TranslationOutputProps> = ({
    text,
    onPlayAudio,
    isAudioLoading,
}) => {
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(text);
    };

    if (!text) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Translation</Text>
            <View style={styles.outputContainer}>
                <Text style={styles.text}>{text}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.actionButton}>
                        <Copy color={theme.colors.textSecondary} size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onPlayAudio}
                        style={[styles.actionButton, styles.playButton]}
                        disabled={isAudioLoading}
                    >
                        {isAudioLoading ? (
                            <ActivityIndicator size="small" color={theme.colors.text} />
                        ) : (
                            <Volume2 color={theme.colors.text} size={20} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: theme.spacing.m,
    },
    label: {
        ...theme.typography.label,
        marginBottom: theme.spacing.s,
        marginLeft: theme.spacing.xs,
    },
    outputContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    text: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '500',
        marginBottom: theme.spacing.l,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing.s,
    },
    actionButton: {
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.background,
    },
    playButton: {
        backgroundColor: theme.colors.primary,
    },
});
