import React from 'react';
import { LogBox } from 'react-native';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Suppress Reanimated warning
LogBox.ignoreLogs([
  "[Reanimated] Reduced motion setting is enabled",
]);

import { AuthProvider } from '@/contexts/AuthContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider } from '@drivewise/core';
import { supabase } from '@/lib/supabase';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SupabaseProvider client={supabase}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <CategoryProvider>
                  <RootNavigator />
                </CategoryProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SupabaseProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
