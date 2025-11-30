import React from 'react';
import { LogBox, View } from 'react-native';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";

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

import { AuthProvider } from '@/contexts/AuthContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider } from '@drivewise/core';
import { supabase } from '@/lib/supabase';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();
  const { loading: authLoading } = useAuth();
  const { loading: categoryLoading } = useCategory();

  if (authLoading || categoryLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
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
