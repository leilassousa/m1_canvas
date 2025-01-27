-- Add Stripe columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_id text;

-- Add Stripe columns to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS payment_intent_id text;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status 
ON profiles(subscription_status);

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id 
ON profiles(subscription_id);

CREATE INDEX IF NOT EXISTS idx_purchases_subscription_id 
ON purchases(subscription_id);

-- Add RLS policies for Stripe-related columns
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Purchases policies
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
ON purchases FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
ON purchases FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id); 