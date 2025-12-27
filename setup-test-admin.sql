-- Setup Test Admin Account
-- Run this SQL in Supabase SQL Editor to promote an existing user to admin
-- or to check if the test admin exists

-- Step 1: Check if test admin exists
SELECT 
  id, 
  email, 
  username, 
  role,
  created_at
FROM profiles 
WHERE email = 'admin@preview.test';

-- Step 2: If the user exists, promote to admin (run this after signup)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@preview.test'
RETURNING id, email, username, role;

-- Step 3: Verify admin role
SELECT 
  id, 
  email, 
  username, 
  role,
  wallet_balance,
  created_at
FROM profiles 
WHERE email = 'admin@preview.test';

-- Alternative: Promote any user to admin by email
-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'YOUR_EMAIL_HERE'
-- RETURNING id, email, username, role;

-- List all admin users
SELECT 
  id, 
  email, 
  username, 
  role,
  created_at
FROM profiles 
WHERE role = 'admin'
ORDER BY created_at DESC;
