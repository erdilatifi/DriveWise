import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase, clearSupabaseAuthStorage } from '../lib/supabase';
import { UserProfile } from '@drivewise/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Check if an error is a refresh token error that requires session clear
 */
function isRefreshTokenError(error: AuthError | Error | unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Invalid Refresh Token') ||
    message.includes('Refresh Token Not Found') ||
    message.includes('refresh_token_not_found') ||
    message.includes('invalid_grant')
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  /**
   * Clear all auth state and storage when session is invalid
   */
  const clearAuthState = useCallback(async () => {
    setSession(null);
    setUser(null);
    queryClient.clear();
    // Sign out to clear any corrupted tokens from storage
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // If signOut fails, forcefully clear storage
      await clearSupabaseAuthStorage();
    }
  }, [queryClient]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Handle refresh token errors during initialization
        if (error && isRefreshTokenError(error)) {
          console.warn('Invalid refresh token detected, clearing session');
          await clearAuthState();
          return;
        }
        
        if (error) {
          console.error('Auth initialization error:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If getSession throws (rare), clear state to be safe
        if (isRefreshTokenError(error)) {
          await clearAuthState();
        }
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle token refresh failures
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed, clearing session');
          await clearAuthState();
          setAuthLoading(false);
          return;
        }
        
        // Handle explicit sign out
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          queryClient.setQueryData(['profile'], null);
          queryClient.clear();
          setAuthLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
        
        if (!session) {
          queryClient.setQueryData(['profile'], null);
          queryClient.clear();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, clearAuthState]);

  const { data: profile = null, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as UserProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const signOut = async () => {
    try {
      // Optimistic update
      setSession(null);
      setUser(null);
      queryClient.clear();
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    }
  };

  const loading = authLoading || (!!user && profileLoading);

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin ?? false,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

