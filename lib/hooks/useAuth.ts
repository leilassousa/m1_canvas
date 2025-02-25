import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    },
    []
  )

  const signUp = useCallback(
    async (email: string, password: string, options?: { emailRedirectTo?: string }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    },
    []
  )

  const resetPassword = useCallback(
    async (email: string) => {
      // Get the site URL - handle both local and production environments
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Log for debugging
      console.log('Reset password URL:', `${siteUrl}/auth/reset-callback`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-callback`,
      })
      
      if (error) {
        console.error('Reset password error:', error);
        throw error;
      }
      
      return { success: true }
    },
    []
  )

  const updatePassword = useCallback(
    async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      
      if (error) {
        console.error('Update password error:', error);
        throw error;
      }
      
      return { success: true }
    },
    []
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }
} 