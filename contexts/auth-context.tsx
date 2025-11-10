'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const supabase = createClient();
  const router = useRouter();

  const checkIfBlocked = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('is_blocked')
      .eq('id', userId)
      .single();
    
    return data?.is_blocked || false;
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (user) {
          const blocked = await checkIfBlocked(user.id);
          
          if (!mounted) return;
          
          setIsBlocked(blocked);
          
          if (blocked) {
            await supabase.auth.signOut();
            setUser(null);
            toast.error('Account Blocked', {
              description: 'Your account has been blocked. Please contact support.',
              duration: 5000,
            });
            router.push('/');
            return;
          }
        }
        
        if (mounted) {
          setUser(user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const blocked = await checkIfBlocked(session.user.id);
        
        if (!mounted) return;
        
        setIsBlocked(blocked);
        
        if (blocked) {
          await supabase.auth.signOut();
          setUser(null);
          toast.error('Account Blocked', {
            description: 'Your account has been blocked. Please contact support.',
            duration: 5000,
          });
          router.push('/');
          return;
        }
      }
      
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is blocked
      if (data.user) {
        const blocked = await checkIfBlocked(data.user.id);
        if (blocked) {
          await supabase.auth.signOut();
          throw new Error('Your account has been blocked. Please contact support.');
        }
      }

      router.push('/dashboard');
      router.refresh();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const isUserAdmin = isAdmin(user?.id);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: isUserAdmin, isBlocked, signIn, signUp, signOut, refreshUser }}>
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
