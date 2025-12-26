
-- Create RPC function to get active payment methods
CREATE OR REPLACE FUNCTION public.get_active_payment_methods()
RETURNS SETOF public.payment_methods
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT *
  FROM public.payment_methods
  WHERE is_active = true
  ORDER BY display_order, name;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_active_payment_methods() TO authenticated, anon;
