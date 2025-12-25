/**
 * Supabase Client - Alternative Naming Convention
 * 
 * This file provides an alternative naming convention for the Supabase client.
 * It re-exports the client from the main location at src/db/supabase.ts
 * 
 * Usage:
 * import { supabase, supabaseClient } from '@/lib/supabaseClient';
 * 
 * Note: The primary Supabase client is located at src/db/supabase.ts
 */

import { supabase as supabaseInstance } from '@/db/supabase';

// Export with both names for flexibility
export const supabase = supabaseInstance;
export const supabaseClient = supabaseInstance;

// Default export
export default supabaseClient;
