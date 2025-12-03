import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { theme } from '../utils/theme';

interface TranslationInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({
    value,
    onChangeText,
    placeholder,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Input</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Text input for translation"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.m,
        flex: 1, // Allow it to expand
    },
    label: {
        ...theme.typography.label,
        marginBottom: theme.spacing.s,
        marginLeft: theme.spacing.xs,
    },
    input: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        fontSize: 18,
        height: '100%', // Take available space
        minHeight: 120,
        borderWidth: 1,
        borderColor: 'transparent',
    },
});