'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function PasswordResetForm({ onCancel }: { onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Password reset instructions have been sent to your email.
          </AlertDescription>
        </Alert>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Reset your password</h3>
        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 