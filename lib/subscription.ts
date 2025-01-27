import { getStripeInstance } from './stripe';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function getSubscriptionStatus(userId: string) {
  const stripe = getStripeInstance();
  const supabase = createClientComponentClient();
  
  try {
    // First check the cached status in our database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // If no subscription_id, user is not subscribed
    if (!profile?.subscription_id) {
      return 'inactive';
    }

    // Verify with Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);
      
      // Update local database if status differs
      if (subscription.status !== profile.subscription_status) {
        await supabase
          .from('profiles')
          .update({ subscription_status: subscription.status })
          .eq('id', userId);
      }

      return subscription.status;
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
      return profile.subscription_status;
    }
  } catch (error) {
    console.error('Error in getSubscriptionStatus:', error);
    return null;
  }
}

export function isSubscriptionActive(status: string | null) {
  return status === 'active' || status === 'trialing';
} 