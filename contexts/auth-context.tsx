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
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserProfile {
  full_name?: string;
  email?: string;
  is_blocked?: boolean;
  is_admin?: boolean;
  is_instructor?: boolean;
  subscription_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // True only during initial auth check
  profileLoading: boolean; // True while fetching profile
  isAdmin: boolean;
  isInstructor: boolean;
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
  const [authLoading, setAuthLoading] = useState(true);
  
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Query for User Profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error.message, error.details);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Derived state
  const isAdmin = !!profileData?.is_admin;
  const isInstructor = !!profileData?.is_instructor;
  const isBlocked = !!profileData?.is_blocked;
  const userProfile = profileData ? {
    full_name: profileData.full_name,
    email: profileData.email,
    subscription_id: profileData.subscription_id,
    is_admin: isAdmin,
    is_instructor: isInstructor,
    is_blocked: isBlocked
  } : null;

  const handleBlockedAccount = useCallback(async () => {
    // Immediate local logout
    setUser(null);
    queryClient.clear();

    toast.error('Account Blocked', {
      description: 'Your account has been blocked. Please contact support.',
      duration: 5000,
    });

    router.replace('/');
    
    // Cleanup server session in background
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during signOut for blocked user:', error);
    }
  }, [router, supabase, queryClient]);

  // 2. React to blocked status
  useEffect(() => {
    if (isBlocked) {
      handleBlockedAccount();
    }
  }, [isBlocked, handleBlockedAccount]);

  // 3. Initialize Auth & Listen for Changes
  useEffect(() => {
    let mounted = true;

    // Initial session check
    const initializeAuth = async () => {
      try {
        // using getSession instead of getUser for faster initial load (cache-first)
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setAuthLoading(false);
          if (session?.user) {
            router.refresh();
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthLoading(false);
        queryClient.clear();
        router.refresh();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(currentUser);
        setAuthLoading(false);
        router.refresh();
      } else if (event === 'INITIAL_SESSION') {
        // Handled by initializeAuth, but good as fallback
        setUser(currentUser);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, queryClient, router]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Account does not exist or password is incorrect.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please confirm your email address before logging in.');
          } else {
            throw error;
          }
        }

        if (data.user) {
          queryClient.clear();
          setUser(data.user);
          router.refresh();
          // Profile query will auto-run because of enabled: !!user.id
        }

        return { error: null };
      } catch (err: unknown) {
        return { error: err as Error };
      }
    },
    [supabase, queryClient, router]
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
          throw new Error('An account with this email already exists.');
        }

        const emailRedirectTo =
          typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;

        const { data, error } = await supabase.auth.signUp({
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
           throw error;
        }

        if (data?.session || data?.user) {
          // Don't auto-login on signup if email confirmation is required, 
          // but if it's not, this might sign them in. 
          // For safety/consistency with strict auth flow:
          await supabase.auth.signOut();
          setUser(null);
          queryClient.clear();
        }

        return { error: null };
      } catch (err: unknown) {
        return { error: err as Error };
      }
    },
    [supabase, queryClient]
  );

  const signOut = useCallback(async () => {
    // Optimistic UI update & navigation
    // Do this FIRST so the user sees immediate action
    setUser(null);
    queryClient.clear();
    router.replace('/'); // Redirect to home page
    router.refresh(); // Update server components/middleware
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
    }
  }, [supabase, router, queryClient]);

  const refreshUser = useCallback(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
         queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
      }
    },
    [supabase, queryClient]
  );

  const contextValue = useMemo(
    () => ({
      user,
      loading: authLoading, // Only block on initial auth check
      profileLoading,       // Expose this for granular loading states if needed
      isAdmin,
      isInstructor,
      isBlocked,
      userProfile,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, authLoading, profileLoading, isAdmin, isInstructor, isBlocked, userProfile, signIn, signUp, signOut, refreshUser]
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
