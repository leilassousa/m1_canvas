import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getStripeInstance } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const stripe = getStripeInstance();
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          throw new Error('No user ID in session metadata');
        }

        // Record the purchase
        await supabase
          .from('purchases')
          .insert({
            user_id: userId,
            product_id: 1, // You'll need to map this to your product IDs
            status: 'completed',
            amount: session.amount_total || 0,
            subscription_id: session.subscription as string,
            payment_intent_id: session.payment_intent as string,
          });

        // Update user's subscription status
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_id: session.subscription as string,
          })
          .eq('id', userId);

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (!userId) {
          throw new Error('No user ID in subscription metadata');
        }

        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
          })
          .eq('id', userId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (!userId) {
          throw new Error('No user ID in subscription metadata');
        }

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'inactive',
            subscription_id: null,
          })
          .eq('id', userId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 