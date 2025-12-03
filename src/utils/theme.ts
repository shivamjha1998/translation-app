export const theme = {
    colors: {
        background: '#0F172A', // Slate 900
        surface: '#1E293B', // Slate 800
        primary: '#6366F1', // Indigo 500
        secondary: '#8B5CF6', // Violet 500
        text: '#F8FAFC', // Slate 50
        textSecondary: '#94A3B8', // Slate 400
        accent: '#38BDF8', // Sky 400
        error: '#EF4444', // Red 500
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: '700' as const,
            color: '#F8FAFC',
        },
        body: {
            fontSize: 16,
            color: '#F8FAFC',
        },
        label: {
            fontSize: 14,
            color: '#94A3B8',
        },
    },
};
