'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function PricingCards() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const supabase = createClientComponentClient();

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(priceId);

      // Check if user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to subscribe',
          variant: 'destructive',
        });
        router.push('/auth');
        return;
      }

      // Check if user already has an active subscription
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();

      if (profile?.subscription_status === 'active') {
        toast({
          title: 'Subscription Active',
          description: 'You already have an active subscription',
          variant: 'default',
        });
        router.push('/dashboard');
        return;
      }
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          couponId: couponCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Something went wrong');
      }

      // Redirect to Stripe Checkout
      router.push(data.url);
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-sm mx-auto">
        <Input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
          <Card key={key} className="p-8">
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 space-y-2">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(tier.priceId)}
                  disabled={isLoading !== null}
                >
                  {isLoading === tier.priceId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 