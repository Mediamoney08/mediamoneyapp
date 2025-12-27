-- ============================================
-- CREATE ADMIN USER FOR RECHARGE HUB
-- ============================================
-- This script creates a test admin user for development
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Create the admin user in auth.users
-- Note: You need to replace 'your-secure-password' with your actual password
-- The email will be: admin@rechargehub.com

-- First, let's check if the user already exists
DO $$
DECLARE
  admin_user_id uuid;
  admin_email text := 'admin@rechargehub.com';
  admin_password text := 'Admin123!@#'; -- Change this to your preferred password
BEGIN
  -- Check if user exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- If user doesn't exist, create them
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users (this is the Supabase Auth table)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_user_id;

    RAISE NOTICE 'Created new admin user with ID: %', admin_user_id;

    -- Create profile with admin role
    INSERT INTO public.profiles (
      id,
      email,
      username,
      role,
      wallet_balance,
      currency,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      admin_email,
      'admin',
      'admin'::user_role,
      0,
      'USD',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin'::user_role;

    RAISE NOTICE 'Admin profile created successfully';
  ELSE
    -- User exists, just update their role to admin
    UPDATE public.profiles
    SET role = 'admin'::user_role
    WHERE id = admin_user_id;

    RAISE NOTICE 'Updated existing user % to admin role', admin_user_id;
  END IF;
END $$;

-- ============================================
-- ALTERNATIVE: Promote an existing user to admin
-- ============================================
-- If you already have a user account and want to make it admin,
-- uncomment and run this instead:

-- UPDATE public.profiles
-- SET role = 'admin'::user_role
-- WHERE email = 'your-email@example.com';  -- Replace with your email

-- ============================================
-- VERIFY ADMIN USER
-- ============================================
-- Run this to verify the admin user was created correctly:

SELECT 
  p.id,
  p.email,
  p.username,
  p.role,
  p.wallet_balance,
  p.created_at
FROM public.profiles p
WHERE p.role = 'admin'::user_role;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Email: admin@rechargehub.com
-- Password: Admin123!@# (or whatever you set above)
-- ============================================
