import React from 'react';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { CategoryProvider } from './src/contexts/CategoryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseProvider } from '@drivewise/core';
import { supabase } from './src/lib/supabase';

const queryClient = new QueryClient();

export default function App() {
  return (
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
  );
}
