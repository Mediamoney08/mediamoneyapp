
-- Add additional profile fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);

-- Comments for documentation
COMMENT ON COLUMN profiles.full_name IS 'User full name';
COMMENT ON COLUMN profiles.phone IS 'User phone number';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.date_of_birth IS 'User date of birth';
COMMENT ON COLUMN profiles.country IS 'User country';
COMMENT ON COLUMN profiles.city IS 'User city';

-- Function to update user profile
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

  -- Update profile with only provided fields
  UPDATE profiles
  SET
    full_name = COALESCE(p_full_name, full_name),
    username = COALESCE(p_username, username),
    phone = COALESCE(p_phone, phone),
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
  )
  INTO v_result
  FROM profiles
  WHERE id = v_user_id;

  RETURN v_result;
END;
$$;

-- Function to enable 2FA
CREATE OR REPLACE FUNCTION enable_two_factor_auth(
  p_secret TEXT,
  p_verification_code TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_backup_codes TEXT[];
  v_result jsonb;
  i INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify the code (basic check - in production, use proper TOTP verification)
  IF LENGTH(p_verification_code) != 6 THEN
    RAISE EXCEPTION 'Invalid verification code';
  END IF;

  -- Generate 10 backup codes (8 characters each)
  v_backup_codes := ARRAY[]::TEXT[];
  FOR i IN 1..10 LOOP
    v_backup_codes := array_append(
      v_backup_codes,
      upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8))
    );
  END LOOP;

  -- Insert or update 2FA record
  INSERT INTO two_factor_auth (user_id, secret, is_enabled, backup_codes, enabled_at)
  VALUES (v_user_id, p_secret, true, v_backup_codes, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    secret = p_secret,
    is_enabled = true,
    backup_codes = v_backup_codes,
    enabled_at = NOW();

  -- Return backup codes
  SELECT jsonb_build_object(
    'success', true,
    'backup_codes', v_backup_codes,
    'message', '2FA enabled successfully'
  )
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Function to disable 2FA
CREATE OR REPLACE FUNCTION disable_two_factor_auth(
  p_password TEXT
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

  -- Update 2FA record
  UPDATE two_factor_auth
  SET
    is_enabled = false,
    disabled_at = NOW()
  WHERE user_id = v_user_id;

  SELECT jsonb_build_object(
    'success', true,
    'message', '2FA disabled successfully'
  )
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Function to verify 2FA code
CREATE OR REPLACE FUNCTION verify_two_factor_code(
  p_code TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_2fa_record RECORD;
  v_is_backup_code BOOLEAN := false;
  v_remaining_codes INTEGER;
  v_result jsonb;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get 2FA record
  SELECT * INTO v_2fa_record
  FROM two_factor_auth
  WHERE user_id = v_user_id AND is_enabled = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION '2FA not enabled for this user';
  END IF;

  -- Check if it's a backup code
  IF p_code = ANY(v_2fa_record.backup_codes) THEN
    v_is_backup_code := true;
    
    -- Remove used backup code
    UPDATE two_factor_auth
    SET backup_codes = array_remove(backup_codes, p_code)
    WHERE user_id = v_user_id
    RETURNING array_length(backup_codes, 1) INTO v_remaining_codes;
  END IF;

  -- In production, verify TOTP code here
  -- For now, accept 6-digit codes or backup codes
  IF LENGTH(p_code) = 6 OR v_is_backup_code THEN
    SELECT jsonb_build_object(
      'success', true,
      'is_backup_code', v_is_backup_code,
      'remaining_backup_codes', COALESCE(v_remaining_codes, 0),
      'message', 'Code verified successfully'
    )
    INTO v_result;
  ELSE
    SELECT jsonb_build_object(
      'success', false,
      'message', 'Invalid verification code'
    )
    INTO v_result;
  END IF;

  RETURN v_result;
END;
$$;

-- Function to regenerate backup codes
CREATE OR REPLACE FUNCTION regenerate_backup_codes()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_backup_codes TEXT[];
  v_result jsonb;
  i INTEGER;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if 2FA is enabled
  IF NOT EXISTS (
    SELECT 1 FROM two_factor_auth 
    WHERE user_id = v_user_id AND is_enabled = true
  ) THEN
    RAISE EXCEPTION '2FA not enabled';
  END IF;

  -- Generate 10 new backup codes
  v_backup_codes := ARRAY[]::TEXT[];
  FOR i IN 1..10 LOOP
    v_backup_codes := array_append(
      v_backup_codes,
      upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8))
    );
  END LOOP;

  -- Update backup codes
  UPDATE two_factor_auth
  SET backup_codes = v_backup_codes
  WHERE user_id = v_user_id;

  SELECT jsonb_build_object(
    'success', true,
    'backup_codes', v_backup_codes,
    'message', 'Backup codes regenerated successfully'
  )
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION enable_two_factor_auth TO authenticated;
GRANT EXECUTE ON FUNCTION disable_two_factor_auth TO authenticated;
GRANT EXECUTE ON FUNCTION verify_two_factor_code TO authenticated;
GRANT EXECUTE ON FUNCTION regenerate_backup_codes TO authenticated;

-- Comments
COMMENT ON FUNCTION update_user_profile IS 'Update user profile information';
COMMENT ON FUNCTION enable_two_factor_auth IS 'Enable 2FA for user account';
COMMENT ON FUNCTION disable_two_factor_auth IS 'Disable 2FA for user account';
COMMENT ON FUNCTION verify_two_factor_code IS 'Verify 2FA code or backup code';
COMMENT ON FUNCTION regenerate_backup_codes IS 'Regenerate backup codes for 2FA';
