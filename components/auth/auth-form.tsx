'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: 'login' | 'register';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check for beta code in URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') {
      // Set the form to register mode if coming from beta code flow
      router.replace('/auth?mode=register');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        await signIn(data.email, data.password);
        router.push('/dashboard');
      } else {
        // Get beta code from localStorage if exists
        const betaCode = localStorage.getItem('betaCode');
        
        // Include beta code in redirect URL if exists
        const redirectTo = betaCode 
          ? `${window.location.origin}/auth/callback?beta_code=${betaCode}`
          : `${window.location.origin}/auth/callback`;

        await signUp(data.email, data.password, {
          emailRedirectTo: redirectTo,
        });

        // Clear beta code from localStorage
        localStorage.removeItem('betaCode');
        
        // Show success message for registration
        setError('Please check your email to verify your account.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant={mode === 'register' && error.includes('check your email') ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {mode === 'login' && (
        <div className="flex items-center justify-end">
          <Button 
            variant="link" 
            className="text-sm text-orange-600 hover:text-orange-500"
            onClick={() => {/* TODO: Implement password reset */}}
            type="button"
          >
            Forgot password?
          </Button>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            Processing...
          </span>
        ) : mode === 'login' ? (
          'Sign in'
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}