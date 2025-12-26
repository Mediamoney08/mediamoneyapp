
-- Allow users to insert their own profile (one-time only)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow service_role to insert profiles (for triggers)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);
