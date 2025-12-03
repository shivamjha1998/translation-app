import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to handle app state changes (active, background, inactive)
 * @param onBackground - Callback function to run when app goes to background
 */
export const useAppState = (onBackground?: () => void) => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                // App moved to background
                if (onBackground) {
                    onBackground();
                }
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, [onBackground]);

    return appStateVisible;
};