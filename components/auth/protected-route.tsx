'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check failed:', error);
          router.push('/auth');
          return;
        }

        if (!session) {
          console.log('No active session found, redirecting to auth');
          router.push('/auth');
        }
      } catch (error) {
        console.error('Protected route check failed:', error);
        router.push('/auth');
      }
    };

    if (!user) {
      checkAuth();
    }
  }, [user, router, supabase]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 