'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Provider as SupabaseProvider } from '@supabase/supabase-js';

interface SocialProvider {
  name: string;
  provider: SupabaseProvider;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

const socialProviders: SocialProvider[] = [
  {
    name: 'Google',
    provider: 'google',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    provider: 'github',
    icon: Github,
    className: 'bg-[#24292F] hover:bg-[#1a1e23] text-white',
  },
];

export function AuthSocial() {
  const supabase = createClient();

  const handleSocialLogin = async (provider: SupabaseProvider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('OAuth error:', error.message);
        throw error;
      }
    } catch (err) {
      console.error('Social login error:', err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {socialProviders.map(({ name, provider, icon: Icon, className }) => (
        <Button
          key={name}
          variant="outline"
          className={`w-full ${className || ''}`}
          onClick={() => handleSocialLogin(provider)}
        >
          <Icon className="w-5 h-5 mr-2" />
          {name}
        </Button>
      ))}
    </div>
  );
}