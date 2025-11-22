'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { toast } from 'sonner';

interface UserProfile {
  full_name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initialized, setInitialized] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const queryClient = useQueryClient();

  const checkIfBlocked = useCallback(
    async (userId: string, skipProfileUpdate = false): Promise<boolean> => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_blocked, full_name, email')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return false;
        }

        if (data && !skipProfileUpdate) {
          setUserProfile({
            full_name: data.full_name,
            email: data.email,
          });
        }

        return !!data?.is_blocked;
      } catch (error) {
        console.error('Error checking user status:', error);
        return false;
      }
    },
    [supabase]
  );

  const handleBlockedAccount = useCallback(async () => {
    setIsBlocked(true);
    setUser(null);
    setUserProfile(null);

    // Clear client cache as well so UI is fully reset
    queryClient.clear();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during signOut for blocked user:', error);
    }

    toast.error('Account Blocked', {
      description: 'Your account has been blocked. Please contact support.',
      duration: 5000,
    });

    // Replace to avoid weird back-navigation into blocked state
    router.replace('/');
  }, [router, supabase, queryClient]);

  useEffect(() => {
    if (initialized) return;

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(user);
        setLoading(false);
        setInitialized(true);

        if (!user) {
          setUserProfile(null);
          setIsBlocked(false);
          return;
        }

        const blocked = await checkIfBlocked(user.id);

        if (!mounted) return;

        setIsBlocked(blocked);

        if (blocked) {
          await handleBlockedAccount();
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setIsBlocked(false);
        setLoading(false);
        queryClient.clear();
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        setUserProfile(null);
        setIsBlocked(false);
        queryClient.clear();
        return;
      }

      // Auth state changed to a non-null user (e.g. login, email confirm, token refresh).
      // Invalidate queries so they refetch with the new authenticated session.
      queryClient.invalidateQueries();

      const blocked = await checkIfBlocked(currentUser.id);

      if (!mounted) return;

      setIsBlocked(blocked);

      if (blocked) {
        await handleBlockedAccount();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router, checkIfBlocked, handleBlockedAccount, initialized, queryClient]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error(
              'Account does not exist or password is incorrect. Please check your credentials or sign up.'
            );
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email address before logging in.');
          } else {
            throw error;
          }
        }

        if (data.user) {
          // Clear any stale data from previous session / anon state
          queryClient.clear();

          setUser(data.user);
          setLoading(false);

          // Immediately check blocked status
          const blocked = await checkIfBlocked(data.user.id);

          setIsBlocked(blocked);

          if (blocked) {
            await handleBlockedAccount();
            return {
              error: new Error(
                'Your account has been blocked. Please contact support for more information.'
              ),
            };
          }

          // Force all queries to refetch now that auth changed
          queryClient.invalidateQueries();

          // Make sure server components see the new session
          router.refresh();
        }

        return { error: null };
      } catch (err: unknown) {
        return { error: err as Error };
      }
    },
    [supabase, router, checkIfBlocked, handleBlockedAccount, queryClient]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('email', email.trim())
          .maybeSingle();

        if (existingUser) {
          throw new Error('An account with this email already exists. Please log in instead.');
        }

        const emailRedirectTo =
          typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('An account with this email already exists. Please log in instead.');
          } else if (error.message.includes('Password should be at least')) {
            throw new Error('Password must be at least 6 characters long.');
          } else {
            throw error;
          }
        }

        return { error: null };
      } catch (err: unknown) {
        return { error: err as Error };
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    // Clear local state + React Query immediately so the UI
    // reflects a logged-out state without waiting for Supabase
    // network calls to complete.
    setUser(null);
    setUserProfile(null);
    setIsBlocked(false);
    queryClient.clear();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (innerError) {
        console.error('Error clearing local Supabase session:', innerError);
      }
    } finally {
      try {
        router.refresh();
      } catch (err) {
        console.error('Error refreshing router after signOut:', err);
      }

      try {
        router.push('/');
      } catch (err) {
        console.error('Error redirecting after signOut:', err);
      }
    }
  }, [supabase, router, queryClient]);

  const refreshUser = useCallback(
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const blocked = await checkIfBlocked(user.id);
        setIsBlocked(blocked);

        if (blocked) {
          await handleBlockedAccount();
        }
      } else {
        setUserProfile(null);
        setIsBlocked(false);
        queryClient.clear();
      }
    },
    [supabase, checkIfBlocked, handleBlockedAccount, queryClient]
  );

  const isUserAdmin = useMemo(() => (user ? isAdmin(user.id) : false), [user]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAdmin: isUserAdmin,
      isBlocked,
      userProfile,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, loading, isUserAdmin, isBlocked, userProfile, signIn, signUp, signOut, refreshUser]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
