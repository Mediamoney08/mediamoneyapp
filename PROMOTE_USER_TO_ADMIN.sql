-- ============================================
-- PROMOTE EXISTING USER TO ADMIN
-- ============================================
-- This is the EASIEST way to create an admin user
-- 
-- INSTRUCTIONS:
-- 1. First, sign up normally through the website
-- 2. Note your email address
-- 3. Run this SQL in Supabase SQL Editor
-- 4. Replace 'your-email@example.com' with your actual email
-- ============================================

UPDATE public.profiles
SET role = 'admin'::user_role
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE THIS WITH YOUR EMAIL

-- Verify it worked:
SELECT 
  id,
  email,
  username,
  role,
  created_at
FROM public.profiles
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE THIS WITH YOUR EMAIL
