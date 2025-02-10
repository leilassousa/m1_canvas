-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create more permissive policies
CREATE POLICY "Enable read access for authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable insert for new users
CREATE POLICY "Enable insert for authenticated users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Make sure profiles are created for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    is_admin,
    subscription_status,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    '',  -- empty string for full_name
    false,  -- default is_admin to false
    'inactive',  -- default subscription_status
    now(),  -- created_at
    now()   -- updated_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add beta-related columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_beta_user BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS beta_code_used TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_beta_user ON profiles(is_beta_user); 