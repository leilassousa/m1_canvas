-- Add subscription fields to profiles table
ALTER TABLE profiles
ADD COLUMN subscription_status text DEFAULT 'inactive',
ADD COLUMN subscription_id text;

-- Add Stripe-related fields to purchases table
ALTER TABLE purchases
ADD COLUMN subscription_id text,
ADD COLUMN payment_intent_id text; 