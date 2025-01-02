'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient<Database>();

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', { session });
        
        setUser(session?.user ?? null);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', { event, session });
            setUser(session?.user ?? null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [supabase]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Login successful:', {
        user: data.user,
        isAuthenticated: true
      });

      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      console.log('Logout successful');
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Debug auth state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: !!user,
      user,
      pathname
    });
  }, [user, pathname]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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