
-- Create an RPC function to get the current user's profile
-- This bypasses RLS and uses SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (
  id uuid,
  email text,
  username text,
  role user_role,
  wallet_balance numeric,
  currency text,
  created_at timestamptz,
  updated_at timestamptz,
  user_level_id uuid,
  total_spent numeric,
  preferred_currency text,
  preferred_language text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.username,
    p.role,
    p.wallet_balance,
    p.currency,
    p.created_at,
    p.updated_at,
    p.user_level_id,
    p.total_spent,
    p.preferred_currency,
    p.preferred_language
  FROM public.profiles p
  WHERE p.id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated, anon;
