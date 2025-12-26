-- ============================================
-- ADMIN USER SETUP SCRIPT
-- ============================================
-- This script will help you set up admin access
-- Run this in your Supabase SQL Editor

-- Step 1: View all users to find your user_id
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Check current profiles
SELECT 
  user_id,
  username,
  email,
  role,
  wallet_balance
FROM profiles
ORDER BY created_at DESC;

-- Step 3: Set a user as admin (REPLACE 'YOUR_USER_ID' with actual user_id from Step 1)
-- IMPORTANT: Copy the user_id from Step 1 and paste it below
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Step 4: Verify the change
SELECT 
  user_id,
  username,
  email,
  role,
  wallet_balance
FROM profiles
WHERE role = 'admin';

-- ============================================
-- ALTERNATIVE: Set admin by email
-- ============================================
-- If you know your email, use this instead:

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- ============================================
-- QUICK SETUP: Make the first user admin
-- ============================================
-- This will make the oldest registered user an admin

UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- ============================================
-- VERIFY ADMIN ACCESS
-- ============================================
SELECT 
  p.user_id,
  p.username,
  p.email,
  p.role,
  p.wallet_balance,
  u.created_at as registered_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.role = 'admin';
