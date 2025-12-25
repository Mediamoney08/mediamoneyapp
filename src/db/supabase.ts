/**
 * Supabase Client Configuration
 * 
 * This is the primary Supabase client instance for the application.
 * It connects to your Supabase project using environment variables.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * Usage:
 * import { supabase } from '@/db/supabase';
 * 
 * Alternative Import Paths:
 * - import { supabase } from '@/lib/supabase';
 * - import { supabase } from '@/supabase';
 * - import { supabaseClient } from '@/lib/supabaseClient';
 * 
 * @see https://supabase.com/docs/reference/javascript/introduction
 */

import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing environment variable: VITE_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: VITE_SUPABASE_ANON_KEY");
}

/**
 * Supabase client instance
 * 
 * This client is configured with:
 * - Authentication: Automatic session management
 * - Real-time: Disabled (not supported in current environment)
 * - Auto-refresh: Enabled for auth tokens
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Export as default for convenience
export default supabase;
