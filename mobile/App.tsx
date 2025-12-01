import React from 'react';
import { LogBox, View } from 'react-native';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

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

// Inner app content that needs access to contexts
function AppContent() {
  const { colors } = useTheme();
  const { loading: authLoading } = useAuth();
  const { loading: categoryLoading } = useCategory();

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
        <NavigationContainer>
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
