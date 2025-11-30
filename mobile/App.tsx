import React from 'react';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { CategoryProvider } from './src/contexts/CategoryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider } from '@drivewise/core';
import { supabase } from './src/lib/supabase';
import { ErrorBoundary } from './src/components/ErrorBoundary';

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
            <AuthProvider>
              <CategoryProvider>
                <RootNavigator />
              </CategoryProvider>
            </AuthProvider>
          </QueryClientProvider>
        </SupabaseProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
