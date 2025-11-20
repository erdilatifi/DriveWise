'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  userProfile: { full_name?: string; email?: string } | null;
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
  const [userProfile, setUserProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const queryClient = useQueryClient();

  const checkIfBlocked = useCallback(async (userId: string, skipProfileUpdate = false) => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('is_blocked, full_name, email')
        .eq('id', userId)
        .single();
      
      if (data && !skipProfileUpdate) {
        setUserProfile({
          full_name: data.full_name,
          email: data.email
        });
      }
      
      return data?.is_blocked || false;
    } catch (error) {
      console.error('Error checking user status:', error);
      return false;
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized) return;
    
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        // Immediately update auth state for fast UI feedback
        setUser(user);
        setLoading(false);
        setInitialized(true);

        if (!user) {
          setUserProfile(null);
          setIsBlocked(false);
          return;
        }

        // Run blocked/profile check in the background
        const blocked = await checkIfBlocked(user.id);

        if (!mounted) return;

        setIsBlocked(blocked);

        if (blocked) {
          await supabase.auth.signOut();
          setUser(null);
          setUserProfile(null);
          toast.error('Account Blocked', {
            description: 'Your account has been blocked. Please contact support.',
            duration: 5000,
          });
          router.push('/');
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setIsBlocked(false);
        setLoading(false);
        return;
      }

      const currentUser = session?.user ?? null;

      // Immediately reflect auth state change in UI
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        setUserProfile(null);
        setIsBlocked(false);
        return;
      }

      // Background blocked/profile check
      const blocked = await checkIfBlocked(currentUser.id);

      if (!mounted) return;

      setIsBlocked(blocked);

      if (blocked) {
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
        toast.error('Account Blocked', {
          description: 'Your account has been blocked. Please contact support.',
          duration: 5000,
        });
        router.push('/');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router, checkIfBlocked, initialized]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Account does not exist or password is incorrect. Please check your credentials or sign up.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before logging in.');
        } else {
          throw error;
        }
      }

      // Quick check if user is blocked (skip profile update for speed)
      if (data.user) {
        const blocked = await checkIfBlocked(data.user.id, true);
        if (blocked) {
          await supabase.auth.signOut();
          throw new Error('Your account has been blocked. Please contact support.');
        }

        // Immediately update user state and fetch profile
        setUser(data.user);
        setLoading(false);

        // Fetch user profile to update navbar immediately
        await checkIfBlocked(data.user.id, false);

        // Force router refresh to update UI
        router.refresh();
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  }, [supabase, checkIfBlocked, router]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        // Provide user-friendly error messages
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
  }, [supabase]);

  const signOut = useCallback(async () => {
    // Set loading state to show loader during logout
    setLoading(true);
    
    // Clear state immediately
    setUser(null);
    setUserProfile(null);
    setIsBlocked(false);
    queryClient.clear();
    
    await supabase.auth.signOut();
    
    // Force router refresh and redirect
    router.refresh();
    router.push('/');
    
    // Reset loading after redirect (shorter timeout)
    setTimeout(() => setLoading(false), 50);
  }, [supabase, router, queryClient]);

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await checkIfBlocked(user.id);
    } else {
      setUserProfile(null);
    }
  }, [supabase, checkIfBlocked]);

  const isUserAdmin = useMemo(() => isAdmin(user?.id), [user?.id]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAdmin: isUserAdmin,
    isBlocked,
    userProfile,
    signIn,
    signUp,
    signOut,
    refreshUser
  }), [user, loading, isUserAdmin, isBlocked, userProfile, signIn, signUp, signOut, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
