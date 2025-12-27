-- Update the update_user_profile function to prevent username, email, and phone changes
-- Only allow updates to: full_name, avatar_url, date_of_birth, country, city

CREATE OR REPLACE FUNCTION update_user_profile(
  p_full_name TEXT DEFAULT NULL,
  p_username TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_date_of_birth DATE DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result jsonb;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Update profile with only allowed fields (username and phone are NOT updated)
  UPDATE profiles
  SET
    full_name = COALESCE(p_full_name, full_name),
    -- username = COALESCE(p_username, username),  -- REMOVED: username cannot be changed
    -- phone = COALESCE(p_phone, phone),          -- REMOVED: phone cannot be changed
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
    country = COALESCE(p_country, country),
    city = COALESCE(p_city, city),
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Return updated profile
  SELECT jsonb_build_object(
    'id', id,
    'email', email,
    'username', username,
    'full_name', full_name,
    'phone', phone,
    'avatar_url', avatar_url,
    'date_of_birth', date_of_birth,
    'country', country,
    'city', city,
    'role', role,
    'wallet_balance', wallet_balance,
    'currency', currency,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_result
  FROM profiles
  WHERE id = v_user_id;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION update_user_profile IS 'Update user profile information (username, email, and phone cannot be changed)';
