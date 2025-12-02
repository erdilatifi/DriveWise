import React, { useEffect, useCallback } from 'react';
import { LogBox, View, Alert } from 'react-native';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';

// Providers
import { AuthProvider } from './src/contexts/AuthContext';
import { CategoryProvider } from './src/contexts/CategoryContext';
import { ThemeProvider, useTheme } from './src/theme';
import { SupabaseProvider } from '@drivewise/core';
import { supabase } from './src/lib/supabase';

// Components
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LoadingScreen } from './src/components/ui/LoadingScreen';
import { NetworkStatus } from './src/components/NetworkStatus';
import { useAuth } from './src/contexts/AuthContext';
import { useCategory } from './src/contexts/CategoryContext';
import { RootStackParamList } from './src/navigation/types';

// Configure 3rd party components for NativeWind
cssInterop(LinearGradient, {
  className: {
    target: "style",
  },
});

// Suppress warnings
LogBox.ignoreLogs([
  "[Reanimated] Reduced motion setting is enabled",
  "SafeAreaView has been deprecated",
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// Deep linking configuration for navigation
const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'drivewise://'],
  config: {
    screens: {
      Login: 'auth/callback', // Auth callback redirects to login screen
      ResetPassword: 'reset-password', // Password reset callback
      App: 'app',
      Register: 'register',
      CategorySelection: 'category',
    },
  },
};

/**
 * Handles the auth callback from deep links (email confirmation)
 * Extracts tokens from URL and exchanges them for a session
 */
async function handleAuthCallback(url: string): Promise<boolean> {
  try {
    // Parse the URL for tokens
    const parsedUrl = Linking.parse(url);
    const params = parsedUrl.queryParams || {};
    
    // Check for access_token and refresh_token in the URL fragment
    // Supabase sends tokens in the URL hash/fragment
    const urlObj = new URL(url.replace('drivewise://', 'https://app.drivewise.com/'));
    const hashParams = new URLSearchParams(urlObj.hash.replace('#', ''));
    
    const accessToken = hashParams.get('access_token') || (params.access_token as string);
    const refreshToken = hashParams.get('refresh_token') || (params.refresh_token as string);
    
    if (accessToken && refreshToken) {
      // Set the session using the tokens from the URL
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (error) {
        console.error('Error setting session from deep link:', error);
        Alert.alert(
          'Gabim',
          'Nuk u arrit të hyhet në llogari. Provoni të hyni manualisht.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      Alert.alert(
        'Sukses!',
        'Email-i u konfirmua. Tani jeni të kyçur në llogari.',
        [{ text: 'OK' }]
      );
      return true;
    }
    
    // Check for error in URL (e.g., expired link)
    const error = hashParams.get('error') || (params.error as string);
    const errorDescription = hashParams.get('error_description') || (params.error_description as string);
    
    if (error) {
      console.error('Auth callback error:', error, errorDescription);
      Alert.alert(
        'Gabim',
        errorDescription || 'Linku i konfirmimit ka skaduar ose është i pavlefshëm.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return false;
  } catch (err) {
    console.error('Error handling auth callback:', err);
    return false;
  }
}

// Inner app content that needs access to contexts
function AppContent() {
  const { colors } = useTheme();
  const { loading: authLoading } = useAuth();
  const { loading: categoryLoading } = useCategory();

  // Handle deep links for auth callbacks
  useEffect(() => {
    // Handle deep link when app is opened from a link
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url && url.includes('auth/callback')) {
        await handleAuthCallback(url);
      }
    };

    // Check if app was opened via a deep link
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && initialUrl.includes('auth/callback')) {
        await handleAuthCallback(initialUrl);
      }
    };

    checkInitialUrl();

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  if (authLoading || categoryLoading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style={colors.statusBarStyle} />
      <RootNavigator />
      <NetworkStatus />
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <SupabaseProvider client={supabase}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <AuthProvider>
                  <CategoryProvider>
                    <AppContent />
                  </CategoryProvider>
                </AuthProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </SupabaseProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
