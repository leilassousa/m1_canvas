import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getStripeInstance } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const stripe = getStripeInstance();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message },
        { status: 401 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Please log in to continue' },
        { status: 401 }
      );
    }

    // Get the price ID and coupon from the request
    const { priceId, couponId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check if user already has an active subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_id')
      .eq('id', session.user.id)
      .single();

    if (profile?.subscription_status === 'active') {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url: `${baseUrl}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      client_reference_id: session.user.id,
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
        trial_period_days: 14, // Add 14-day trial
      },
    });

    if (!checkoutSession.url) {
      console.error('Failed to create checkout URL');
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 