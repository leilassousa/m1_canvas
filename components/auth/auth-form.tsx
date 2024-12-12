'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormProps = {
  mode: 'login' | 'register';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Here you would implement your authentication logic
      console.log('Form submitted:', data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
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
          <p className="text-sm text-red-500">{errors.email.message as string}</p>
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
          <p className="text-sm text-red-500">{errors.password.message as string}</p>
        )}
      </div>

      {mode === 'login' && (
        <div className="flex items-center justify-end">
          <Button variant="link" className="text-sm text-orange-600 hover:text-orange-500">
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