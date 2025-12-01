import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeColors } from './colors';

const THEME_STORAGE_KEY = 'app_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  /** Current theme mode setting (light/dark/system) */
  themeMode: ThemeMode;
  /** Set the theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Whether dark mode is currently active */
  isDark: boolean;
  /** Current theme colors */
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Get system color scheme
  const systemColorScheme = Appearance.getColorScheme();

  // Calculate if dark mode is active
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Get current theme colors
  const colors = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
          
          // Sync with NativeWind
          if (savedTheme === 'system') {
            setColorScheme('system');
          } else {
            setColorScheme(savedTheme as 'light' | 'dark');
          }
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadTheme();
  }, [setColorScheme]);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (themeMode === 'system') {
        // NativeWind handles this automatically when set to 'system'
        // We just need to trigger a re-render for our context
        setThemeModeState((prev) => prev); // Force update
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  // Set theme mode with persistence
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    
    // Sync with NativeWind
    if (mode === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(mode);
    }
    
    // Persist preference
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [setColorScheme]);

  const value = useMemo(() => ({
    themeMode,
    setThemeMode,
    isDark,
    colors,
  }), [themeMode, setThemeMode, isDark, colors]);

  // Don't block rendering while loading - just use default theme
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
