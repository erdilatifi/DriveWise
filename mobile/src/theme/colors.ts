/**
 * Centralized Color Tokens
 * All app colors defined in one place - DO NOT add inline colors elsewhere
 */

export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#4f46e5', // Indigo
    light: '#6366f1',
    dark: '#4338ca',
    foreground: '#ffffff',
  },
  
  // Secondary/Accent colors
  accent: {
    pink: '#ce76c9',
    purple: '#a855f7',
  },

  // Neutral colors (used for backgrounds, borders, text)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic colors
  success: {
    light: '#dcfce7',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#e0f2fe',
    DEFAULT: '#0ea5e9',
    dark: '#0284c7',
  },

  // Special
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Light theme color mappings
export const lightTheme = {
  background: colors.white,
  backgroundSecondary: colors.slate[50],
  surface: colors.white,
  surfaceSecondary: colors.slate[50],
  
  text: colors.slate[900],
  textSecondary: colors.slate[500],
  textMuted: colors.slate[400],
  
  border: colors.slate[100],
  borderSecondary: colors.slate[200],
  
  primary: colors.primary.DEFAULT,
  primaryForeground: colors.primary.foreground,
  
  // Navigation bar
  tabBar: colors.slate[50],
  tabBarBorder: colors.slate[200],
  tabBarActive: colors.primary.DEFAULT,
  tabBarInactive: colors.slate[400],
  
  // Status bar
  statusBarStyle: 'dark' as const,
} as const;

// Dark theme color mappings
export const darkTheme = {
  background: colors.slate[950],
  backgroundSecondary: colors.slate[900],
  surface: colors.slate[900],
  surfaceSecondary: colors.slate[800],
  
  text: colors.white,
  textSecondary: colors.slate[400],
  textMuted: colors.slate[500],
  
  border: colors.slate[800],
  borderSecondary: colors.slate[700],
  
  primary: colors.primary.DEFAULT,
  primaryForeground: colors.primary.foreground,
  
  // Navigation bar
  tabBar: colors.slate[800],
  tabBarBorder: colors.slate[700],
  tabBarActive: colors.primary.DEFAULT,
  tabBarInactive: colors.slate[500],
  
  // Status bar
  statusBarStyle: 'light' as const,
} as const;

// Base type that represents the shape of theme colors (both light and dark)
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSecondary: string;
  primary: string;
  primaryForeground: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBarStyle: 'light' | 'dark';
}
