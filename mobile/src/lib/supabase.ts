import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@drivewise/core';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Storage key used by Supabase for session persistence
const SUPABASE_AUTH_TOKEN_KEY = `sb-${new URL(supabaseUrl || 'https://placeholder.supabase.co').hostname.split('.')[0]}-auth-token`;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Forcefully clear all Supabase auth tokens from storage.
 * Use this when refresh token errors occur and normal signOut fails.
 */
export async function clearSupabaseAuthStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SUPABASE_AUTH_TOKEN_KEY);
    console.log('Cleared Supabase auth storage');
  } catch (error) {
    console.error('Failed to clear Supabase auth storage:', error);
  }
}
