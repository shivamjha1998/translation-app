import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRightLeft } from 'lucide-react-native';
import { theme } from '../utils/theme';

interface LanguageToggleProps {
    sourceLanguage: 'English' | 'Japanese';
    onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
    sourceLanguage,
    onToggle,
}) => {
    const targetLanguage = sourceLanguage === 'English' ? 'Japanese' : 'English';

    return (
        <View style={styles.container}>
            <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{sourceLanguage}</Text>
            </View>

            <TouchableOpacity onPress={onToggle} style={styles.iconContainer}>
                <ArrowRightLeft color={theme.colors.accent} size={24} />
            </TouchableOpacity>

            <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{targetLanguage}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        marginVertical: theme.spacing.m,
    },
    languageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    languageText: {
        ...theme.typography.body,
        fontWeight: '600',
    },
    iconContainer: {
        padding: theme.spacing.s,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.m,
    },
});
